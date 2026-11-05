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
    description: `Search results for ${search.query}. ${products.length} sets. Press Down to start. Use Left and Right to move between sets.`,
    children: [],
  };
  nodes.push(resultsPage);

  let resultNumber = 1;
  for (const p of products) {
    resultsPage.children.push(p.id);
    nodes.push({
      id: p.id,
      description: `Result ${resultNumber} of ${products.length}. ${p.title}. $${p.price}. ${p.pieces} pieces. Ages ${p.minimumAge} and up. Press Enter for details.`,
      navigation: { Enter: `${p.id}-page` },
    });
    resultNumber = resultNumber + 1;
  }

  // ===========================================================================
  // EDIT ABOVE THIS LINE
  // ===========================================================================

  return nodes;
}
