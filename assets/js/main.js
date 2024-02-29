const PATH = window.location.pathname.substring(1);
const NAVURL = "/assets/data/navigation.json";
const RECOMMENDEDURL = "/assets/data/recommended.json";
const BRANDSURL = "/assets/data/brands.json";
const SWITCHTYPESURL = "/assets/data/switchtypes.json";
const PRODUCTSURL = "/assets/data/products.json";

const BRANDS = [];
const SWITCHTYPES = [];
const PRODUCTS = [];

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
        let recommendedBlock = $("#recommended");
        displayProducts(recommendedBlock, recommended);
    }

    if (PATH == "products.html") {
        let products = await fetchData(PRODUCTSURL);
        products.forEach(p => PRODUCTS.push(p));

        let productsBlock = $("#all-products");
        displayProducts(productsBlock, products);
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

function displayProducts(displayBlock, productsArray) {
    // Calculating rows and adding product placeholders
    let html = "";
    let rowCount = Math.ceil(productsArray.length / 4);
    for (let i = 0; i < rowCount * 4; i++) {
        html += '<div class="mm-product mb-4 mx-auto"></div>';
    }
    $(displayBlock).html(html);

    // Putting products in placeholders
    let i = 0;
    let productHolders = $(".mm-product");
    for (const product of productsArray) {
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