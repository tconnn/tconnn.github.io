// =============================================================================
// PRODUCT DATA                                              YOU EDIT THIS FILE
// =============================================================================
//
// This file holds the information about each product. The page files in
// src/pages/ read it to build the screen reader interface.
//
// Replace the two sample products below with example search results from the
// shopping site your team chose. Copy as many results as you need to get the
// point of your design across.
//
// You can add new fields or delete fields. The only required field is "id".
//
// =============================================================================
// EDIT BELOW THIS LINE
// =============================================================================

export const search = {
  query: 'Botanicals',
};

// These three sets are from LEGO's US website.
// The reviews are made-up examples for testing.
export const products = [
  {
    id: 'mini-orchid',
    title: 'Mini Orchid',
    setNumber: '10343',
    price: 29.99,
    pieces: 274,
    minimumAge: 18,
    description: [
      'An orchid with peach flowers and green leaves in a terracotta-colored pot.',
      'The finished set is over 10 inches tall.',
    ],
    shipping: 'Standard US shipping takes 3 to 5 business days. Shipping for one set costs $6.95. Orders of $35 or more ship free.',
    reviews: [
      'Sample review: 5 out of 5 stars. The flowers look nice on my desk.',
      'Sample review: 3 out of 5 stars. The finished plant was smaller than I expected.',
    ],
  },
  {
    id: 'lucky-bamboo',
    title: 'Lucky Bamboo',
    setNumber: '10344',
    price: 29.99,
    pieces: 325,
    minimumAge: 18,
    description: [
      'Three green bamboo stems with leaves and pebbles in a clay-colored pot.',
      'The finished set is over 11 inches tall.',
    ],
    shipping: 'Standard US shipping takes 3 to 5 business days. Shipping for one set costs $6.95. Orders of $35 or more ship free.',
    reviews: [
      'Sample review: 5 out of 5 stars. It looks good next to my other plants.',
      'Sample review: 4 out of 5 stars. Some building steps were repetitive.',
    ],
  },
  {
    id: 'plum-blossom',
    title: 'Plum Blossom',
    setNumber: '10369',
    price: 29.99,
    pieces: 327,
    minimumAge: 18,
    description: [
      'A brown stem with red and magenta flowers in a pale blue pot with a gold band.',
      'The finished set is over 13.5 inches tall.',
    ],
    shipping: 'Standard US shipping takes 3 to 5 business days. Shipping for one set costs $6.95. Orders of $35 or more ship free.',
    reviews: [
      'Sample review: 5 out of 5 stars. I like the flowers and the blue pot.',
      'Sample review: 4 out of 5 stars. The branches need some room on a shelf.',
    ],
  },
];


// =============================================================================
// EDIT ABOVE THIS LINE
// =============================================================================
