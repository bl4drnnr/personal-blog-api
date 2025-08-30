import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MenuPage } from '@models/menu-page.model';
import { MenuTile } from '@models/menu-tile.model';
import { Transaction } from 'sequelize';
import { StaticAssetsService } from '@modules/static-assets/static-assets.service';
import { MenuPageNotFoundException } from '@exceptions/menu-page-not-found.exception';
import { ExperienceNotFoundException } from '@exceptions/menu-page-already-exists.exception';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(MenuPage)
    private readonly menuPageModel: typeof MenuPage,
    @InjectModel(MenuTile)
    private readonly menuTileModel: typeof MenuTile,
    private readonly staticAssetsService: StaticAssetsService
  ) {}

  async getMenuPage() {
    const menuPage = await this.menuPageModel.findOne({
      include: [
        {
          model: MenuTile,
          as: 'menuTiles'
        }
      ],
      order: [[{ model: MenuTile, as: 'menuTiles' }, 'sortOrder', 'ASC']]
    });

    if (!menuPage) {
      throw new MenuPageNotFoundException();
    }

    // Get static asset URLs
    const heroImageMain = await this.staticAssetsService.getStaticAsset(
      menuPage.heroImageMainId
    );
    const ogImage = await this.staticAssetsService.getStaticAsset(
      menuPage.ogImageId
    );

    // Process menu tiles to resolve static asset URLs
    const processedMenuTiles = await Promise.all(
      (menuPage.menuTiles || []).map(async (tile) => {
        const iconAsset = await this.staticAssetsService.getStaticAsset(tile.iconId);
        const imageAsset = await this.staticAssetsService.getStaticAsset(
          tile.imageId
        );

        return {
          ...tile.toJSON(),
          icon: iconAsset,
          image: imageAsset
        };
      })
    );

    return {
      pageContent: {
        heroImageMain: heroImageMain,
        heroImageMainAlt: menuPage.heroImageMainAlt,
        logoText: menuPage.logoText,
        breadcrumbText: menuPage.breadcrumbText,
        menuTiles: processedMenuTiles
      },
      layoutData: {
        heroImageMain: heroImageMain,
        heroImageMainAlt: menuPage.heroImageMainAlt,
        logoText: menuPage.logoText,
        breadcrumbText: menuPage.breadcrumbText
      },
      seoData: {
        metaTitle: menuPage.metaTitle,
        metaDescription: menuPage.metaDescription,
        metaKeywords: menuPage.metaKeywords,
        ogTitle: menuPage.ogTitle,
        ogDescription: menuPage.ogDescription,
        ogImage: ogImage,
        structuredData: menuPage.structuredData
      }
    };
  }

  async getMenuPageDataAdmin() {
    const menuPage = await this.menuPageModel.findOne();

    if (!menuPage) {
      throw new MenuPageNotFoundException();
    }

    return menuPage;
  }

  async updateMenuPage({
    menuPageId,
    data,
    trx
  }: {
    menuPageId: string;
    data: Partial<MenuPage>;
    trx: Transaction;
  }) {
    const menuPage = await this.menuPageModel.findByPk(menuPageId, {
      transaction: trx
    });

    if (!menuPage) {
      throw new MenuPageNotFoundException();
    }

    await menuPage.update(data, { transaction: trx });

    return {
      message: 'Menu page updated successfully',
      menuPage
    };
  }

  async createMenuPage({
    data,
    trx
  }: {
    data: Partial<MenuPage>;
    trx: Transaction;
  }) {
    // Check if menu page already exists (should only be one)
    const existingPage = await this.menuPageModel.findOne({ transaction: trx });

    if (existingPage) {
      throw new ExperienceNotFoundException();
    }

    const menuPage = await this.menuPageModel.create(data, { transaction: trx });

    return {
      message: 'Menu page created successfully',
      menuPage
    };
  }

  // Menu Tile Methods
  async getMenuTiles() {
    return await this.menuTileModel.findAll({
      order: [['sortOrder', 'ASC']]
    });
  }

  async createMenuTile({
    data,
    trx
  }: {
    data: Partial<MenuTile>;
    trx: Transaction;
  }) {
    // Find the menu page to associate with
    const menuPage = await this.menuPageModel.findOne({ transaction: trx });

    if (!menuPage) {
      throw new MenuPageNotFoundException();
    }

    // Set the menu page ID
    const menuTileData = {
      ...data,
      menuPageId: menuPage.id,
      sortOrder: data.sortOrder ?? (await this.getNextSortOrder(trx))
    };

    const menuTile = await this.menuTileModel.create(menuTileData, {
      transaction: trx
    });

    return {
      message: 'Menu tile created successfully',
      menuTile
    };
  }

  async updateMenuTile({
    menuTileId,
    data,
    trx
  }: {
    menuTileId: string;
    data: Partial<MenuTile>;
    trx: Transaction;
  }) {
    const menuTile = await this.menuTileModel.findByPk(menuTileId, {
      transaction: trx
    });

    if (!menuTile) {
      throw new NotFoundException('Menu tile not found');
    }

    await menuTile.update(data, { transaction: trx });

    return {
      message: 'Menu tile updated successfully',
      menuTile
    };
  }

  async deleteMenuTile({
    menuTileId,
    trx
  }: {
    menuTileId: string;
    trx: Transaction;
  }) {
    const menuTile = await this.menuTileModel.findByPk(menuTileId, {
      transaction: trx
    });

    if (!menuTile) {
      throw new NotFoundException('Menu tile not found');
    }

    await menuTile.destroy({ transaction: trx });

    return {
      message: 'Menu tile deleted successfully'
    };
  }

  private async getNextSortOrder(trx: Transaction): Promise<number> {
    const lastTile = await this.menuTileModel.findOne({
      order: [['sortOrder', 'DESC']],
      transaction: trx
    });

    return (lastTile?.sortOrder ?? -1) + 1;
  }
}
