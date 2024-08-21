let count = 0;
let myCart = [];
let quantity = [1, 1, 1, 1, 1, 1, 1, 1]; // Sasia
let sum = 0;
let listItems = ``;
let totalVal = ``;

const myTable = document.getElementById("table"); // Tabela

/* <!-------- Produktet --------!> */
const btnProducts = new Array(8);
const products = [
    { name: "R. O. O. Selfwinding Chronograph", img: 1, price: 37850, clicked: false },
    { name: "R. O. Selfwinding", img: 2, price: 32500, clicked: false },
    { name: "New R. O. O. Diver", img: 3, price: 20000, clicked: false },
    { name: "R. O. O. Selfwinding Flying Tourbillion Chronograph", img: 4, price: 230740, clicked: false },
    { name: "Code 11.59 by AP Selfwinding Chronograph", img: 5, price: 37500, clicked: false },
    { name: "R. O. 'Jumbo' Extra-Thin", img: 6, price: 93000, clicked: false },
    { name: "R. O. Concept 'Black Panther' Flying Tourbillion", img: 7, price: 449914, clicked: false },
    { name: "R. O. O.", img: 8, price: 26500, clicked: false }
];

for (let i = 0; i < btnProducts.length; i++) {
    btnProducts[i] = document.getElementById(`btn-${i + 1}`);
}

for (let i = 0; i < btnProducts.length; i++) {
    btnProducts[i].addEventListener('click', function () {
        if (products[i].clicked == false) {
            count++;
            myCart.push({ id: count, name: products[i].name, img: products[i].img, quantity: 1, price: products[i].price });
            localStorage.setItem("myCart", JSON.stringify(myCart));
            products[i].clicked = true;
            render(myCart);
        }
        else {
            window.alert("Product is in the shopping list.");
        }
    })
}

/* <!-------- Cmimet --------!> */
let prices = ['', '', '', '', '', '', '', ''];

/* <!-------- Rritja, pakësimi dhe fshirja e produkteve nga lista --------!> */
const incBtn = new Array(8);
const decBtn = new Array(8);
const dltBtn = new Array(8);

/* <!-------- Printojmë elementet që gjenden në localStorage --------!> */
const itemsFromLocalStorage = JSON.parse(localStorage.getItem("myCart"));

if (itemsFromLocalStorage) {
    myCart = itemsFromLocalStorage;
    for (let i = 0; i < myCart.length; i++) {
        count = myCart.length;
        quantity[i] = myCart[i].quantity;
        prices[i] = myCart[i].price / quantity[i];
        for (let j = 0; j < products.length; j++) {
            if (myCart[i].name == products[j].name)
                products[j].clicked = true;
        }
    }
    render(myCart);
}

function render(cart) {
    document.getElementById("no-items").style.display = "none";
    document.getElementById("list").style.display = "block";

    listItems = `
    <th colspan='6'>Your Cart (${count})<th>
    `;
    for (let i = 0; i < cart.length; i++) {
        listItems += `
        <tr>
            <td>${cart[i].id}</td>
            <td><img src="http://localhost/madworldinkt/img/AP_${cart[i].img}.jpg" alt="" class="tb-img" border=1 height=64></td>
            <td class="tb-name">${cart[i].name}</td>
            <td class="qty-td" width=100>
                <button id="dec-btn${i + 1}" class="tb-button"><i class='bx bx-minus'></i></button>
                <input id="qty${i + 1}" class="qty" type="number" value="${quantity[i]}" readonly>
                <button id="inc-btn${i + 1}" class="tb-button"><i class='bx bx-plus'></i></button>
            </td>
            <td class="tb-price" id="itemPrice${i + 1}" width=110>${cart[i].price} &euro;</td>
            <td><button id="dlt-btn${i + 1}" class="tb-button xbtn"><i class='bx bx-x'></i></button></td>
            <td>
        </tr>
        `;
    }
    listItems += `
    <tr style="border-top: 1px solid whitesmoke;">
        <td colspan='4' style="text-align: left; font-weight: 700;">Estimated total: </td>
        <td class="tb-total" id="total" style="text-align: center; font-weight: 700;" width=110></td>
        <td><button id="remove" ondblclick="deleteList()"><i class='bx bx-x'></i></button></td>
    </tr>
    `
    myTable.innerHTML = listItems;

    document.getElementById('count-items').style.display = 'flex';
    document.getElementById('count-items').innerHTML = count;

    for (let i = 0; i < cart.length; i++) {
        incBtn[i] = document.getElementById(`inc-btn${i + 1}`)
        decBtn[i] = document.getElementById(`dec-btn${i + 1}`)
        dltBtn[i] = document.getElementById(`dlt-btn${i + 1}`)
    }

    for (let i = 0; i < cart.length; i++) {
        incBtn[i].addEventListener('click', function () {
            inc(i);
        })
        decBtn[i].addEventListener('click', function () {
            dec(i);
        })
        dltBtn[i].addEventListener('click', function () {
            dlt(i);
        })
    }

    /* <!-------- Çmimi total i produkteve --------!> */
    sum = 0;
    for (let i = 0; i < cart.length; i++) {
        sum += cart[i].price;
    }
    totalVal = `${sum} &euro;`;
    document.getElementById('total').innerHTML = totalVal;
}

function inc(i) {
    if (prices[i] == '')
        prices[i] = myCart[i].price;

    let temp = document.getElementById(`qty${i + 1}`).value;
    temp++;
    myCart[i].quantity = temp;
    quantity[i] = temp;

    let x = prices[i] * temp;
    myCart[i].price = x;
    localStorage.setItem("myCart", JSON.stringify(myCart));

    render(myCart);
}

function dec(i) {
    if (document.getElementById(`qty${i + 1}`).value != 1) {
        let temp = document.getElementById(`qty${i + 1}`).value;
        temp--;
        myCart[i].quantity = temp;
        quantity[i] = temp;

        let x = myCart[i].price - prices[i];
        myCart[i].price = x;
        localStorage.setItem("myCart", JSON.stringify(myCart));

        render(myCart);
    }
}

function dlt(i) {
    count = myCart[i].id;
    for (let j = 0; j < products.length; j++) {
        if (myCart[i].name == products[j].name)
            products[j].clicked = false;
    }
    for (; i < myCart.length - 1; i++) {
        let temp = myCart[i];
        myCart[i] = myCart[i + 1];
        myCart[i + 1] = temp;

        quantity[i] = myCart[i].quantity;
        prices[i] = myCart[i].price / quantity[i];

        myCart[i].id = count;
        count++;
    }
    myCart.pop();
    count--;
    quantity[i] = 1;
    prices[i] = '';
    localStorage.setItem("myCart", JSON.stringify(myCart));
    render(myCart);
    if (myCart[0] == null) {
        deleteList();
    }
}

function deleteList() {
    count = 0;
    myCart = [];
    quantity = [1, 1, 1, 1, 1, 1, 1, 1];
    listItems = ``;
    myTable.innerHTML = listItems;
    prices = ['', '', '', '', '', '', '', ''];
    for (let i = 0; i < products.length; i++) {
        products[i].clicked = false;
    }
    localStorage.clear();
    document.getElementById('list').style.display = "none";
    document.getElementById('shopping-list').style.right = "-30rem";
    document.getElementById('cart').style.display = "block";
    document.getElementById('count-items').style.display = "none";
    document.getElementById("no-items").style.display = "block";
}