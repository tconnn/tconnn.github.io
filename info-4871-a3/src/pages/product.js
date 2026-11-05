// =============================================================================
// PRODUCT PAGE                                              YOU EDIT THIS FILE
// =============================================================================
//
// This file builds the nodes of one product page. The app runs it once for
// each product in data.js, so every product gets its own page. Inside the
// productNodes function, p is the product whose page is being built.
//
//
// IDS ON THIS PAGE: every id must be unique from every id on every other page,
// including the search results page. That is why every id below starts with
// the product's id and "-page", such as "aurora-anc-page-price".
//
// =============================================================================

export function productNodes(p) {
  const nodes = [];

  // ===========================================================================
  // EDIT BELOW THIS LINE
  // ===========================================================================

  const page = {
    id: `${p.id}-page`,
    description: `${p.title}. $${p.price}. ${p.pieces} pieces.`,
    children: [
      `${p.id}-page-back`,
      `${p.id}-page-title`,
      `${p.id}-page-pieces`,
      `${p.id}-page-price`,
      `${p.id}-page-description`,
      `${p.id}-page-shipping`,
      `${p.id}-page-reviews`,
      `${p.id}-page-bag`,
    ],
    navigation: { Backspace: p.id },
  };
  nodes.push(page);

  nodes.push({
    id: `${p.id}-page-back`,
    description: 'Back to results',
    navigation: { Enter: p.id },
  });
  nodes.push({ id: `${p.id}-page-title`, description: p.title });
  nodes.push({ id: `${p.id}-page-pieces`, description: `${p.pieces} pieces` });
  nodes.push({ id: `${p.id}-page-price`, description: `$${p.price}` });

  const about = {
    id: `${p.id}-page-description`,
    description: 'Description',
    children: [],
  };
  nodes.push(about);

  let lineNumber = 1;
  for (const line of p.description) {
    const lineId = `${p.id}-page-description-${lineNumber}`;
    about.children.push(lineId);
    nodes.push({ id: lineId, description: line });
    lineNumber = lineNumber + 1;
  }

  nodes.push({
    id: `${p.id}-page-shipping`,
    description: 'Shipping information',
    children: [`${p.id}-page-shipping-details`],
  });
  nodes.push({ id: `${p.id}-page-shipping-details`, description: p.shipping });

  const reviews = {
    id: `${p.id}-page-reviews`,
    description: 'Reviews',
    children: [],
  };
  nodes.push(reviews);

  let reviewNumber = 1;
  for (const review of p.reviews) {
    const reviewId = `${p.id}-page-review-${reviewNumber}`;
    reviews.children.push(reviewId);
    nodes.push({ id: reviewId, description: review });
    reviewNumber = reviewNumber + 1;
  }

  nodes.push({
    id: `${p.id}-page-bag`,
    description: 'Add to bag',
    children: [`${p.id}-page-confirmation`],
    navigation: { Enter: `${p.id}-page-confirmation` },
  });
  nodes.push({
    id: `${p.id}-page-confirmation`,
    description: `${p.title} added to a sample bag. This is a prototype confirmation.`,
  });

  // ===========================================================================
  // EDIT ABOVE THIS LINE
  // ===========================================================================

  return nodes; // Do not edit.
}
