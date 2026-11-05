// =============================================================================
// YOU DO NOT NEED TO EDIT THIS FILE.
// Edit src/data.js, src/pages/results.js, and src/pages/product.js instead.
// =============================================================================

import { startApp } from './lib/olli-app.js';
import { products } from './data.js';
import { resultsNodes } from './pages/results.js';
import { productNodes } from './pages/product.js';

// Every node on every page goes in one list. The app starts on the first node.
startApp({
  root: document.getElementById('app'),
  nodes: [...resultsNodes(), ...products.flatMap(productNodes)],
});
