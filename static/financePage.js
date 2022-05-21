var localhostconst = "http://0.0.0.0:5000/";
var cashBalance = 0.00;

//Initial db fetch
updateFromDb();


function updateFromDb() {
    fetch('/static/financeDb.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        updateData(data);
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });
}

function updateData(data) {

    var mainContainer = document.getElementsByClassName("content")[0];

    //Clear children
    mainContainer.innerHTML = "";


    //Set up 5 tables
    var financeIncome = document.createElement("div");
    financeIncome.setAttribute("class", "financeIncome");
    var cashIncome = 0.00;

    var financeFixedCosts = document.createElement("div");
    financeFixedCosts.setAttribute("class", "financeFixedCosts");
    var cashFixedCosts = 0.00;

    var financeSavings = document.createElement("div");
    financeSavings.setAttribute("class", "financeSavings");
    var cashSavings = 0.00;

    var financeInfo = document.createElement("div");
    financeInfo.setAttribute("class", "financeInfo");

    var financeSpending = document.createElement("div");
    financeSpending.setAttribute("class", "financeSpending");
    var cashSpending = 0.00;


    //Update 5 tables with data

    //---- #1 ---- Income
    var financeIncomeTitle = document.createElement("div");
    financeIncomeTitle.setAttribute("id", "financeIncomeTitle");
    financeIncomeTitle.innerHTML = "INCOME";

    var financeIncomeItems = document.createElement("div");
    financeIncomeItems.setAttribute("id", "financeIncomeItems");
    //Display db data
    incomes = data['Income'];
    for (const [key, value] of Object.entries(incomes)) {
        financeIncomeItems.innerHTML += 
        "<div>" + value['info'] + " | $" + value['amount'] + 
        "&nbsp<button id=" + "'Income-" + value['info'] + "-" + value['amount'] + "'" +
        "type='button' onclick='deleteItem(this.id)'>x</button>" +
        "</div>";
        cashIncome += parseFloat(value['amount']);
    }
    //Add input & button
    var financeIncomeAdd = document.createElement("div");
    financeIncomeAdd.setAttribute("class", "financeIncomeAdd");
    financeIncomeAdd.innerHTML = 
    '<form id="incomeAddForm" action="/insert/table/info/amount" method="post">' +
    '<input type="text" id="incomeInfo" value="info">' +
    '<input type="text" id="incomeAmount" value="amount">' +
    '<input type="text" id="incomeTax" value="tax %">' +
    '<button type="button" id="incomeButton" onclick="insert(' + 0 + ')">Add</button></form>';



    //---- #2 ---- Fixed Costs
    var financeFixedCostsTitle = document.createElement("div");
    financeFixedCostsTitle.setAttribute("id", "financeFixedCostsTitle");
    financeFixedCostsTitle.innerHTML = "FIXED COSTS";

    var financeFixedCostsItems = document.createElement("div");
    financeFixedCostsItems.setAttribute("id", "financeFixedCostsItems");
    //Display db data
    fixedCosts = data['FixedCosts'];
    for (const [key, value] of Object.entries(fixedCosts)) {
        financeFixedCostsItems.innerHTML += 
        "<div>" + value['info'] + " | $" + value['amount'] + 
        "&nbsp<button id=" + "'FixedCosts-" + value['info'] + "-" + value['amount'] + "'" +
        "type='button' onclick='deleteItem(this.id)'>x</button>" +
        "</div>";
        cashFixedCosts += parseFloat(value['amount']);
    }
    //Add input & button
    var financeFixedCostsAdd = document.createElement("div");
    financeFixedCostsAdd.setAttribute("class", "financeFixedCostsAdd");
    financeFixedCostsAdd.innerHTML = 
    '<form id="fixedCostsAddForm" action="/insert/table/info/amount" method="post">' +
    '<input type="text" id="fixedCostsInfo" value="info">' +
    '<input type="text" id="fixedCostsAmount" value="amount">' +
    '<button type="button" id="fixedCostsButton" onclick="insert(' + 1 + ')">Add</button></form>';



    //---- #3 ---- Savings
    var financeSavingsTitle = document.createElement("div");
    financeSavingsTitle.setAttribute("id", "financeSavingsTitle");
    financeSavingsTitle.innerHTML = "SAVINGS";

    var financeSavingsItems = document.createElement("div");
    financeSavingsItems.setAttribute("id", "financeSavingsItems");
    //Display db data
    savings = data['Savings'];
    for (const [key, value] of Object.entries(savings)) {
        financeSavingsItems.innerHTML += 
        "<div>" + value['info'] + " | $" + value['amount'] + 
        "&nbsp<button id=" + "'Savings-" + value['info'] + "-" + value['amount'] + "'" +
        "type='button' onclick='deleteItem(this.id)'>x</button>" +
        "</div>";
        cashSavings += parseFloat(value['amount']);
    }
    //Add input & button
    var financeSavingsAdd = document.createElement("div");
    financeSavingsAdd.setAttribute("class", "financeSavingsAdd");
    financeSavingsAdd.innerHTML = 
    '<form id="savingsAddForm" action="/insert/table/info/amount" method="post">' +
    '<input type="text" id="savingsInfo" value="info">' +
    '<input type="text" id="savingsAmount" value="amount">' +
    '<input type="text" id="savingsPercent" value="%">' +
    '<button type="button" id="savingsButton" onclick="insert(' + 2 + ')">Add</button></form>';



    //---- #5 ---- Spending
    var financeSpendingTitle = document.createElement("div");
    financeSpendingTitle.setAttribute("id", "financeSpendingTitle");
    financeSpendingTitle.innerHTML = "SPENDING";

    var financeSpendingItems = document.createElement("div");
    financeSpendingItems.setAttribute("id", "financeSpendingItems");
    //Display db data
    spending = data['Spending'];
    for (const [key, value] of Object.entries(spending)) {
        financeSpendingItems.innerHTML += 
        "<div>" + "$" + (value['amount'])*-1 + "<div id='financeSpendingIndividualItem'>" + value['info'] + "</div>" +
        "&nbsp" +
        "&nbsp" +
        "</div>";
        cashSpending += Math.abs(parseFloat(value['amount']));
    }
    //Add input & button
    var financeSpendingAdd = document.createElement("div");
    financeSpendingAdd.setAttribute("class", "financeSpendingAdd");
    financeSpendingAdd.innerHTML = 
    '<form id="spendingAddForm" action="/insert/table/info/amount" method="post">' +
    '<input type="text" id="spendingInfo" value="info">' +
    '<input type="text" id="spendingAmount" value="amount">' +
    '<button type="button" id="spendingButton" onclick="insert(' + 3 + ')">Add</button></form>';


    //---- #4 ---- Summarizing Balance
    cashBalance = cashIncome - cashFixedCosts - cashSavings - cashSpending;

    var cashBalanceDisplay = document.createElement("div");
    cashBalanceDisplay.setAttribute("class", cashBalanceDisplay);
    cashBalanceDisplay.innerHTML = "<div id='financeAvailableBalance'>Available Balance: $" + Math.round(cashBalance) + "</div>";
    cashBalanceDisplay.innerHTML +=
    "<p>Income $" + cashIncome + "<br> [-" + Math.round(cashFixedCosts/cashIncome * 100) + "%] Fixed Costs: $" + 
    cashFixedCosts + "<br> [-" + Math.round(cashSavings/cashIncome * 100) + "%] Savings: $" + cashSavings +
    "<br> [-" + Math.round(cashSpending/cashBalance * 100) + "%] Spending: $" + Math.round(cashSpending) +
    "<br> [+" + Math.round(cashBalance/cashIncome * 100) + "%] Available Balance: $" + Math.round(cashBalance) + "</p>";

    cashBalanceDisplay.innerHTML +=
    '<input type="text" id="item1" value="u">' +
    '<input type="text" id="item2" value="p">' +
    '<button type="button" id="boaButton" onclick="boaFetch()">Fetch BoA Balance</button>';

    //Append each container to DOM
    var leftFinance = document.createElement("div");
    leftFinance.setAttribute("class", "leftFinance");
    mainContainer.appendChild(leftFinance);

    var rightFinance = document.createElement("div");
    rightFinance.setAttribute("class", "rightFinance");
    mainContainer.appendChild(rightFinance);

    leftFinance.appendChild(financeIncome);
    financeIncome.appendChild(financeIncomeTitle);
    financeIncome.appendChild(financeIncomeItems);
    financeIncome.appendChild(financeIncomeAdd);

    leftFinance.appendChild(financeFixedCosts);
    financeFixedCosts.appendChild(financeFixedCostsTitle);
    financeFixedCosts.appendChild(financeFixedCostsItems);
    financeFixedCosts.appendChild(financeFixedCostsAdd);

    leftFinance.appendChild(financeSavings);
    financeSavings.appendChild(financeSavingsTitle);
    financeSavings.appendChild(financeSavingsItems);
    financeSavings.appendChild(financeSavingsAdd);

    leftFinance.appendChild(financeInfo);
    financeInfo.appendChild(cashBalanceDisplay)

    rightFinance.appendChild(financeSpending);
    financeSpending.appendChild(financeSpendingTitle);
    financeSpending.appendChild(financeSpendingItems);
    financeSpending.appendChild(financeSpendingAdd);
}


function insert(formId) {

    var table = "";
    var info = "";
    var amount = "";
    var percent = "";
    var tax = "";

    if (formId == 0) { //Income
        table = "Income";
        info = "incomeInfo";
        amount = "incomeAmount";
        tax = "incomeTax";
    } else if (formId == 1) { //FixedCosts
        table = "FixedCosts";
        info = "fixedCostsInfo";
        amount = "fixedCostsAmount";
    } else if (formId == 2) { //Savings
        table = "Savings";
        info = "savingsInfo";
        amount = "savingsAmount";
        percent = "savingsPercent";
    } else { //Spending
        table = "Spending";
        info = "spendingInfo";
        amount = "spendingAmount";
    }

    info = document.getElementById(info).value;
    amount = document.getElementById(amount).value;

    amount = parseFloat(amount);

    if (formId == 2) {
        percent = document.getElementById(percent).value;
        percent = parseFloat(percent);
        info += " (" + percent + "% of " + amount + ")";
        amount = amount * (percent/100);        
    }

    if (formId == 0) {
        tax = document.getElementById(tax).value;
        tax = parseFloat(tax);
        info += " (" + tax + "% tax of " + amount + ")";
        amount = amount - (amount * (tax/100));
    }
    
    if (isNaN(amount)) {
        console.log("Error: invalid input");
    } else {
        myUrl = "/finance/" + table + "/" + info + "/" + amount;

        $.ajax({
            url: localhostconst + myUrl,
            type: 'POST',
            success: function(response) {
                console.log(response);
                updateFromDb();
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    
}

function deleteItem(id) {
    data = id.split('-');
    myUrl = "/finance/"+data[0]+"/"+data[1]

    $.ajax({
        url: localhostconst + myUrl,
        type: 'DELETE',
        success: function(response) {
            console.log(response);
            updateFromDb();
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function boaFetch() {
    item1 = document.getElementById("item1").value;
    item2 = document.getElementById("item2").value;

    myUrl = "fetchBalance/" + item1 + "/" + item2;
    $.ajax({
        url: localhostconst + myUrl,
        type: 'GET',
        success: function(response) {
            console.log(response);//use response data
            updateFromDb();
        },
        error: function(error) {
            console.log(error);
        }
    });
}
    




