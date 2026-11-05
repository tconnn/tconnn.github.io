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

  // Each product page uses the same groups.
  const page = {
    id: `${p.id}-page`,
    description: `${p.title}. Set ${p.setNumber}. $${p.price}. ${p.pieces} pieces. Ages ${p.minimumAge} and up. Press Down for sections. Press Backspace to return to results.`,
    children: [
      `${p.id}-page-back`,
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
    description: 'Back to results. Press Enter.',
    navigation: { Enter: p.id },
  });

  const about = {
    id: `${p.id}-page-description`,
    description: 'Description. Press Down to read.',
    children: [],
  };
  nodes.push(about);

  let lineCount = 1;
  for (const line of p.description) {
    const lineId = `${p.id}-page-description-${lineCount}`;
    about.children.push(lineId);
    nodes.push({ id: lineId, description: line });
    lineCount = lineCount + 1;
  }

  nodes.push({
    id: `${p.id}-page-shipping`,
    description: 'Shipping information. Press Down to read.',
    children: [`${p.id}-page-shipping-details`],
  });
  nodes.push({
    id: `${p.id}-page-shipping-details`,
    description: p.shipping,
  });

  const reviews = {
    id: `${p.id}-page-reviews`,
    description: 'Reviews. Sample reviews for this prototype. Press Down to read.',
    children: [],
  };
  nodes.push(reviews);

  let reviewCount = 1;
  for (const review of p.reviews) {
    const reviewId = `${p.id}-page-review-${reviewCount}`;
    reviews.children.push(reviewId);
    nodes.push({ id: reviewId, description: review });
    reviewCount = reviewCount + 1;
  }

  // This only demonstrates the bag confirmation.
  nodes.push({
    id: `${p.id}-page-bag`,
    description: 'Add to bag. Press Enter.',
    children: [`${p.id}-page-confirmation`],
    navigation: { Enter: `${p.id}-page-confirmation` },
  });
  nodes.push({
    id: `${p.id}-page-confirmation`,
    description: `Demo only. ${p.title} added to a sample bag. Press Up to go back.`,
  });

  // ===========================================================================
  // EDIT ABOVE THIS LINE
  // ===========================================================================

  return nodes; // Do not edit.
}
