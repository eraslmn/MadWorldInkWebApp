let myCart = [];
const myTable = document.getElementById('table');

const itemsFromLocalStorage = JSON.parse(localStorage.getItem("myCart"));
if (itemsFromLocalStorage) {
    myCart = itemsFromLocalStorage;
    render(myCart);
}

function render(cart) {
    let listItems = `
    <tr>
    <th>#</th>
    <th>AP</th>
    <th>Name</th>
    <th>Quantity</th>
    <th>Price</th>
    </tr>
    `;
    for (let i = 0; i < cart.length; i++) {
        listItems += `
        <tr>
            <td>${cart[i].id}</td>
            <td><img src="http://localhost/responsive-audemars-piguet/img/AP_${cart[i].img}.jpg" alt="" border=1 height=64></td>
            <td class="name">${cart[i].name}</td>
            <td style="padding: 10px 40px;">
                ${cart[i].quantity}
            </td>
            <td>${cart[i].price} &euro;</td>
        </tr>
        `
    }
    listItems += `
    <tr style="border-top: 1px solid whitesmoke;">
        <td colspan='4' style="text-align: left; font-weight: 700;">Estimated total: </td>
        <td id="total" style="text-align: center; font-weight: 700; width: 120px"></td>
    </tr>
    `
    myTable.innerHTML = listItems;

    let sum = 0;
    let totalVal = ``;
    for (let i = 0; i < cart.length; i++) {
        sum += cart[i].price;
    }
    totalVal += ` ${sum} &euro;`;
    document.getElementById('total').innerHTML = totalVal;
}

const order = document.getElementById('order');
order.addEventListener('click', function () {
    localStorage.clear();
})