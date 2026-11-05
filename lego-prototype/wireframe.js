// This preview uses the starter's nodes and keyboard navigation.
function sendKey(item, key) {
  item.focus();
  item.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
}

// In the visual wireframe, Up and Down move between cards or sections.
document.addEventListener('keydown', function (event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  let item = event.target.closest('.olli-tree-item');
  if (!item && event.target === document.body) item = document.querySelector('.olli-tree-item[tabindex="0"]');
  if (!item) return;
  const id = item.getAttribute('data-nav-id');
  const card = id.startsWith('results/result-list/');
  const section = id.includes('-page/') && id.split('/').length === 2;
  if (section && event.key === 'Escape') {
    event.preventDefault();
    event.stopImmediatePropagation();
    sendKey(item, 'Backspace');
  } else if ((card || section) && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault();
    event.stopImmediatePropagation();
    sendKey(item, event.key === 'ArrowDown' ? 'ArrowRight' : 'ArrowLeft');
  } else if (event.target === document.body && ['Enter', 'Backspace', 'Escape', 'Home', 'End', ' '].includes(event.key)) {
    event.preventDefault();
    sendKey(item, event.key);
  }
}, true);

// Clicking a card or action does the same thing as pressing Enter.
document.addEventListener('click', function (event) {
  const item = event.target.closest('.olli-tree-item');
  if (!item) return;
  const id = item.getAttribute('data-nav-id');
  const section = id.endsWith('-page-description') || id.endsWith('-page-shipping') || id.endsWith('-page-reviews');
  const wasOpen = item.getAttribute('aria-expanded') === 'true';
  // Let the starter select the clicked item before opening it.
  setTimeout(function () {
    if (id.startsWith('results/result-list/') || id.endsWith('-page-back') || id.endsWith('-page-bag') || section) {
      sendKey(item, 'Enter');
      if (section && wasOpen) sendKey(document.querySelector('.olli-tree-item[tabindex="0"]'), 'Escape');
    }
  }, 0);
});

// Direct links should show the whole screen immediately.
window.addEventListener('load', function () {
  const item = document.querySelector('.olli-tree-item[tabindex="0"]');
  if (!item) return;
  const id = item.getAttribute('data-nav-id');
  if (id === 'results') {
    ['ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowDown'].forEach(function (key) {
      sendKey(document.querySelector('.olli-tree-item[tabindex="0"]'), key);
    });
  } else if (id.endsWith('-page')) {
    sendKey(item, 'ArrowDown');
    sendKey(document.querySelector('.olli-tree-item[tabindex="0"]'), 'ArrowRight');
  }
});
