import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5JBKNw_Y1TBBMSd-b0KDvAdHAdFg-b4k",
  authDomain: "shop-e9a28.firebaseapp.com",
  projectId: "shop-e9a28",
  storageBucket: "shop-e9a28.firebasestorage.app",
  messagingSenderId: "647948090722",
  appId: "1:647948090722:web:4f04adde3c406477b9c03b",
  measurementId: "G-6Q5DL2H3MJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let isAdmin = false;

function showTab(tabName) {
    let tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => tab.style.display = "none");
    document.getElementById(tabName).style.display = "block";
}

window.showTab = showTab;

function adminLogin() {
    let password = prompt("관리자 비밀번호 입력");

    if (password === "0727") {
        isAdmin = true;
        alert("관리자 모드 활성화!");
        loadProducts();
    } else {
        alert("비밀번호가 틀렸어요!");
    }
}

window.adminLogin = adminLogin;

async function addProduct() {
    if (!isAdmin) {
        alert("관리자만 추가할 수 있어요!");
        return;
    }

    let name = prompt("상품 이름");
    let price = prompt("가격");
    let image = prompt("사진 링크");

    await addDoc(collection(db, "selling"), {
        name,
        price,
        image
    });

    loadProducts();
}

window.addProduct = addProduct;

function createSellingCard(product, id) {
    let card = document.createElement("div");
    card.className = "card";

    let adminButtons = "";

    if (isAdmin) {
        adminButtons = `
            <button onclick="soldOut('${id}')">품절 처리</button>
            <button onclick="deleteProduct('${id}', 'selling')">삭제</button>
        `;
    }

    card.innerHTML = `
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>${product.price}원</p>
        ${adminButtons}
    `;

    document.querySelector("#sell .content").appendChild(card);
}

function createSoldCard(product, id) {
    let card = document.createElement("div");
    card.className = "card";

    let adminButtons = "";

    if (isAdmin) {
        adminButtons = `
            <button onclick="backToSelling('${id}')">다시 판매</button>
            <button onclick="deleteProduct('${id}', 'sold')">삭제</button>
        `;
    }

    card.innerHTML = `
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>${product.price}원</p>
        ${adminButtons}
    `;

    document.getElementById("sold").appendChild(card);
}

async function soldOut(id) {
    const sellingRef = collection(db, "selling");
    const snapshot = await getDocs(sellingRef);

    snapshot.forEach(async (docSnap) => {
        if (docSnap.id === id) {
            const product = docSnap.data();

            await addDoc(collection(db, "sold"), product);
            await deleteDoc(doc(db, "selling", id));
        }
    });

    loadProducts();
}

window.soldOut = soldOut;

async function backToSelling(id) {
    const soldRef = collection(db, "sold");
    const snapshot = await getDocs(soldRef);

    snapshot.forEach(async (docSnap) => {
        if (docSnap.id === id) {
            const product = docSnap.data();

            await addDoc(collection(db, "selling"), product);
            await deleteDoc(doc(db, "sold", id));
        }
    });

    loadProducts();
}

window.backToSelling = backToSelling;

async function deleteProduct(id, type) {
    await deleteDoc(doc(db, type, id));
    loadProducts();
}

window.deleteProduct = deleteProduct;

async function loadProducts() {
    document.querySelector("#sell .content").innerHTML = `
        ${isAdmin ? '<div class="box plus" onclick="addProduct()">+</div>' : ''}
    `;

    document.getElementById("sold").innerHTML = "<h2>품절 상품</h2>";

    const sellingSnapshot = await getDocs(collection(db, "selling"));
    sellingSnapshot.forEach(docSnap => {
        createSellingCard(docSnap.data(), docSnap.id);
    });

    const soldSnapshot = await getDocs(collection(db, "sold"));
    soldSnapshot.forEach(docSnap => {
        createSoldCard(docSnap.data(), docSnap.id);
    });
}

loadProducts();

window.showTab = showTab;
window.adminLogin = adminLogin;
window.addProduct = addProduct;
window.soldOut = soldOut;
window.backToSelling = backToSelling;
window.deleteProduct = deleteProduct;