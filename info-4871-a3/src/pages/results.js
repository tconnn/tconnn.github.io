// =============================================================================
// SEARCH RESULTS PAGE                                       YOU EDIT THIS FILE
// =============================================================================
//
// This file builds the nodes of the search results page. Each node is one
// item the screen reader user can move to. A node has up to four fields:
//
//   id           A name for the node. Must be unique across all nodes.
//   description  What the screen reader should read when the user reaches
//                the node.
//   children     (optional) A list of the ids of the nodes grouped within this 
//                node, in order. The arrow keys work like this: Down goes to
//                the first child, Up goes back to the parent, and Left and
//                Right go to the previous and next node in the same list.
//   navigation   (optional) Extra keys. For example, { p: 'some-id' } means
//                "pressing p jumps to the node whose id is some-id".
//
// =============================================================================

import { search, products } from '../data.js';

export function resultsNodes() {
  const nodes = [];

  // ===========================================================================
  // EDIT BELOW THIS LINE
  // ===========================================================================

  const resultsPage = {
    id: 'results',
    description: 'LEGO / Botanicals',
    children: ['search-label', 'search-query', 'result-list'],
  };

  const list = {
    id: 'result-list',
    description: `${products.length} results`,
    children: [],
  };

  // Start on the first set so all three cards are visible.
  for (const p of products) {
    list.children.push(p.id);
    nodes.push({
      id: p.id,
      description: `${p.title}.\n$${p.price}. ${p.pieces} pieces.`,
      navigation: { Enter: `${p.id}-page-title` },
    });
  }

  nodes.push(resultsPage);
  nodes.push({ id: 'search-label', description: 'Search products' });
  nodes.push({ id: 'search-query', description: search.query });
  nodes.push(list);

  // ===========================================================================
  // EDIT ABOVE THIS LINE
  // ===========================================================================

  return nodes;
}
