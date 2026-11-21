const app = document.querySelector("#app");
let lastResult;

function productFacts(product) {
  return `$${product.price.toFixed(2)}. ${product.pieces} pieces. Ages ${product.minimumAge} and up.`;
}

function renderResults(moveFocus) {
  document.title = "Botanicals results | LEGO Shopping Prototype";
  app.innerHTML = `
    <h1 tabindex="-1">Botanicals results</h1>
    <p>${products.length} sets</p>
    <p>Use Left and Right Arrow to browse. Press Down Arrow to open a set.</p>
    <ul class="results" role="list">
      ${products.map(product => `
        <li>
          <a id="result-${product.id}" href="#/${product.id}-page">
            <strong>${product.title}</strong>
            <small>${productFacts(product)}</small>
          </a>
        </li>
      `).join("")}
    </ul>`;
  if (moveFocus) {
    const previousLink = document.getElementById(`result-${lastResult}`);
    (previousLink ?? app.querySelector("h1")).focus();
  }
}

function disclosure(title, paragraphs) {
  return `
    <details>
      <summary>${title}</summary>
      <div class="section-content">${paragraphs.map(text => `<p tabindex="-1">${text}</p>`).join("")}</div>
    </details>`;
}

function renderProduct(product, moveFocus) {
  lastResult = product.id;
  document.title = `${product.title} | LEGO Shopping Prototype`;
  app.innerHTML = `
    <h1 tabindex="-1">${product.title}</h1>
    <p>Use Up and Down Arrow to move, Right Arrow to open, and Left Arrow to go back.</p>
    <p class="set-facts" tabindex="-1">Set ${product.setNumber}. ${productFacts(product)}</p>
    <a class="back" href="#/results">Back to results</a>
    ${disclosure("Description", product.description)}
    ${disclosure("Shipping information", [product.shipping])}
    ${disclosure("Reviews", product.reviews)}
    <button type="button" id="add-to-bag">Add to bag</button>
    <p role="status" id="bag-status"></p>`;
  app.querySelector("#add-to-bag").addEventListener("click", () => {
    app.querySelector("#bag-status").textContent = `${product.title} added to the demo bag.`;
  });
  if (moveFocus) app.querySelector("h1").focus();
}

function render(moveFocus) {
  const product = products.find(item => location.hash === `#/${item.id}-page`);
  if (product) renderProduct(product, moveFocus);
  else renderResults(moveFocus);
}

function browseResults(key, links, active) {
  const index = links.indexOf(active);
  if (index === -1) {
    links[key === "End" ? links.length - 1 : 0].focus();
    return;
  }

  const targets = {
    ArrowLeft: index - 1,
    ArrowRight: index + 1,
    Home: 0,
    End: links.length - 1
  };
  if (key === "ArrowDown") links[index].click();
  else links[targets[key]]?.focus();
}

function browseProduct(key, active) {
  const controls = [...app.querySelectorAll(
    "h1, .set-facts, .back, summary, details[open] .section-content p, #add-to-bag"
  )];
  const index = controls.indexOf(active);
  const section = active.closest("details");

  if (key === "ArrowLeft") {
    if (section?.open) {
      section.open = false;
      section.querySelector("summary").focus();
    } else {
      app.querySelector(".back").click();
    }
    return;
  }

  if (key === "ArrowRight") {
    if (active.matches("summary")) {
      section.open = true;
      section.querySelector(".section-content p").focus();
    } else if (active.matches(".back, #add-to-bag")) {
      active.click();
    } else if (index <= 0) {
      controls[1].focus();
    }
    return;
  }

  const targets = {
    ArrowUp: index - 1,
    ArrowDown: index + 1,
    Home: 0,
    End: controls.length - 1
  };
  controls[targets[key]]?.focus();
}

const navigationKeys = new Set([
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"
]);

document.addEventListener("keydown", event => {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (!navigationKeys.has(event.key)) return;

  const active = document.activeElement;
  if (active !== document.body && !app.contains(active)) return;

  event.preventDefault();
  const links = [...app.querySelectorAll(".results a")];
  if (links.length) browseResults(event.key, links, active);
  else browseProduct(event.key, active);
});

window.addEventListener("hashchange", () => render(true));
render(false);
