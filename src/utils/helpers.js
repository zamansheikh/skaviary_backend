import slugify from 'slugify';

export function createSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

export function paginate(query, page = 1, limit = 12) {
  const offset = (page - 1) * limit;
  return { limit, offset, page };
}
