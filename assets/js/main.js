const PATH = window.location.pathname.substring(1);
const NAVURL = "/assets/data/navigation.json";
const RECOMMENDEDURL = "/assets/data/recommended.json";
const BRANDSURL = "/assets/data/brands.json";
const SWITCHTYPESURL = "/assets/data/switchtypes.json";
const PRODUCTSURL = "/assets/data/products.json";
const SORTVALUESURL = "/assets/data/sorttypes.json";
const CONNECTIVITYURL = "/assets/data/connectivity.json";
const SPECIFICATIONSURL = "/assets/data/specifications.json";
const SIZESURL = "/assets/data/sizes.json";
const PRODUCTTYPESURL = "/assets/data/producttypes.json";

const PRODUCTS = [];
const BRANDS = [];
const SWITCHTYPES = [];
const SORTVALUES = [];
const CONNECTIVITY = [];
const SPECIFICATIONS = [];
const SIZES = [];
const PRODUCTTYPES = [];

const PRODUCTSBLOCK = "#products";

const FILTER = {
    "brand" : [],
    "switch" : [],
    "connectivity" : [],
    "specification" : [],
    "size" : [],
    "producttype" : []
}

// Used to fetch a single json file
async function fetchData(url) {
    try {
        const fetchPromise = await fetch(url);
        return await fetchPromise.json(SWITCHTYPESURL);
    }
    catch (exception) {
        console.log(exception);
    }
}

// Used to initialize all page elements that are to be loaded async.
async function initializePage() {
    let navigation = await fetchData(NAVURL);
    displayNavigation(navigation);

    let brands = await fetchData(BRANDSURL);
    brands.forEach(b => BRANDS.push(b));

    let switchTypes = await fetchData(SWITCHTYPESURL);
    switchTypes.forEach(sw => SWITCHTYPES.push(sw));

    if (PATH == "index.html") {
        let recommended = await fetchData(RECOMMENDEDURL);
        displayProducts(recommended);
    }

    if (PATH == "products.html") {
        let products = await fetchData(PRODUCTSURL);
        products.forEach(p => PRODUCTS.push(p));
        displayProducts(products);

        let sortValues = await fetchData(SORTVALUESURL);
        sortValues.forEach(s => SORTVALUES.push(s));
        let sortBlock = $("#sort");
        showSortTypes(sortBlock, SORTVALUES);

        let brandFilterBlock = $("#brand");
        showFilter(brandFilterBlock, BRANDS);

        let switchFilterBlock = $("#switch");
        showFilter(switchFilterBlock, SWITCHTYPES);

        await generateFilter(PRODUCTTYPESURL, PRODUCTTYPES, "producttype");
        await generateFilter(CONNECTIVITYURL, CONNECTIVITY, "connectivity");
        await generateFilter(SPECIFICATIONSURL, SPECIFICATIONS, "specification");
        await generateFilter(SIZESURL, SIZES, "size");
    }
}

// Displays navigation bars on the page provided the array of nav objects
function displayNavigation(navArray) {
    let navMenus = $(".navbar-nav");
    let html = "";
    for (const navMenu of navMenus) {
        for(const navItem of navArray) {
            html += `
                <li class="nav-item mx-2">
                    <a class="nav-link ${navItem.href == PATH ? "active" : ""}" 
                    href="${navItem.href}">${navItem.name}</a>
                </li>
            `;
        }
        $(navMenu).html(html);
        html = "";
    }
}

function displayProducts(productsArray) {
    // Filtering products to display
    let arr = productsArray;
    if (!isFilterEmpty()) {
        console.log("FIL")
        for (const f in FILTER) {
            if (FILTER[f].length != 0) {
                let filterName = "";
                switch (f) {
                    case "brand" : filterName = "brand_id"; break;
                    case "switch" : filterName = "switch_types"; break;
                    case "connectivity" : filterName = "connectivity"; break;
                    case "specification" : filterName = "specifications"; break;
                    case "size" : filterName = "size"; break;
                    case "producttype" : filterName = "product_type"; break;
                }
                console.log(FILTER[f])
                arr = applyFilter(FILTER[f], arr, filterName);
            }
        }
    }
    // Calculating rows and adding product placeholders
    let html = "";
    console.log(arr);
    let rowCount = Math.ceil(arr.length / 4);
    for (let i = 0; i < rowCount * 4; i++) {
        html += '<div class="mm-product mb-4 mx-auto"></div>';
    }
    $(PRODUCTSBLOCK).html(html);
    console.log($(PRODUCTSBLOCK))

    // Putting products in placeholders
    let i = 0;
    let productHolders = $(".mm-product");
    for (const product of arr) {
        $(productHolders[i++]).html(`
            <div class="p-3 card position-relative h-100">
                <img class="card-img-top" src="${product.img.src}" alt="${product.img.alt}"/>
                <div class="card-body position-relative">
                    <h3>${getBrandName(product.brand_id)}</h3>
                    <h4>${product.name}</h4>
                    <p>$${product.price.current}</p>
                    ${product.price.hasOwnProperty("previous") ? `<s>$${product.price.previous}</s>` : ""}
                    ${product.hasOwnProperty("switch_types") ? showSwitchTypes(product.switch_types) : ""}
                </div>
                <button class="position-absolute" style="bottom: 0px; right: 0px;">Add</button>
            </div>
        `);
    }
}

function applyFilter(validValues, arrayToFilter, propertyToFilter) {
    // Fitering out all products that dont have the right property
    let arr = [];
    for (const element of arrayToFilter) {
        if (element.hasOwnProperty(propertyToFilter)) {
            arr.push(element);
        }
    }

    if (Array.isArray(arr[0][propertyToFilter])) {
        return arr.filter(x => {
            console.log(x);
            for (const value of x[propertyToFilter]) {
                if (validValues.includes(value)) return true;
            }
            return false;
        });
    }
    return arr.filter(x => validValues.includes(x[propertyToFilter]));
}

function showSortTypes(displayBlock, sortArray) {
    let html = "";
    for (const sortOption of sortArray) {
        html += `
            <option value="${sortOption.id}">${sortOption.name}</option>
        `;
    }
    $(displayBlock).html(html);
    $(displayBlock).change((e) => {
        // Get sort type and provide it
        sortProducts(e.currentTarget.value);
        console.log("change sort " + e.currentTarget.value)
    });
}

async function generateFilter(filterURL, filterARR, displayBlockId) {
    let filterVals = await fetchData(filterURL);
    filterVals.forEach(f => filterARR.push(f));
    let filterDisplayBlock = $(`#${displayBlockId}`);
    showFilter(filterDisplayBlock, filterARR);
}

function showFilter(displayBlock, filterArray) {
    let filterName = $(displayBlock).attr("id");
    let html = "";
    for (const filterOption of filterArray) {
        html += `
            <li class="list-group-item">
                <input class="form-check-input me-1" type="checkbox" onChange="updateFilters('${filterName}',${filterOption.id})" id="${filterName}-${filterOption.id}">
                <label class="form-check-label" for="${filterName}-${filterOption.id}">${filterOption.name}</label>
            </li>
        `;
    }
    $(displayBlock).html(html);
}

function updateFilters(filterName, filterValue) {
    console.log(filterName);
    console.log(filterValue);
    if (FILTER[filterName].includes(filterValue)) {
        let i = FILTER[filterName].indexOf(filterValue);
        FILTER[filterName] = FILTER[filterName].filter(x => x != filterValue)
    } else {
        FILTER[filterName].push(filterValue);
    }
    displayProducts(PRODUCTS);
}

function isFilterEmpty() {
    console.log(FILTER)
    console.log(Object.keys(FILTER))
    for (const f of Object.keys(FILTER)) {
        if (FILTER[f].length != 0) return false;
    }
    return true;
}

function sortProducts(sortType) {
    sortType = parseInt(sortType);
    switch(sortType) {
        case 1:
            PRODUCTS.sort((a, b) => a.id > b.id);
            break;
        case 2:
            console.log("Name asc");
            console.log(PRODUCTS)
            PRODUCTS.sort((a, b) => a.name > b.name);
            break;
        case 3:
            PRODUCTS.sort((a, b) => a.name < b.name);
            break;
        case 4:
            PRODUCTS.sort((a, b) => a.price.current > b.price.current);
            break;
        case 5:
            PRODUCTS.sort((a, b) => a.price.current < b.price.current);
            break;
    }
    displayProducts(PRODUCTS);
}

function getBrandName(id) {
    return BRANDS.filter(x => x.id == id)[0].name;
}

function showSwitchTypes(ids) {
    let switches = SWITCHTYPES.filter(st => ids.includes(st.id));
    let html = '<div class="position-absolute" style="bottom: 0px;">';
    for (const sw of switches) {
        html += `
            <button class="btn btn-light flex-end">${sw.name}</button>
        `;
    }
    return html + "</div>";
}

initializePage();