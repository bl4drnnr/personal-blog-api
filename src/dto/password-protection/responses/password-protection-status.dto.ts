export class PasswordProtectionStatusDto {
  isActive: boolean;
  heroTitle: string;
  heroImage: string;
  metaTitle: string;

  constructor(data: {
    isActive: boolean;
    heroTitle: string;
    heroImage: string;
    metaTitle: string;
  }) {
    this.isActive = data.isActive;
    this.heroTitle = data.heroTitle;
    this.heroImage = data.heroImage;
    this.metaTitle = data.metaTitle;
  }
}
