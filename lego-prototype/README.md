# LEGO shopping prototype

[Open the running prototype](https://tconnn.github.io/lego-prototype/)

[Assignment source code](../info-4871-a3/)

This is a simple screen reader shopping prototype for INFO 4871 Assignment 3, Part 2. It uses the class starter with three LEGO Botanicals sets.

## Run the source on your computer

Use Node.js 22.12 or newer. Open Terminal and run:

```bash
git clone https://github.com/tconnn/tconnn.github.io.git
cd tconnn.github.io/info-4871-a3
npm install
npm run dev
```

Open the address printed in Terminal. If you already cloned this repository, pull the latest changes instead of cloning it again.

## Controls

Down enters a group. Up returns to its parent. Left and Right move between items in a group. Enter opens a set. Backspace returns to the same result.

Keyboard navigation is active as soon as the page opens. A blue outline shows the item receiving your keyboard input. The arrow controls automatically resume the list when focus is on the page background or help text.

## Test with VoiceOver

Turn Quick Nav off with Left Arrow + Right Arrow together, then use Down to enter the results. Browse a set, read its description, shipping, and sample reviews, then return to results. The VoiceOver listening test still needs to be completed before submitting.

The LEGO design is in src/data.js, src/pages/results.js, and src/pages/product.js. Keyboard focus support is added in src/lib/olli-app.js, with focus outlines in src/style.css.

Reviews are made-up examples and Add to bag shows a demo message.

## Update the GitHub Pages copy

After editing the source, run this inside info-4871-a3:

```bash
npm run build -- --base=/lego-prototype/
```

Copy the contents of info-4871-a3/dist into lego-prototype, then commit and push those files.
