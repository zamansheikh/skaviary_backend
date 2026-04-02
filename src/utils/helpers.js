import slugify from 'slugify';

export function createSlug(text) {
  // Try slugify first (works for latin chars)
  let slug = slugify(text, { lower: true, strict: true });

  // If empty (non-latin like Bangla), create a transliterated/fallback slug
  if (!slug) {
    // Replace spaces/special chars with hyphens, keep unicode letters
    slug = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // If still empty, use timestamp
  if (!slug) {
    slug = `item-${Date.now()}`;
  }

  return slug;
}

export function paginate(query, page = 1, limit = 12) {
  const offset = (page - 1) * limit;
  return { limit, offset, page };
}
