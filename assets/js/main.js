const PATH = window.location.pathname.substring(1);
const NAVURL = "/assets/data/navigation.json";
const RECOMMENDEDURL = "/assets/data/recommended.json";
const BRANDSURL = "/assets/data/brands.json";
const SWITCHTYPESURL = "/assets/data/switchtypes.json";

const BRANDS = [];
const SWITCHTYPES = [];

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
        displayRecommended(recommended);
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

function displayRecommended(recommendedArray) {
    let recommendedBlock = $("#recommended");
    let html = "";
    for (const product of recommendedArray) {
        html += `
            <div class="p-3 card position-relative" style="width: 22.5%;">
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
        `;
    }
    $(recommendedBlock).html(html);
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