import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Faq } from '@models/faq.model';
import { CreateFaqDto } from '@dto/faq/requests/create-faq.dto';
import { UpdateFaqDto } from '@dto/faq/requests/update-faq.dto';
import { GetFaqsDto } from '@dto/faq/requests/get-faqs.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Faq)
    private faqModel: typeof Faq
  ) {}

  async findAll(query: GetFaqsDto) {
    const {
      page: pageParam = '0',
      pageSize: pageSizeParam = '20',
      search,
      isActive,
      featured,
      orderBy = 'sortOrder',
      order = 'ASC'
    } = query;

    // Convert string parameters to numbers
    const page = parseInt(pageParam.toString(), 10) || 0;
    const pageSize = parseInt(pageSizeParam.toString(), 10) || 20;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { question: { [Op.iLike]: `%${search}%` } },
        { answer: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Handle boolean filters - only apply if explicitly provided
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true';
    }

    if (featured !== undefined && featured !== null && featured !== '') {
      where.featured = featured === 'true';
    }

    const [faqs, total] = await Promise.all([
      this.faqModel.findAll({
        where,
        order: [[orderBy, order]],
        offset: page * pageSize,
        limit: pageSize
      }),
      this.faqModel.count({ where })
    ]);

    return {
      faqs: faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        sortOrder: faq.sortOrder,
        isActive: faq.isActive,
        featured: faq.featured,
        createdAt: faq.createdAt,
        updatedAt: faq.updatedAt
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  async findById(id: string) {
    const faq = await this.faqModel.findByPk(id);

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder,
      isActive: faq.isActive,
      featured: faq.featured,
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt
    };
  }

  async create({ data, trx }: { data: CreateFaqDto; trx: any }) {
    const faq = await this.faqModel.create(data, { transaction: trx });

    return {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      sortOrder: faq.sortOrder,
      isActive: faq.isActive,
      featured: faq.featured,
      createdAt: faq.createdAt,
      updatedAt: faq.updatedAt
    };
  }

  async update({ id, data, trx }: { id: string; data: UpdateFaqDto; trx: any }) {
    const faq = await this.faqModel.findByPk(id);

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    await this.faqModel.update(data, {
      where: { id },
      transaction: trx
    });

    const updatedFaq = await this.faqModel.findByPk(id, { transaction: trx });

    return {
      id: updatedFaq.id,
      question: updatedFaq.question,
      answer: updatedFaq.answer,
      sortOrder: updatedFaq.sortOrder,
      isActive: updatedFaq.isActive,
      featured: updatedFaq.featured,
      createdAt: updatedFaq.createdAt,
      updatedAt: updatedFaq.updatedAt
    };
  }

  async delete({ id, trx }) {
    const faq = await this.faqModel.findByPk(id);

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    await this.faqModel.destroy({
      where: { id },
      transaction: trx
    });

    return { message: 'FAQ deleted successfully' };
  }

  async updateSortOrder({ faqs, trx }) {
    const updatePromises = faqs.map(({ id, sortOrder }) =>
      this.faqModel.update(
        { sortOrder },
        {
          where: { id },
          transaction: trx
        }
      )
    );

    await Promise.all(updatePromises);

    return { message: 'FAQ sort order updated successfully' };
  }
}
