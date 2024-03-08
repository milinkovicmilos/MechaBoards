let pathName = window.location.pathname.split("/");
const PATH = pathName[pathName.length - 1];
const NAVURL = "./assets/data/navigation.json";
const RECOMMENDEDURL = "./assets/data/recommended.json";
const BRANDSURL = "./assets/data/brands.json";
const SWITCHTYPESURL = "./assets/data/switchtypes.json";
const PRODUCTSURL = "./assets/data/products.json";
const SORTVALUESURL = "./assets/data/sorttypes.json";
const CONNECTIVITYURL = "./assets/data/connectivity.json";
const SPECIFICATIONSURL = "./assets/data/specifications.json";
const SIZESURL = "./assets/data/sizes.json";
const PRODUCTTYPESURL = "./assets/data/producttypes.json";

const PRODUCTS = [];
const BRANDS = [];
const SWITCHTYPES = [];
const SORTVALUES = [];
const CONNECTIVITY = [];
const SPECIFICATIONS = [];
const SIZES = [];
const PRODUCTTYPES = [];

const PRODUCTSBLOCK = "#products";
const IMGDESCBLOCK = "#img-desc";
const HEADINGOPTIONSBLOCK = "#heading-options";

const FILTER = {
    "brand" : [],
    "switch" : [],
    "connectivity" : [],
    "specification" : [],
    "size" : [],
    "producttype" : []
}

//#region Form error handling

const formErrors = [
    {
        "formElementID" : "input-first-name",
        "errorText" : "This field is required, please enter your name",
        "regex" : ".+",
        "isVisible" : false
    },
    {
        "formElementID" : "input-first-name",
        "errorText" : "Please enter valid name starting with capital letter",
        "regex" : "[A-Z][a-z]{2,}([A-Z][a-z]{2,})*",
        "isVisible" : false
    },
    {
        "formElementID" : "input-last-name",
        "errorText" : "This field is required, please enter your last name",
        "regex" : ".+",
        "isVisible" : false
    },
    {
        "formElementID" : "input-last-name",
        "errorText" : "Please enter valid last name starting with capital letter",
        "regex" : "[A-Z][a-z]{2,}([A-Z][a-z]{2,})*",
        "isVisible" : false
    },
    {
        "formElementID" : "input-email",
        "errorText" : "This field is required, please enter your e-mail address",
        "regex" : ".+",
        "isVisible" : false
    },
    {
        "formElementID" : "input-email",
        "errorText" : "Please enter correct e-mail address (e.g. johndoe@gmail.com)",
        "regex" : "^([a-z]+\.?)+@[a-z]{2,}\.[a-z]{2,}$",
        "isVisible" : false
    },
    {
        "formElementID" : "input-phone-number",
        "errorText" : "This field is required, please enter contact phone number",
        "regex" : ".+",
        "isVisible" : false
    },
    {
        "formElementID" : "input-phone-number",
        "errorText" : "Please enter correct contact number (e.g. +381 12 3456789)",
        "regex" : "^\\+[0-9]{1,3} [0-9]{1,3} [0-9]{6,9}$",
        "isVisible" : false
    },
    {
        "formElementID" : "check-pp",
        "errorText" : "Please accept our Privacy Policy to continue",
        "regex" : "",
        "isVisible" : false
    },
    {
        "formElementID" : "input-address",
        "errorText" : "This field is required, please enter your address",
        "regex" : ".+",
        "isVisible" : false
    }
];

function getFormErrorObjs(formID) {
    let objs = [];
    for (const element of formErrors) {
        if (element.formElementID == formID) objs.push(element);
    }
    return objs;
}

function showError(formErrorObj) {
    if (!formErrorObj.isVisible) {
        $(`#${formErrorObj.formElementID}`).css("outline", "1px solid darkred");
        let errorMessage = `<p class="error-text">${formErrorObj.errorText}</p>`;
        $(errorMessage).insertAfter($(`#${formErrorObj.formElementID}`));
        formErrorObj.isVisible = true;
    }
}

function hideError(formErrorObj) {
    if (formErrorObj.isVisible) {
        $(`#${formErrorObj.formElementID}`).css("outline", "none");
        $(`#${formErrorObj.formElementID} ~ p`).remove();
        formErrorObj.isVisible = false;
    }
}

function checkFormElement() {
    let formErrorObjs = getFormErrorObjs(this.id);
    for (const element of formErrorObjs) {
        let regex = new RegExp(element.regex);
        // Check in case that form element is checkbox
        if ($(this).attr("type") == "checkbox") {
            if ($(this).is(':checked')) {
                hideError(element);
            } else {
                showError(element);
                return;
            }
        }
        if (regex.test(this.value)) {
            hideError(element);
        } else {
            showError(element);
            return;
        }
    }
}

//#endregion

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
    displayTotalCartItems();

    let brands = await fetchData(BRANDSURL);
    brands.forEach(b => BRANDS.push(b));

    let switchTypes = await fetchData(SWITCHTYPESURL);
    switchTypes.forEach(sw => SWITCHTYPES.push(sw));

    if (PATH == "index.html" || PATH == "") {
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

    if (PATH == "mechanical.html") {
        let products = await fetchData(PRODUCTSURL);
        products = products.filter(x => x["product_type"] == 1);
        products.forEach(p => PRODUCTS.push(p));
        displayProducts(products);

        let sortValues = await fetchData(SORTVALUESURL);
        sortValues.forEach(s => SORTVALUES.push(s));
        let sortBlock = $("#sort");
        showSortTypes(sortBlock, SORTVALUES);

        let brandFilterBlock = $("#brand");
        showFilter(brandFilterBlock, BRANDS);
        
        await generateFilter(CONNECTIVITYURL, CONNECTIVITY, "connectivity");
        await generateFilter(SPECIFICATIONSURL, SPECIFICATIONS, "specification");
        await generateFilter(SIZESURL, SIZES, "size");
    }

    if (PATH == "membrane.html") {
        let products = await fetchData(PRODUCTSURL);
        products = products.filter(x => x["product_type"] == 2);
        products.forEach(p => PRODUCTS.push(p));
        displayProducts(products);

        let sortValues = await fetchData(SORTVALUESURL);
        sortValues.forEach(s => SORTVALUES.push(s));
        let sortBlock = $("#sort");
        showSortTypes(sortBlock, SORTVALUES);

        let brandFilterBlock = $("#brand");
        showFilter(brandFilterBlock, BRANDS);
        
        await generateFilter(CONNECTIVITYURL, CONNECTIVITY, "connectivity");
        await generateFilter(SPECIFICATIONSURL, SPECIFICATIONS, "specification");
        await generateFilter(SIZESURL, SIZES, "size");
    }

    if (PATH == "accessories.html") {
        let products = await fetchData(PRODUCTSURL);
        products = products.filter(x => x["product_type"] == 3);
        products.forEach(p => PRODUCTS.push(p));
        displayProducts(products);

        let sortValues = await fetchData(SORTVALUESURL);
        sortValues.forEach(s => SORTVALUES.push(s));
        let sortBlock = $("#sort");
        showSortTypes(sortBlock, SORTVALUES);

        let brandFilterBlock = $("#brand");
        showFilter(brandFilterBlock, BRANDS);
    }

    if (PATH == "product.html") {
        let params = new URLSearchParams(document.location.search);
        let productId = params.get("id");
        let products = await fetchData(PRODUCTSURL);
        let product = products.filter(x => x.id == productId)[0];

        let connectivityValues = await fetchData(CONNECTIVITYURL);
        connectivityValues.forEach(c => CONNECTIVITY.push(c));

        let sizesValues = await fetchData(SIZESURL);
        sizesValues.forEach(s => SIZES.push(s));

        let specificationValues = await fetchData(SPECIFICATIONSURL);
        specificationValues.forEach(s => SPECIFICATIONS.push(s));

        displaySingleProduct(product);
    }

    if (PATH == "cart.html") {
        let products = await fetchData(PRODUCTSURL);
        products.forEach(p => PRODUCTS.push(p));

        displayCart();
    }

    // Remove loading animaton
    $("#loading").fadeOut(500);
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
        html += '<div class="mm-product mb-5 mx-auto"></div>';
    }
    $(PRODUCTSBLOCK).html(html);
    console.log($(PRODUCTSBLOCK))

    // Putting products in placeholders
    let i = 0;
    let productHolders = $(".mm-product");
    for (const product of arr) {
        $(productHolders[i++]).html(`
            <div class="p-3 position-relative h-100">
                <a href="./product.html?id=${product.id}"><img class="img-fluid mb-3" src="${product.img.src}" alt="${product.img.alt}"/></a>
                <div class="position-relative pb-3">
                    <a href="./product.html?id=${product.id}" class="text-reset text-decoration-none">
                        <div>
                            <h3>${getSingleName(BRANDS, product.brand_id)}</h3>
                            <h4>${product.name}</h4>
                        </div>
                    </a>
                    <p>$${product.price.current}</p>
                    ${product.price.hasOwnProperty("previous") ? `<s>$${product.price.previous}</s><br>` : ""}
                    ${product.hasOwnProperty("switch_types") ? showSwitchTypes(product.id, product.switch_types) : ""}
                </div>
                <a href="./product.html?id=${product.id}" class="d-inline-block text-decoration-none position-absolute" style="bottom: 0px; right: 0px;">See more</a>
            </div>
        `);
    }
}

function displaySingleProduct(product) {
    // First block
    let html = `
        <img class="img-fluid mb-3" src="${product.img.src}" alt="${product.img.alt}">
        <table class="table table-striped">
            <tbody>
                <tr>
                    <td class="w-25">Manufacturer: </td>
                    <td>${getSingleName(BRANDS, product.brand_id)}</td>
                </tr>
                <tr>
                    <td class="w-25">Model: </td>
                    <td>${product.name}</td>
                </tr>
                ${product.hasOwnProperty("connectivity") ? `
                    <tr>
                        <td class="w-25">Connectivity:</td>
                        <td>${getSingleName(CONNECTIVITY, product.connectivity)}</td>
                    </tr>
                ` : ""}
                ${product.hasOwnProperty("size") ? `
                    <tr>
                        <td class="w-25">Size:</td>
                        <td>${getSingleName(SIZES, product.size)}</td>
                    </tr>
                ` : ""}
                ${product.hasOwnProperty("specifications") ? `
                    <tr>
                        <td class="w-25">Specifications:</td>
                        <td>${getMultipleNames(SPECIFICATIONS, product.specifications)}</td>
                    </tr>
                ` : ""}
            </tbody>
        </table>
    `;
    $(IMGDESCBLOCK).html(html);
    
    // Second block
    let secondHtml = `
        <div class="w-50">
            <h2>${getSingleName(BRANDS, product.brand_id)}</h2>
            <h3>${product.name}</h3>
            <p id="price">Price : $${product.price.current}</p>
            ${product.price.hasOwnProperty("previous") ? `<s class="py-1">$${product.price.previous}</s>` : ""}
            ${product.hasOwnProperty("switch_types") ? `
                <br>
                <div class="btn-group py-2" role="group">
                    ${generateSwitchButtons(product.switch_types)}
                </div>
            ` : ""}
        </div>
        <div class="w-50">
            <p class="pt-md-3 mb-1">Quantity:</p>
            <div class="mm-quantity row mx-0 justify-content-between">
                <button class="w-25 text-center" onClick="decreaseQuantity()">&minus;</button>
                <input type="text" readonly class="w-25 text-center form-control-plaintext d-block" id="quantity" value="1">
                <button class="w-25 text-center d-block" onClick="increaseQuantity()">&plus;</button>
            </div>
            <button id="add-to-cart" class="my-3 px-3">Add to Cart</button>
        </div>
        <div id="post-add" class="w-100" style="display: none">
            <div class="alert alert-success">You have successfully added item to cart.</div>
            <div class="row justify-content-between w-100 mx-auto">
                <button id="hide" onClick="$(this).parent().parent().slideUp();" style="width: 40%;">
                    Stay
                </button>
                <a href="./cart.html" class="text-reset text-decoration-none d-inline-block" style="width: 40%;">Go to cart</a>
            </div>
        </div>
    `;
    $(HEADINGOPTIONSBLOCK).html(secondHtml);
    $("#add-to-cart").click(() => {
        if (product.hasOwnProperty("switch_types")) {
            addToCart(product.id, $("#quantity").val(), $("input[type='radio']:checked").val());
        } else {
            addToCart(product.id, $("#quantity").val());
        }
    });
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
        default:
            PRODUCTS.sort((a, b) => a.id > b.id);
            break;
    }
    displayProducts(PRODUCTS);
}

function getSingleObject(objArray, id) {
    return objArray.filter(x => x.id == id)[0];
}

function getSingleName(objArray, id) {
    try {
        return objArray.filter(x => x.id == id)[0].name;
    }
    catch (exception) {
        console.log(exception);
        return "/";
    }
}

function getMultipleNames(objArray, idArray) {
    try {
        let names = "";
        console.log(idArray)
        console.log(objArray)
        for (const obj of objArray) {
            if (idArray.includes(obj.id)) names += `${obj.name}; `;
        }
        if (names == undefined) return "/";
        return names;
    }
    catch (exception) {
        console.log(exception);
        return "/";
    }
}

function showSwitchTypes(productId, ids) {
    let switches = SWITCHTYPES.filter(sw => ids.includes(sw.id));
    let html = '';
    for (const sw of switches) {
        html += `
            <a href="./product.html?id=${productId}&switch=${sw.id}" class="mm-switch d-inline-block mb-2 flex-end">${sw.name}</a>
        `;
    }
    return html;
}

function generateSwitchButtons(switchIds) {
    let params = new URLSearchParams(document.location.search);
    let selected = parseInt(params.get("switch"));

    if (selected == null || !switchIds.includes(selected)) selected = switchIds[0];
    let html = "";
    for (const sw of switchIds) {
        html += `
            <input type="radio" class="btn-check" name="switchradio" value="${sw}" id="switch-${sw}" autocomplete="off" ${selected == sw ? "checked" : ""}>
            <label class="btn btn-outline-primary" for="switch-${sw}">${getSingleName(SWITCHTYPES, sw)}</label>
        `;
    }
    return html;
}

function decreaseQuantity(cartItemId = null) {
    let cartRow = $(`#cart-item-${cartItemId}`)
    let quantityBlock;
    if (cartItemId != null) {
        quantityBlock = cartRow.find("#quantity");
    } else {
        quantityBlock = $("#quantity");
    }
    let quantity = parseInt($(quantityBlock).val());
    if (quantity > 1) {
        $(quantityBlock).val(--quantity);
    }

    if (cartItemId != null) {
        let cart = getLocalStorage("cart");
        cart.filter(x => x.cartId == cartItemId)[0].quantity = quantity;
        addToLocalStorage("cart", cart);

        $(cartRow).find(".item-total")[0].textContent = `$${calculateTotal(cartItemId)}`;
        $("#cart-total").text(calculateCartTotal());
    }
}

function increaseQuantity(cartItemId = null) {
    let cartRow = $(`#cart-item-${cartItemId}`)
    let quantityBlock;
    if (cartItemId != null) {
        quantityBlock = cartRow.find("#quantity");
    } else {
        quantityBlock = $("#quantity");
    }
    let quantity = parseInt($(quantityBlock).val());
    if (quantity < 10) {
        $(quantityBlock).val(++quantity)
    }

    if (cartItemId != null) {
        let cart = getLocalStorage("cart");
        cart.filter(x => x.cartId == cartItemId)[0].quantity = quantity;
        addToLocalStorage("cart", cart);

        $(cartRow).find(".item-total")[0].textContent = `$${calculateTotal(cartItemId)}`;
        $("#cart-total").text(calculateCartTotal());
    }
}

function removeItem(cartItemId) {
    let newCart = getLocalStorage("cart").filter(x => x.cartId != cartItemId);
    addToLocalStorage("cart", newCart);
    if (newCart.length == 0) {
        displayCart();
        addToLocalStorage("cart", []);
        addToLocalStorage("nextCartId", 1);
    } else {
        $(`#cart-item-${cartItemId}`).remove();
        $("#cart-total").text(calculateCartTotal());
    }

    displayTotalCartItems();
}

function clearCart() {
    resetCart();
    displayCart();
    displayTotalCartItems();
}

function lockForm() {
    let formElements = $("input");
    $(formElements).attr("disabled", "disabled");
    $(".error-text").remove();
    $("input").css("outline", "none");
}

function addToCart(itemId, quantity, switchType = 0) {
    let nextCartId = getLocalStorage("nextCartId");
    const cartObj = {
        "cartId" : nextCartId,
        "id" : itemId,
        "quantity" : parseInt(quantity),
        "switch_type" : parseInt(switchType)
    }
    let cart = getLocalStorage("cart");
    cart.push(cartObj);
    addToLocalStorage("cart", cart);
    $("#post-add").slideDown();

    addToLocalStorage("nextCartId", nextCartId + 1);
    displayTotalCartItems();
    console.log("Added to cart " + itemId + " Quantity : " + quantity);
}

function displayCart() {
    let cartBlock = $("#cart-items");
    let cartItems = getLocalStorage("cart");

    if (cartItems.length == 0) {
        let html = '<h3 class="text-center">No items in cart...</h3>';
        cartBlock.html(html);
        lockForm();
    } else {
        let html = `
            <table class="table">
                <thead>
                    <tr>
                        <th class="d-sm-none">Product</th>
                        <th class="d-none d-lg-table-cell">Product Image</th>
                        <th class="d-none d-sm-table-cell">Product Name</th>
                        <th class="d-none d-sm-table-cell">Switch type</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
        `;
        for (const el of cartItems) {
            let productObj = getSingleObject(PRODUCTS, el.id);
            html += `
                <tr id="cart-item-${el.cartId}">
                    <td class="d-sm-none">
                        <a class="text-reset" 
                        href="./product.html?id=${el.id}${el.switch_type != 0 ? `&switch=${el.switch_type}` : ""}">
                        ${getSingleName(PRODUCTS, el.id) + (el.switch_type != 0 ? ` ${getSingleName(SWITCHTYPES, el.switch_type)}` : "")}
                        </a>
                    </td>
                    <td class="d-none d-lg-table-cell">
                        <a href="./product.html?id=${el.id}${el.switch_type != 0 ? `&switch=${el.switch_type}` : ""}">
                            <img src="${productObj.img.src}" alt="${productObj.img.alt}">
                        </a>
                    </td>
                    <td class="d-none d-sm-table-cell">
                        <a class="text-reset" 
                        href="./product.html?id=${el.id}${el.switch_type != 0 ? `&switch=${el.switch_type}` : ""}">
                        ${getSingleName(PRODUCTS, el.id)}
                        </a>
                    </td>
                    <td class="d-none d-sm-table-cell">
                        ${el.switch_type != 0 ? getSingleName(SWITCHTYPES, el.switch_type) : "/"}
                    </td>
                    <td>
                        <div class="mm-quantity row mx-0 justify-content-between">
                            <button class="text-center" onClick="decreaseQuantity(${el.cartId})">&minus;</button>
                            <input type="text" readonly class="w-25 text-center form-control-plaintext d-block" id="quantity" value="${el.quantity}">
                            <button class="text-center d-block" onClick="increaseQuantity(${el.cartId})">&plus;</button>
                        </div>
                    </td>
                    <td class="item-total">$${calculateTotal(el.cartId)}</td>
                    <td>
                        <button class="btn btn-light" onClick="removeItem(${el.cartId})">Remove</button>
                    </td>
                </tr>
            `;
        }
        html += `
                <tr>
                    <td class="d-none d-lg-table-cell" colspan="4" class="text-end"></td>
                    <td class="d-none d-sm-table-cell d-lg-none" colspan="3" class="text-end"></td>
                    <td class="d-sm-none" colspan="2"></td>
                    <td id="cart-total"></td>
                    <td><button class="btn btn-light" onClick="clearCart()">Clear cart</button></td>
                </tr>
                </tbody>
            </table>
        `;
        $(cartBlock).html(html);
        $("#cart-total").text(calculateCartTotal());
    }
}

function addToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function calculateTotal(cartId) {
    let cartItem = getLocalStorage("cart").filter(x => x.cartId == cartId)[0];
    let product = PRODUCTS.filter(x => x.id == cartItem.id)[0];
    let total = product.price.current * cartItem.quantity;
    total = total.toFixed(2);
    return total;
}

function calculateCartTotal() {
    let cartItems = $("[id^=cart-item-");
    let str = "$";
    let total = 0;
    for (const cartItem of cartItems) {
        let quantityText = cartItem.querySelector(".item-total").textContent;
        total += parseFloat(quantityText.substr(1));
    }
    total = total.toFixed(2);
    return str += total;
}

function displayTotalCartItems() {
    let numberOfCartItems = getLocalStorage("cart").length;
    if (numberOfCartItems != 0) {
        let html = `
            <div class="cart-item-number">
                ${numberOfCartItems > 9 ? "9+" : numberOfCartItems}
            </div>
        `;
        $("i.fa-cart-shopping").append(html);
    } else {
        // Remove all numbers if all items from cart have been removed
        let blocks = $(".cart-item-number");
        if (blocks != 0) {
            $(blocks).remove();
        }
    }
}

function resetCart() {
    addToLocalStorage("cart", []);
    addToLocalStorage("nextCartId", 1);
}

initializePage();

if (getLocalStorage("cart") == null) {
    resetCart();
}

window.addEventListener("load", () => {
    // Select all form elements
    let formElements = document.querySelectorAll('input[type="text"], #check-pp');

    // Add appropriate event listeners to them
    for (const element of formElements) {
        let jQueryEl = $(element);
        if (jQueryEl.attr("type") == "checkbox") {
            $(element).change(checkFormElement);
            continue;
        }
        jQueryEl.blur(checkFormElement);
    }

    // Make sure form is valid before submition
    let form = document.querySelector("form");
    if (form != null) {
        // Add opening privacy policy menu
        form.addEventListener("submit", function (event) {
            event.preventDefault();
    
            // Fires blur or change event on every form element so 
            // that we can check if all form elements values are valid
            for (const element of formElements) {
                let jQueryEl = $(element);
                if (jQueryEl.attr("type") == "checkbox") {
                    jQueryEl.change();
                    continue;
                }
                jQueryEl.blur();
            }
    
            // After running checkFormElement for every form
            // element if no errors are present we can submit the form
            for (const element of formErrors) {
                if (element.isVisible) return;
            }

            // Submit form and reset cart
            resetCart();
            form.submit();
        });
    }
});