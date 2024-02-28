// Used to fetch a single json file
async function fetchData(url) {
    try {
        const fetchPromise = await fetch(url);
        return await fetchPromise.json();
    }
    catch (exception) {
        console.log(exception);
    }
}

// Used to initialize all page elements that are to be loaded async.
async function initializePage() {
    let navigation = await fetchData("/assets/data/navigation.json");
    console.log(navigation);
    displayNavigation(navigation);
}

// Displays navigation bars on the page provided the array of nav objects
function displayNavigation(navArray) {
    let path = window.location.pathname.substring(1);
    let navMenus = $(".navbar-nav");
    let html = "";
    for (const navMenu of navMenus) {
        for(const navItem of navArray) {
            html += `
                <li class="nav-item mx-2">
                    <a class="nav-link ${navItem.href == path ? "active" : ""}" 
                    href="${navItem.href}">${navItem.name}</a>
                </li>
            `;
        }
        $(navMenu).html(html);
        html = "";
    }
}

initializePage();