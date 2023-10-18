const form = document.getElementById("expense");

const descData = document.getElementById("description");

const amount = document.getElementById("amount");

const category = document.getElementById("selectItem");

const error = document.getElementById("error");

const razorPay = document.getElementById("razor-pay");

const premium = document.getElementById("premium-member");

const leaderBoard = document.getElementById("leader-board");

const leaderListElement = document.getElementById("leader-list");

const listElement = document.getElementById("list");

const lead = document.getElementById("lead");

const downloadExpense = document.getElementById("download-expense");

const downloadOldExpense = document.getElementById("download-old-expense");

const allFile = document.getElementById("all-file");

const pagination = document.getElementById("pagination");

const noOfItem = document.getElementById("no-of-item")

if (localStorage.getItem("noOfItem")) {
    noOfItem.value = localStorage.getItem("noOfItem")
}

noOfItem.onchange = () => {
    localStorage.setItem("noOfItem", noOfItem.value);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let expense = {
        description: descData.value,
        category: category.value,
        amount: amount.value,
    };
    try {
        const token = localStorage.getItem("token")
        const expenseDetail = await axios.post("http://localhost:3000/expense", expense, { headers: { "Authorization": token } });
        ShowValue(expenseDetail.data.expenseData)

    } catch (err) {
        showError(err);
    }
});

window.addEventListener("DOMContentLoaded", () => {

    const page = 1;
    getProducts(page);
});

function showPagination(currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage) {
    pagination.innerHTML = "";

    if (hasPreviousPage) {
        const btn2 = document.createElement("button");
        btn2.innerHTML = previousPage;
        btn2.onclick = () => {
            getProducts(previousPage);
        }
        pagination.appendChild(btn2);
        const btn1 = document.createElement("button");
        btn1.innerHTML = `<h3>${currentPage}</h3>`;
        btn1.onclick = () => {
            getProducts(currentPage);
        }
        pagination.appendChild(btn1);
    }
    else {
        const btn1 = document.createElement("button");
        btn1.innerHTML = `<h3>${currentPage}</h3>`;
        btn1.onclick = () => {
            getProducts(currentPage);
        }
        pagination.appendChild(btn1);
    }

    if (hasNextPage) {
        const btn3 = document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.onclick = () => {
            getProducts(nextPage);
        }
        pagination.appendChild(btn3);
    }
    const btn4 = document.createElement("button");
    btn4.innerHTML = `Last Page ${lastPage} `;
    btn4.onclick = () => {
        getProducts(lastPage);
    }
    pagination.appendChild(btn4);
}

async function getProducts(page) {
    try {
        const token = localStorage.getItem("token")
        const item = localStorage.getItem("noOfItem")
        const all = await axios.get(`http://localhost:3000/expense/?page=${page}&item=${item}`, { headers: { "Authorization": token } });
        listElement.innerHTML = "";
        if (all.data.isPremium === true) {
            premiumFeatures();
            loopData(all);
        }
        else {
            loopData(all);
        }
    } catch (err) {
        showError(err);
    }
}

function loopData(all) {
    for (let i = 0; i < all.data.allExpense.length; i++) {
        ShowValue(all.data.allExpense[i]);
    }
    showPagination(all.data.currentPage, all.data.hasNextPage, all.data.nextPage, all.data.hasPreviousPage, all.data.previousPage, all.data.lastPage)

}


function ShowValue(expenseVal) {

    const subElement = document.createElement("li");

    subElement.textContent = `Description: ${expenseVal.description} - Expense amount: ${expenseVal.amount} - Category: ${expenseVal.category}`;

    const deleteBtn = document.createElement("input");
    deleteBtn.type = "button";
    deleteBtn.value = "Delete";

    deleteBtn.onclick = () => {
        listElement.removeChild(subElement)
        deleteVal(expenseVal);
    };

    subElement.appendChild(deleteBtn);
    listElement.appendChild(subElement);
}

async function deleteVal(v) {
    try {
        const token = await localStorage.getItem("token")
        await axios.delete(`http://localhost:3000/expense/${v._id}`, { headers: { "Authorization": token } })
    } catch (err) {
        showError(err);
    }
}

razorPay.onclick = async (e) => {

    const token = localStorage.getItem('token');
    const result = await axios.get("http://localhost:3000/purchase", { headers: { "Authorization": token } });

    let options = {
        "key": result.data.key_id,
        "order_id": result.data.order.id,
        "handler": async function (response) {
            await axios.post("http://localhost:3000/purchase", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })
            premiumFeatures();

            alert("You are a premium member now");
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
    rzp1.on("payment.failed", async function (response) {
        console.log(response);
        await axios.post("http://localhost:3000/purchase", {
            order_id: options.order_id,
            payment_id: null
        },
            { headers: { "Authorization": token } })
        alert("something went wrong");
    })
}

let isLeaderboardOpen = false;

leaderBoard.onclick = async () => {
    try {
        const token = localStorage.getItem("token")
        if (!isLeaderboardOpen) {
            const result = await axios.get("http://localhost:3000/showleaderboard", { headers: { "Authorization": token } });
            if (result.data.isPremium === true) {
                for (let i = 0; i < result.data.leaderboard.length; i++) {
                    showLeaderboard(result.data.leaderboard[i]);
                }
            }
            isLeaderboardOpen = true;
        }
        else {
            leaderListElement.innerHTML = "";
            isLeaderboardOpen = false;
        }
    } catch (err) {
        showError(err);
    }
}

function showLeaderboard(lead) {
    const subElement = document.createElement("li");
    subElement.textContent = `Name: ${lead.name} - Total Expense: ${lead.totalExpense}`;

    leaderListElement.appendChild(subElement);

}
downloadExpense.onclick = async () => {
    try {
        const token = localStorage.getItem("token")
        let result = await axios.get("http://localhost:3000/download", { headers: { "Authorization": token } })
        if (result.data.isPremium === true) {
            const a = document.createElement("a");
            a.href = result.data.fileUrl;
            a.download = "myexpene.txt"
            a.click()
        }
    } catch (err) {
        showError(err);
    }
}
let isDownloadOpen = false;
downloadOldExpense.onclick = async () => {
    try {
        const token = localStorage.getItem("token")
        if (!isDownloadOpen) {
            let result = await axios.get("http://localhost:3000/downloadoldfiles", { headers: { "Authorization": token } })
            if (result.data.isPremium === true) {
                for (let i = 0; i < result.data.allFile.length; i++) {
                    showAllFile(result.data.allFile[i]);
                }
            }
            isDownloadOpen = true
        }
        else {
            allFile.innerHTML = "";
            isDownloadOpen = false;
        }
    } catch (err) {
        showError(err);
    }
}
function showAllFile(val) {
    const subElement = document.createElement("li");
    const a = document.createElement("a");
    const date = new Date(val.createdAt);
    subElement.innerHTML = `<a href = ${val.fileUrl} style="text-decoration:none; color:black">${date.toLocaleString()} Click to download</a>`
    a.download = "myexpene.txt"
    allFile.appendChild(subElement);
    a.click()
}

function premiumFeatures() {
    razorPay.style.display = "none";
    premium.style.display = "block";
    lead.style.display = "block";
    downloadExpense.style.display = "block";
    downloadOldExpense.style.display = "block";
}

function showError(err) {
    if (err.response !== undefined) {
        error.textContent = `Error: ${err.response.data.Error}`;
    } else {
        error.textContent = `Error: ${err.message}`;
    }
}