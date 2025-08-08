import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  /**
   * Generate a URL-friendly slug from a title string
   * @param title - The title to convert to a slug
   * @returns A URL-safe slug string
   */
  generateSlug(title: string): string {
    return title
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing whitespace
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Generate a unique slug by appending a number if the base slug already exists
   * @param baseSlug - The base slug to make unique
   * @param existingSlugs - Array of existing slugs to check against
   * @returns A unique slug
   */
  generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}
