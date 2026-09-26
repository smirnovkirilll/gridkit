# gridkit

Zero-build micro-framework for turning JSON into rich, filterable data tables.

## What is it?

A thin wrapper around [AG Grid Community](https://www.ag-grid.com/) that lets you go from a JSON file to a fully functional table website in under 20 lines of code. No npm, no bundlers, no build step — just plain ES modules served as static files.

## Features

- **One function** — `initGrid(container, config)` creates everything: filter input, grid, data loading
- **Keyboard shortcut** — press `/` to focus the filter (you wire it up, gridkit gives you the handle)
- **Batteries included** — pagination, column resizing, sorting, filtering, tooltips, text selection out of the box
- **Static deploy** — drop into any S3 bucket / static hosting and it just works
- **No dependencies beyond AG Grid** — no frameworks, no transpilers, no package.json

## Quick start

```
gridkit/                  ← this repo
├── src/
│   ├── utils.js
│   ├── additional.css
│   └── ag-grid-community.min.js  ← gitignored, see below
├── LICENSE
├── NOTICE
└── README.md

your-site/
├── gridkit/              ← symlink to gridkit/src
├── pages/
│   └── my_table.js
├── data/
│   └── my_data.json
└── index.html
```

**index.html**
```html
<head>
    <link rel="stylesheet" href="gridkit/additional.css" />
    <script src="gridkit/ag-grid-community.min.js"></script>
</head>
<body>
    <div id="page"></div>
    <script type="module" src="pages/my_table.js"></script>
</body>
```

**pages/my_table.js**
```js
import { titleLinkRenderer, initGrid } from "../gridkit/utils.js";

const columns = [
    { field: "name" },
    { field: "category" },
    { field: "description", minWidth: 300 },
];

const { filterInput } = initGrid(document.getElementById("page"), {
    columns,
    rowClassRules: {},
    dataUrl: "data/my_data.json",
});

document.addEventListener("keydown", (e) => {
    if (e.key === "/") {
        filterInput.focus();
        e.preventDefault();
    }
});
```

That's it. Serve with any static server and you're done.

## API

### `initGrid(container, config)`

Creates a filter input and an AG Grid instance inside `container`.

| Parameter | Type | Description |
|---|---|---|
| `container` | `HTMLElement` | DOM element to mount into |
| `config.columns` | `Array` | AG Grid [column definitions](https://www.ag-grid.com/javascript-data-grid/column-definitions/) |
| `config.rowClassRules` | `Object` | AG Grid [row class rules](https://www.ag-grid.com/javascript-data-grid/row-styles/#row-class-rules) |
| `config.dataUrl` | `string` | URL to fetch JSON row data from |

**Returns:** `{ filterInput, gridApi }`

### `titleLinkRenderer(params)`

Cell renderer that turns a cell value into an `<a>` link using `params.data.url` as href.

## AG Grid

gridkit depends on [AG Grid Community](https://www.ag-grid.com/) but does not bundle it. The file `ag-grid-community.min.js` is gitignored — you provide it yourself:

- **Local development** — symlink to a shared copy:
  ```bash
  ln -s /path/to/ag-grid-community.min.js src/ag-grid-community.min.js
  ```
- **CI / static hosting** — download from CDN at deploy time:
  ```yaml
  curl "$AG_GRID_CDN_URL" | aws s3 cp - s3://$BUCKET/gridkit/ag-grid-community.min.js
  ```

## Deployment

gridkit is designed for static hosting. In CI, sync `src/` into the site's bucket and fetch AG Grid from CDN:

```yaml
aws s3 sync src/ s3://$BUCKET/gridkit/ --delete
curl "$AG_GRID_CDN_URL" | aws s3 cp - s3://$BUCKET/gridkit/ag-grid-community.min.js
```

For local development, symlink `gridkit/src` into your site directory to avoid duplication across projects.
