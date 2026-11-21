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
      <div class="section-content">${paragraphs.map(text => `<p>${text}</p>`).join("")}</div>
    </details>`;
}

function renderProduct(product, moveFocus) {
  lastResult = product.id;
  document.title = `${product.title} | LEGO Shopping Prototype`;
  app.innerHTML = `
    <h1 tabindex="-1">${product.title}</h1>
    <p>Set ${product.setNumber}. ${productFacts(product)}</p>
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

app.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const links = [...app.querySelectorAll(".results a")];
  const index = links.indexOf(document.activeElement);
  if (index === -1) return;
  const targets = {
    ArrowLeft: index - 1,
    ArrowRight: index + 1,
    Home: 0,
    End: links.length - 1
  };
  if (!Object.hasOwn(targets, event.key)) return;
  event.preventDefault();
  links[targets[event.key]]?.focus();
});

window.addEventListener("hashchange", () => render(true));
render(false);
