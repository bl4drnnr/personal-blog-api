import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MaintenanceMode } from '@models/maintenance-mode.model';
import { UpdateMaintenanceModeInterface } from '@interfaces/update-maintenance-mode.interface';
import { StaticAssetsService } from '@modules/static-assets.service';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(MaintenanceMode)
    private maintenanceModeModel: typeof MaintenanceMode,
    private staticAssetsService: StaticAssetsService
  ) {}

  async getMaintenanceStatus() {
    const maintenanceMode = await this.maintenanceModeModel.findOne();

    // Get the actual image URL from the static asset
    const heroImageUrl = await this.staticAssetsService.getStaticAsset(
      maintenanceMode.heroImageId
    );

    return {
      isActive: maintenanceMode.isActive,
      message: maintenanceMode.message,
      fromDate: maintenanceMode.fromDate,
      toDate: maintenanceMode.toDate,
      heroImage: heroImageUrl,
      heroTitle: maintenanceMode.heroTitle,
      footerText: maintenanceMode.footerText,
      title: maintenanceMode.title
    };
  }

  async getMaintenanceModeAdmin() {
    let maintenanceMode = await this.maintenanceModeModel.findOne();

    // If no maintenance mode record exists, create a default one
    if (!maintenanceMode) {
      // Get a random asset ID for the default
      const randomAsset = await this.staticAssetsService.getRandomAssetId();

      maintenanceMode = await this.maintenanceModeModel.create({
        isActive: false,
        message: 'We are currently performing maintenance. Please check back soon.',
        fromDate: new Date(),
        toDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        heroImageId: randomAsset,
        heroTitle: 'Maintenance',
        footerText: 'Site is under maintenance',
        title: 'Under Maintenance'
      });
    }

    return maintenanceMode;
  }

  async updateMaintenanceMode({ data, trx }: UpdateMaintenanceModeInterface) {
    const maintenanceMode = await this.maintenanceModeModel.findOne({
      transaction: trx
    });

    const updateData: any = {};

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    if (data.message !== undefined) {
      updateData.message = data.message;
    }
    if (data.fromDate !== undefined) {
      updateData.fromDate = new Date(data.fromDate);
    }
    if (data.toDate !== undefined) {
      updateData.toDate = new Date(data.toDate);
    }
    if (data.heroImageId !== undefined) {
      updateData.heroImageId = data.heroImageId;
    }
    if (data.heroTitle !== undefined) {
      updateData.heroTitle = data.heroTitle;
    }
    if (data.footerText !== undefined) {
      updateData.footerText = data.footerText;
    }
    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (Object.keys(updateData).length > 0) {
      await maintenanceMode.update(updateData, { transaction: trx });
    }

    return maintenanceMode;
  }
}
