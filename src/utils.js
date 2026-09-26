export function titleLinkRenderer(params) {
    const anchor = document.createElement("a");
    anchor.textContent = params.value;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.href = params.data.url;

    return anchor;
}


export function initGrid(container, { columns, rowClassRules, dataUrl }) {
    const filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.className = "ag-grid-quick-filter";
    filterInput.placeholder = "Filter...";
    container.appendChild(filterInput);

    const gridDiv = document.createElement("div");
    gridDiv.className = "ag-grid";
    container.appendChild(gridDiv);

    const gridOptions = {
        rowData: [],
        getRowId: params => params.data.title,
        autoSizeStrategy: {type: "fitCellContents"},
        tooltipShowMode: "whenTruncated",
        tooltipShowDelay: 1000,
        pagination: true,
        paginationPageSize: 1000,
        paginationPageSizeSelector: false,
        enableCellTextSelection: true,
        defaultColDef: {
            filter: true,
            resizable: true,
            sortable: true,
        },
        columnDefs: columns,
        rowClassRules: rowClassRules,
    };

    const gridApi = agGrid.createGrid(gridDiv, gridOptions);

    filterInput.addEventListener("input", () => {
        gridApi.setGridOption("quickFilterText", filterInput.value);
    });

    fetch(dataUrl)
        .then((response) => response.json())
        .then((data) => gridApi.setGridOption("rowData", data));

    return { filterInput, gridApi };
}
