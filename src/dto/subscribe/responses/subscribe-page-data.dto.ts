export class SubscribePageContentDto {
  title: string;
  subtitle: string;
  description: string;
  carouselWords: string[];
  submitButtonText: string;
  successMessage: string;
  errorMessage: string;
  emailPlaceholder: string;
  privacyText: string;
}

export class SubscribePageLayoutDto {
  heroImageMain: string | null;
  heroImageSecondary: string | null;
  heroImageMainAlt: string;
  heroImageSecondaryAlt: string;
  logoText: string;
  breadcrumbText: string;
  heroTitle: string;
  heroDesc: string;
}

export class SubscribePageSeoDto {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  structuredData: object;
}

export class SubscribePageDataDto {
  pageContent: SubscribePageContentDto;
  layoutData: SubscribePageLayoutDto;
  seoData: SubscribePageSeoDto;
}

export class SubscribePageAdminDto {
  id: string;
  title: string;
  subtitle: string;
  description: string;
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
  emailPlaceholder: string;
  privacyText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImageId: string;
  structuredData: object;
}
