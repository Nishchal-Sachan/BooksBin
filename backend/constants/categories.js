/** All categories sellers can list (books, posters, merch, etc.) */
const PRODUCT_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science & Technology',
  'Biographies',
  'Children',
  'Comics & Graphic Novels',
  'Education & Reference',
  'History',
  'Self-Help',
  'Business & Economics',
  'Fantasy',
  'Mystery & Thriller',
  'Romance',
  'Health & Wellness',
  'Academic & Textbooks',
  'Posters',
  'Art & Prints',
  'Stationery & Journals',
  'Merchandise & Gifts',
  'Magazines',
  'Other',
];

/** Categories where ISBN is optional (posters, prints, merch) */
const ISBN_OPTIONAL_CATEGORIES = new Set([
  'Posters',
  'Art & Prints',
  'Stationery & Journals',
  'Merchandise & Gifts',
  'Magazines',
  'Other',
]);

module.exports = { PRODUCT_CATEGORIES, ISBN_OPTIONAL_CATEGORIES };
