let isAdmin = false;

let sellingProducts = JSON.parse(localStorage.getItem("sellingProducts")) || [];
let soldProducts = JSON.parse(localStorage.getItem("soldProducts")) || [];



function showTab(tabName) {
    let tabs = document.querySelectorAll(".tab");

    tabs.forEach(function(tab) {
        tab.style.display = "none";
    });

    document.getElementById(tabName).style.display = "block";
}

function adminLogin() {
    let password = prompt("관리자 비밀번호 입력");

    if (password === "1234") {
        isAdmin = true;
        alert("관리자 모드 활성화!");

        document.getElementById("plusBtn").style.display = "block";

        document.querySelector("#sell .content").innerHTML =
            '<div class="box plus" id="plusBtn" onclick="addProduct()">+</div>';

        sellingProducts.forEach(product => {
            createSellingCard(product);
        });

        document.getElementById("sold").innerHTML = "<h2>품절 상품</h2>";

        soldProducts.forEach(product => {
            createSoldCard(product);
        });

    } else {
        alert("비밀번호가 틀렸어요!");
    }
}

function addProduct() {
    if (!isAdmin) {
        alert("관리자만 추가할 수 있어요!");
        return;
    }

    let name = prompt("상품 이름 입력");
    let price = prompt("가격 입력");
    let image = prompt("사진 링크 입력");

    let product = {
        name: name,
        price: price,
        image: image
    };

    sellingProducts.push(product);
    localStorage.setItem("sellingProducts", JSON.stringify(sellingProducts));

    createSellingCard(product);
}

function createSellingCard(product) {
    let newCard = document.createElement("div");
    newCard.className = "card";

    let adminButtons = "";

    if (isAdmin) {
        adminButtons = `
            <button onclick="soldOut(this)">품절 처리</button>
            <button onclick="deleteProduct(this, 'selling')">삭제</button>
        `;
    }

    newCard.innerHTML = `
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>${product.price}원</p>
        ${adminButtons}
    `;

    document.querySelector("#sell .content").appendChild(newCard);
}

function createSoldCard(product) {
    let newCard = document.createElement("div");
    newCard.className = "card";

    let adminButtons = "";

    if (isAdmin) {
        adminButtons = `
            <button onclick="backToSelling(this)">다시 판매</button>
            <button onclick="deleteProduct(this, 'sold')">삭제</button>
        `;
    }

    newCard.innerHTML = `
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>${product.price}원</p>
        ${adminButtons}
    `;

    document.getElementById("sold").appendChild(newCard);
}

function soldOut(button) {
    let card = button.parentElement;

    let name = card.querySelector("h3").innerText;
    let price = card.querySelector("p").innerText.replace("원", "");
    let image = card.querySelector("img").src;

    let product = {
        name: name,
        price: price,
        image: image
    };

    sellingProducts = sellingProducts.filter(p => p.name !== name);
    soldProducts.push(product);

    localStorage.setItem("sellingProducts", JSON.stringify(sellingProducts));
    localStorage.setItem("soldProducts", JSON.stringify(soldProducts));

    card.remove();
    createSoldCard(product);
}

function backToSelling(button) {
    let card = button.parentElement;

    let name = card.querySelector("h3").innerText;
    let price = card.querySelector("p").innerText.replace("원", "");
    let image = card.querySelector("img").src;

    let product = {
        name: name,
        price: price,
        image: image
    };

    soldProducts = soldProducts.filter(p => p.name !== name);
    sellingProducts.push(product);

    localStorage.setItem("soldProducts", JSON.stringify(soldProducts));
    localStorage.setItem("sellingProducts", JSON.stringify(sellingProducts));

    card.remove();
    createSellingCard(product);
}

function deleteProduct(button, type) {
    let card = button.parentElement;
    let name = card.querySelector("h3").innerText;

    if (type === "selling") {
        sellingProducts = sellingProducts.filter(p => p.name !== name);
        localStorage.setItem("sellingProducts", JSON.stringify(sellingProducts));
    }

    if (type === "sold") {
        soldProducts = soldProducts.filter(p => p.name !== name);
        localStorage.setItem("soldProducts", JSON.stringify(soldProducts));
    }

    card.remove();
}

function loadProducts() {
    if (isAdmin) {
        document.getElementById("plusBtn").style.display = "block";
    }

    sellingProducts.forEach(product => {
        createSellingCard(product);
    });

    soldProducts.forEach(product => {
        createSoldCard(product);
    });
}

loadProducts();