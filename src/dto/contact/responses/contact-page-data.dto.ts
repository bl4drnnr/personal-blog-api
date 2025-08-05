export class ContactTileDto {
  id: string;
  title: string;
  content: string;
  link: string;
  iconAssetId: string;
  iconUrl: string | null;
  sortOrder: number;
}

export class ContactPageContentDto {
  title: string;
  subtitle: string;
  description: string;
  carouselWords: string[];
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
}

export class ContactPageLayoutDto {
  footerText: string;
  heroImageMain: string | null;
  heroImageSecondary: string | null;
  heroImageMainAlt: string;
  heroImageSecondaryAlt: string;
  logoText: string;
  breadcrumbText: string;
  heroTitle: string;
  heroDesc: string;
}

export class ContactPageSeoDto {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  structuredData: object;
}

export class ContactPageDataDto {
  pageContent: ContactPageContentDto;
  layoutData: ContactPageLayoutDto;
  seoData: ContactPageSeoDto;
  contactTiles: ContactTileDto[];
}

export class ContactPageAdminDto {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  footerText: string;
  heroImageMainId: string;
  heroImageSecondaryId: string;
  heroImageMainAlt: string;
  heroImageSecondaryAlt: string;
  logoText: string;
  breadcrumbText: string;
  heroTitle: string;
  heroDesc: string;
  carouselWords: string;
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;
  structuredData: object;
  contactTiles: ContactTileDto[];
}
