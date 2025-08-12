export class PasswordProtectionStatusDto {
  isActive: boolean;
  heroTitle: string;
  footerText: string;
  heroImage: string;

  constructor(data: {
    isActive: boolean;
    heroTitle: string;
    footerText: string;
    heroImage: string;
  }) {
    this.isActive = data.isActive;
    this.heroTitle = data.heroTitle;
    this.footerText = data.footerText;
    this.heroImage = data.heroImage;
  }
}
