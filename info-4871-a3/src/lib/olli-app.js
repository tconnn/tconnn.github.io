// =============================================================================
// YOU DO NOT NEED TO EDIT THIS FILE.
// Edit src/data.js, src/pages/results.js, and src/pages/product.js instead.
// =============================================================================

// Turns your list of nodes into accessible, keyboard-navigable pages.
//
// Rendering, focus, and arrow-key movement come from Olli:
// https://umwelt-data.github.io/olli/docs/hypergraph

import { olli } from 'olli';
import 'olli/styles.css';

// Arrow keys always follow `children`, so they cannot be rebound.
const RESERVED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

// Olli saves description settings to localStorage. We clear them on every
// render so each node reads exactly its `description`.
const OLLI_STORAGE_KEY = 'olli:customization:v1';
const DESCRIPTION_ONLY = { node: { role: 'node', recipe: [{ token: 'name', brevity: 'short' }] } };

const BUILT_IN_KEYS = [
  ['Down arrow', 'First child'],
  ['Up arrow', 'Parent. On a node with two or more parents, Up lists them; Left and Right pick one, Up goes there.'],
  ['Left / Right arrow', 'Previous / next sibling'],
  ['Home / End', 'First / last sibling'],
  ['Enter, Space', 'First child (unless a node binds the key)'],
  ['Escape', 'Parent (unless a node binds the key)'],
];

/**
 * @typedef {object} Node
 * @property {string} id            Unique id. Must not contain "/".
 * @property {string} description   What the screen reader says at this node.
 * @property {string[]} [children]  Ids of the nodes inside this one, in order.
 * @property {Record<string, string>} [navigation]
 *   Extra keys: a map from a key name (e.g. 'p', 'Enter', '1') to the id of
 *   the node that key jumps to. A key bound here also works on every node
 *   inside this one, unless a node closer to the focus binds the same key.
 */

/**
 * Check the node list and index it. Throws an Error with a readable message
 * for each kind of mistake.
 */
export function indexNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error('The node list is empty. Export at least one node.');
  }
  const byId = new Map();
  nodes.forEach((node, i) => {
    const where = `Node ${i + 1} in the list`;
    if (!node || typeof node !== 'object') throw new Error(`${where} is not an object.`);
    if (typeof node.id !== 'string' || node.id === '') throw new Error(`${where} needs an "id" string.`);
    if (node.id.includes('/') || node.id.startsWith('^')) {
      throw new Error(`The id "${node.id}" may not contain "/" or start with "^".`);
    }
    if (byId.has(node.id)) throw new Error(`Two nodes have the id "${node.id}".`);
    if (typeof node.description !== 'string') {
      throw new Error(`The node "${node.id}" needs a "description" string.`);
    }
    byId.set(node.id, node);
  });

  const parentsOf = new Map(nodes.map((n) => [n.id, []]));
  for (const node of nodes) {
    const children = node.children ?? [];
    if (!Array.isArray(children)) throw new Error(`The "children" of "${node.id}" must be a list of ids.`);
    const seen = new Set();
    for (const childId of children) {
      if (!byId.has(childId)) {
        throw new Error(`The node "${node.id}" lists a child "${childId}", but no node has that id.`);
      }
      if (seen.has(childId)) throw new Error(`The node "${node.id}" lists the child "${childId}" twice.`);
      seen.add(childId);
      parentsOf.get(childId).push(node.id);
    }
    for (const [key, target] of Object.entries(node.navigation ?? {})) {
      if (RESERVED_KEYS.includes(key)) {
        throw new Error(
          `The node "${node.id}" binds ${key}. Arrow keys always follow "children", ` +
            `so change the children lists to change where arrow keys go.`,
        );
      }
      if (!byId.has(target)) {
        throw new Error(`The node "${node.id}" binds "${key}" to "${target}", but no node has that id.`);
      }
    }
  }

  // A node that is nobody's child starts its own page.
  const pageRoots = nodes.filter((n) => parentsOf.get(n.id).length === 0).map((n) => n.id);
  if (pageRoots.length === 0) {
    throw new Error('Every node is inside another node, so no node can start a page. Some "children" list loops back.');
  }

  // Each position on a page is named by the path of ids from the page's top
  // node, joined with "/". A node with two parents has two positions.
  const pages = new Map(); // page's top node id -> Map(node id -> positions)
  for (const rootId of pageRoots) {
    const positionsOf = new Map();
    const walk = (id, path) => {
      if (path.includes(id)) {
        throw new Error(`The node "${id}" is inside itself: ${[...path, id].join(' > ')}.`);
      }
      const here = [...path, id];
      if (!positionsOf.has(id)) positionsOf.set(id, []);
      positionsOf.get(id).push(here.join('/'));
      for (const c of byId.get(id).children ?? []) walk(c, here);
    };
    walk(rootId, []);
    pages.set(rootId, positionsOf);
  }
  return { byId, pages, pageRoots };
}

// Builds the Olli hypergraph for one page: every node reachable from its top.
function hypergraphForPage(rootId, { byId, pages }) {
  const edges = new Map();
  for (const id of pages.get(rootId).keys()) {
    const node = byId.get(id);
    edges.set(id, {
      id,
      displayName: node.description,
      role: 'node',
      children: [...(node.children ?? [])],
      parents: [],
      payload: node,
    });
  }
  for (const edge of edges.values()) {
    for (const c of edge.children) edges.get(c).parents.push(edge.id);
  }
  return { edges, roots: [rootId] };
}

/**
 * Start the app.
 *
 * @param {object} options
 * @param {HTMLElement} options.root  Element to render into.
 * @param {Node[]} options.nodes      Every node on every page.
 * @param {string} [options.start]    Id of the node to start on. Defaults to the first node.
 */
export function startApp({ root, nodes, start }) {
  root.innerHTML = `
    <div class="tree"></div>
    <section class="keys" aria-labelledby="keys-heading">
      <h2 id="keys-heading">Keys</h2>
      <table>
        <thead><tr><th scope="col">Key</th><th scope="col">Goes to</th></tr></thead>
        <tbody class="node-keys"></tbody>
        <tbody class="builtin-keys"></tbody>
      </table>
    </section>
  `;
  const treeEl = root.querySelector('.tree');
  const nodeKeysEl = root.querySelector('.node-keys');
  root.querySelector('.builtin-keys').innerHTML = BUILT_IN_KEYS.map(
    ([k, label]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(label)}</td></tr>`,
  ).join('');

  const showError = (err) => {
    treeEl.innerHTML = `<p><strong>Error in your nodes:</strong></p><pre class="error">${escapeHtml(err.message ?? err)}</pre>`;
    console.error(err);
  };

  let index;
  try {
    index = indexNodes(nodes);
    if (start !== undefined && !index.byId.has(start)) {
      throw new Error(`The start node "${start}" does not exist.`);
    }
  } catch (err) {
    showError(err);
    return;
  }
  const startId = start ?? nodes[0].id;

  let current = null; // { rootId, handle, stopWatching }
  const focusByPage = new Map(); // page's top node id -> last focused position
  let pendingFocusId = null; // node to focus after the next page change

  const pageOf = (id) => index.pageRoots.find((r) => index.pages.get(r).has(id));

  // Of a node's positions, pick the one nearest the current focus, so a jump
  // inside a list stays inside that list when the node is in several lists.
  const nearestPosition = (rootId, id, fromPosition) => {
    const positions = index.pages.get(rootId).get(id);
    if (!fromPosition) return positions[0];
    const from = fromPosition.split('/');
    let best = positions[0];
    let bestShared = -1;
    for (const p of positions) {
      const parts = p.split('/');
      let shared = 0;
      while (shared < parts.length && parts[shared] === from[shared]) shared++;
      if (shared > bestShared) {
        best = p;
        bestShared = shared;
      }
    }
    return best;
  };

  // Ids from the page's top node down to the focused node. Olli's "pick a
  // parent" step adds a "^0" segment, which we skip.
  const focusedPath = () =>
    current.handle
      .getFocusedNavId()
      .split('/')
      .filter((seg) => !seg.startsWith('^'));

  // Keys bound on the focused node or any node above it. The nearest wins.
  const activeBindings = () => {
    const bindings = new Map();
    for (const id of focusedPath().reverse()) {
      for (const [key, target] of Object.entries(index.byId.get(id).navigation ?? {})) {
        if (!bindings.has(key)) bindings.set(key, target);
      }
    }
    return bindings;
  };

  const showKeys = () => {
    nodeKeysEl.innerHTML = [...activeBindings()]
      .map(
        ([key, target]) =>
          `<tr><td>${escapeHtml(keyName(key))}</td><td>${escapeHtml(index.byId.get(target).description)}</td></tr>`,
      )
      .join('');
  };

  const mountPage = (rootId, focusId) => {
    if (current) {
      focusByPage.set(current.rootId, current.handle.getFocusedNavId());
      current.stopWatching();
      current.handle.destroy();
    }
    try {
      localStorage.removeItem(OLLI_STORAGE_KEY);
    } catch {
      // localStorage can be unavailable; nothing to clear then.
    }
    treeEl.replaceChildren();
    const handle = olli(hypergraphForPage(rootId, index), treeEl, {
      initialCustomization: DESCRIPTION_ONLY,
    });
    current = { rootId, handle, stopWatching: () => {} };
    current.stopWatching = handle.onFocusChange(showKeys); // also runs once now
    // The browser tab shows the first sentence of the page's top node.
    document.title = index.byId.get(rootId).description.split(/(?<=[.!?])\s/)[0];

    const target = focusId
      ? nearestPosition(rootId, focusId, null)
      : (focusByPage.get(rootId) ?? rootId);
    handle.focus(target);
    // Focus right away so focus never falls back to <body> between pages.
    treeEl.querySelector(`[data-nav-id="${CSS.escape(target)}"]`)?.focus();
  };

  const jumpTo = (targetId) => {
    if (index.pages.get(current.rootId).has(targetId)) {
      current.handle.focus(nearestPosition(current.rootId, targetId, current.handle.getFocusedNavId()));
      return;
    }
    // The target is on another page. Changing the URL adds a history entry,
    // so the browser's Back button returns here.
    pendingFocusId = targetId;
    location.hash = '/' + encodeURIComponent(pageOf(targetId));
  };

  // Capture phase, so bound keys run before Olli's built-in keys and can
  // override Enter, Space, Escape, Home, and End.
  treeEl.addEventListener(
    'keydown',
    (e) => {
      if (!current) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!e.target.closest?.('[role="tree"]')) return; // ignore Olli's help dialog
      const target = activeBindings().get(e.key);
      if (target === undefined) return;
      e.preventDefault();
      e.stopPropagation();
      jumpTo(target);
    },
    true,
  );

  const pageFromUrl = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  const showPageFromUrl = () => {
    const rootId = pageFromUrl();
    if (!index.pages.has(rootId)) {
      history.replaceState(null, '', '#/' + encodeURIComponent(pageOf(startId)));
      pendingFocusId = startId;
      showPageFromUrl();
      return;
    }
    const focusId = pendingFocusId;
    pendingFocusId = null;
    mountPage(rootId, focusId);
  };

  window.addEventListener('hashchange', showPageFromUrl);
  showPageFromUrl();
}

function keyName(k) {
  return { ' ': 'Space' }[k] ?? k;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
