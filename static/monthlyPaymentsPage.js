var localhostconst = "http://0.0.0.0:5000/";

//Initial db fetch
updateFromDb();


function updateFromDb() {
    fetch('/static/monthlyPaymentsDb.json')
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

    var monthlyPaymentsTitle= document.createElement("div");
    monthlyPaymentsTitle.setAttribute("class", "monthlyPaymentsTitle");
    monthlyPaymentsTitle.innerHTML = "MONTHLY PAYMENTS";

    var monthlyPaymentsItems = document.createElement("div");
    monthlyPaymentsItems.setAttribute("class", "monthlyPaymentsItems");
    
    //Get payments
    payments = data.MonthlyPayments["1"].paymentsList;

    today = new Date();
    daysTill = 0;

    //Add a 'days until due' number to each
    for (var i=0;i<payments.length;i++){
        dueDate = new Date(Date.parse(payments[i][2]));
        daysTill = Math.floor((dueDate.getTime() - today.getTime()) / (1000*3600*24));
        payments[i].push(daysTill);
    }

    //Sort by 'days until due'
    payments.sort(function(a, b) {
        if (a[6] === b[6]) {
            return 0;
        } else {
        return (a[6] < b[6]) ? -1 : 1;
        }
    });

    totalPaymentAmount = 0.00;
    //Insert into html
    for (var i=0;i<payments.length;i++){
        
        //Set complete color
        completeColor = "";
        if (payments[i][0] == 0) {
            completeColor = "white";
        } else {
            completeColor = "green";
        }

        //Set alert color

        totalPaymentAmount += payments[i][4];

        monthlyPaymentsItems.innerHTML +=
        "<div>" +
        "&nbsp<button class='moveButtons completeTodoButton' id='" + payments[i][1] + "'" +
        "type='button' onclick='completeItem(this.id)'><img style='background-color:" + completeColor + "' id='complete-" + payments[i][1] + "' src='/static/doneButton.png'/></button>" +
        
        "" + payments[i][6] + " day(s) till due   <   " + payments[i][2] + "   <   " + payments[i][3] + "   <   $" + payments[i][4] + "   <   " + payments[i][5] +

        "&nbsp<button class='moveButtons deleteTodoButton' id='" + payments[i][1] + "'" +
        "type='button' onclick='deleteItem(this.id)'><img src='/static/deleteButton.png'/></button>" +
        "<div class='todoDivider'></div>" +
        "</div>";
        console.log(payments[i][1]);

    }

    
    //--- #2 --- Add new todo item
    var monthlyPaymentsAdd = document.createElement("div");
    monthlyPaymentsAdd.setAttribute("class", "monthlyPaymentsAdd");

    monthlyPaymentsAdd.innerHTML = 
    '<br>' +
    '<input type="text" id="monthlyPaymentsInputDate" value="08/08/2021">' +
    '<input type="text" id="monthlyPaymentsInputInfo" value="info">' +
    '<input type="text" id="monthlyPaymentsInputAmount" value="0">' +
    '<input type="text" id="monthlyPaymentsInputMethod" value="method">' +
    '<button type="button" id="monthlyPaymentsButton" onclick="insert()">Add</button>';
    

    var monthlyPaymentsReset = document.createElement("div");
    monthlyPaymentsReset.setAttribute("class", "monthlyPaymentsReset");
    monthlyPaymentsReset.innerHTML = 
    '<button type="button" id="monthlyPaymentsReset" onclick="monthlyPaymentsReset()">Reset / Start New Month</button>';

    phone = 19.91;
    spotify = 11;
    amazon = 6.49;
    netflix = 19.29;
    xbox = 0;


    var monthlySubscriptions = document.createElement("div");
    monthlySubscriptions.setAttribute("class", "monthlySubscriptions");
    monthlySubscriptions.innerHTML = "<br><br>RENEWING MONTHLY SUBSCRIPTIONS"
    monthlySubscriptions.innerHTML +=
    "<p>US Mobile: $"+phone+" < 7th</p>" +
    "<p>Spotify: $"+spotify+" < 18th</p>" +
    "<p>Amazon Prime: $"+amazon+" < 18th</p>" +
    "<p>Netflix: $"+netflix+" < 5th</p>" +
    "<p>Xbox Live / Game Pass: $"+xbox+" < 17th</p>" +
    "<br><br>" +
    "Total Monthly costs: $" + Math.round(totalPaymentAmount + phone + spotify + amazon + xbox);
    ;


    //Add all to main container
    mainContainer.appendChild(monthlyPaymentsTitle)
    mainContainer.appendChild(monthlyPaymentsItems);


    mainContainer.appendChild(monthlyPaymentsAdd);
    mainContainer.appendChild(monthlyPaymentsReset);
    mainContainer.appendChild(monthlySubscriptions);
}


function insert(formId) {
    date = document.getElementById("monthlyPaymentsInputDate").value;
    date = date.split("/");
    info = document.getElementById("monthlyPaymentsInputInfo").value;
    amount = document.getElementById("monthlyPaymentsInputAmount").value;
    method = document.getElementById("monthlyPaymentsInputMethod").value;

    myUrl = "/monthlyPayments/"+date[0]+"/"+date[1]+"/"+date[2]+"/"+info+"/"+amount+"/"+method;
    console.log(myUrl);

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


function deleteItem(id) {
    myUrl = "/monthlyPayments/"+id
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


function completeItem(id) {
    myUrl = "completeMonthlyPayments/"+id;
    
    id = "complete-"+id
    currentState = document.getElementById(id).style.backgroundColor;
    nextState = "";
    if (currentState == "green") {
        nextState = "white";
    } else {
        nextState = "green";
    }

    //Send updates to db
    console.log(id);

    $.ajax({
        url: localhostconst + myUrl,
        type: 'PUT',
        success: function(response) {
            console.log(response);
            updateFromDb();
        },
        error: function(error) {
            console.log(error);
        }
    });

    //Update UI 
    document.getElementById(id).style.backgroundColor = nextState;
}

function monthlyPaymentsReset() {
    //Clear all completions (reset/set in stone the new due dates)
    //Need to have paid everything so we can reset and start again with the new dates
    
    //Double check if we want to reset
    if (window.confirm("Are you sure you want to reset & start a new month?")) {
        //If yes do this
        $.ajax({
            url: localhostconst + "resetMonthlyPayments",
            type: 'PUT',
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