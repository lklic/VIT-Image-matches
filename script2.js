let data = []; // Store parsed CSV data
let rowsPerPage = 20; // Number of rows per page

// Fetch the CSV and parse it
Papa.parse("data-pharos.csv", {
  download: true,
  header: true,
  complete: function(results) {
    data = results.data;
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page'));
    loadPage(isNaN(page) ? 1 : page); // Load the first page or the page from the URL
    setupPagination();
  }
});

function setupPagination() {
  let paginationDiv = document.getElementById("paginationDiv");

  // Previous page link
  let prevLink = document.createElement('a');
  prevLink.innerHTML = "&larr; Previous";
  prevLink.addEventListener("click", function() {
    const page = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
    if (page > 1) {
      updatePageInUrl(page - 1);
      loadPage(page - 1);
    }
  });
  paginationDiv.appendChild(prevLink);

  // Next page link
  let nextLink = document.createElement('a');
  nextLink.innerHTML = "Next &rarr;";
  nextLink.addEventListener("click", function() {
    const page = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
    if (page < Math.ceil(data.length / rowsPerPage)) {
      updatePageInUrl(page + 1);
      loadPage(page + 1);
    }
  });
  paginationDiv.appendChild(nextLink);

  // Add listener for the Go button
  document.getElementById("goButton").addEventListener("click", function() {
    const gotoPage = parseInt(document.getElementById("gotoPage").value);
    if (gotoPage >= 1 && gotoPage <= Math.ceil(data.length / rowsPerPage)) {
      updatePageInUrl(gotoPage);
      loadPage(gotoPage);
    }
  });
}

function updatePageInUrl(page) {
  let url = new URL(window.location);
  url.searchParams.set('page', page);
  window.history.replaceState(null, null, url);
}

function loadPage(page) {
  // Clear the existing rows
  let tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  // Calculate the starting index for this page
  let start = (page - 1) * rowsPerPage;
  let end = Math.min(start + rowsPerPage, data.length);

  // Generate the new rows
  for (let i = start; i < end; i++) {
    let row = document.createElement("tr");

    let cell1 = document.createElement("td");
    let img1 = document.createElement("img");
    img1.src = data[i].Digiteca;
    cell1.appendChild(img1);

    let cell2 = document.createElement("td");
    let img2 = document.createElement("img");
    img2.src = data[i].FotoIndex;
    cell2.appendChild(img2);

    let cell3 = document.createElement("td");
    cell3.innerText = data[i].Result;

    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

    tableBody.appendChild(row);
  }

  // Update the pageInfo text and input value
  const pageInfo = document.getElementById("pageInfo");
  pageInfo.innerHTML = `Page ${page} of ${Math.ceil(data.length / rowsPerPage)}`;
  document.getElementById("gotoPage").value = page;
}
