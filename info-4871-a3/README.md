# INFO 4871 Assignment 3: Starter Code

This starter code turns a list of nodes into a screen reader interface for a search results page and a product detail page. Each node contains a description for that node, a list of child nodes that it contains, and a list of additional key bindings (other than arrow keys) that can be used to jump directly to other nodes.

## Setup

You will need to have [Node.js](https://nodejs.org/) installed. Node.js comes with npm, the tool that downloads this project's libraries and runs the app.

### Check whether you already have Node.js

Open a terminal. On macOS, open the Terminal app. On Windows, open PowerShell. Then run:

```bash
node --version
npm --version
```

If both commands print a version number, such as `v24.11.0` and `11.6.0`, and the Node.js version is 22.12 or higher, Node.js is ready. If either command prints an error such as `command not found`, or the Node.js version is lower than 22.12, install Node.js:

1. Go to https://nodejs.org/ and download the installer marked LTS.
2. Run the installer and accept the default options.
3. Close the terminal, open a new one, and run the two commands above again to confirm that they print version numbers.

### Run the app

In the terminal, move into this project's folder. Replace the path below with the folder's location on your computer:

```bash
cd path/to/info-4871-a3-template
```

Then run these two commands:

```bash
npm install
npm run dev
```

`npm install` downloads the libraries the project needs. You only need to run it once. `npm run dev` starts the app and prints a link, usually http://localhost:5173. Open that link in your web browser to see the app.

Leave the terminal open while you work, because closing it stops the app. When you save a change to a file, the page in the browser reloads with your change. To stop the app, click in the terminal and press Ctrl+C. To start it again later, run `npm run dev` from the project folder.

## Files

| File | Edit it? | Contents |
|---|---|---|
| `src/data.js` | Yes | Product data. Replace the sample products with the results from your chosen shopping site. |
| `src/pages/results.js` | Yes | The nodes of the search results page |
| `src/pages/product.js` | Yes | The nodes of one product page. `main.js` calls it once per product. |
| `src/main.js` | No | Collects every node into one list and starts the app |
| `src/style.css` | No | Page styles |
| `src/lib/olli-app.js` | No | Library for rendering the output from a list of nodes |

## Nodes

Every node is an object with an `id` and a `description`, plus two optional fields:

```js
{
  id: 'aurora-anc',
  description: 'Aurora ANC Wireless Over-Ear Headphones',
  children: ['aurora-anc-price', 'aurora-anc-rating'],
  navigation: { Enter: 'aurora-anc-page' },
}
```

| Field | Required? | Meaning |
|---|---|---|
| `id` | Yes | A name for the node. Needs to be unique across every page. |
| `description` | Yes | What the screen reader should read out for the node |
| `children` | No | The ids of the nodes that are grouped within this one, in order |
| `navigation` | No | Additional key bindings. Maps a key event to a node id. When that key is pressed, navigates directly to the node. |

### Pages

The app has a search results page and one page for each product. The app opens the search results page initially.

In the starter code, pressing Enter on a search result opens that product's page. Pressing Backspace on a product page returns to the search results, with focus on the same result. The browser's Back button also returns to the previous page. A `navigation` key that jumps to a node on a different page will open that page.
