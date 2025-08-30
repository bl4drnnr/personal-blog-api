export class PublicSocialLinkDto {
  url: string;
  alt: string;
  icon: string; // This will contain the full S3 URL
}

export class AdminSocialLinkDto {
  id: string;
  url: string;
  alt: string;
  iconId: string; // This contains the static asset ID
  createdAt: Date;
  updatedAt: Date;
}
