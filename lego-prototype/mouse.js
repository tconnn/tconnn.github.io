let selectingItem = false;

function pressKey(key) {
  const item = document.querySelector('#app .olli-tree-item[tabindex="0"]');
  if (!item) return;
  item.focus();
  item.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
}

document.getElementById('app').addEventListener('click', function (event) {
  if (selectingItem) return;
  const item = event.target.closest('.olli-tree-item');
  if (!item) return;
  const id = item.getAttribute('data-nav-id');
  const action = id.startsWith('results/result-list/') || id.endsWith('-page-back') || id.endsWith('-page-bag');
  const group = item.hasAttribute('aria-expanded');
  const expanded = item.getAttribute('aria-expanded') === 'true';
  if (!action && !group) return;

  event.preventDefault();
  event.stopPropagation();

  // Let the starter select the clicked item before using its action.
  if (item.getAttribute('aria-selected') !== 'true') {
    selectingItem = true;
    item.querySelector(':scope > .olli-node-label').click();
    selectingItem = false;
  }

  setTimeout(function () {
    if (action) {
      pressKey('Enter');
    } else if (!expanded) {
      pressKey('ArrowDown');
    }
  }, 0);
}, true);
