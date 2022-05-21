var localhostconst = "http://0.0.0.0:5000/";

//Initial db fetch
updateFromDb();


function updateFromDb() {
    fetch('/static/dailyTodoDb.json')
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

    //--- #1 --- Todo items
    var dailyTodoItems = document.createElement("div");
    dailyTodoItems.setAttribute("class", "dailyTodoItems");


    //#1.1 - Morning
    var dailyTodoItemsTitleMorning = document.createElement("div");
    dailyTodoItemsTitleMorning.setAttribute("class", "dailyTodoItemsTitleMorning");
    dailyTodoItemsTitleMorning.innerHTML = "MORNING";

    var dailyTodoItemsMorning = document.createElement("div");
    dailyTodoItemsMorning.setAttribute("class", "dailyTodoItemsMorning");
    
    //Load todos from db
    todos = data.Morning["1"].todoList;
    for (var i=0;i<todos.length;i++){
        //Set complete color
        completeColor = "";
        if (todos[i][1] == 0) {
            completeColor = "white";
        } else {
            completeColor = "green";
        }
        dailyTodoItemsMorning.innerHTML += 
        "<div>" +
        "&nbsp<button class='moveButtons completeTodoButton' id='Morning-" + i + "'" +
        "type='button' onclick='completeItem(this.id)'><img style='background-color:" + completeColor + "' id='complete-Morning-" + i + "' src='/static/doneButton.png'/></button>" +
        
        todos[i][0] +

        "&nbsp<button class='moveButtons' id=" + "'Morning-Up-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/upButton.png'/></button>" +

        "&nbsp<button class='moveButtons' id=" + "'Morning-Down-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/downButton.png'/></button>" +

        "&nbsp<button class='moveButtons deleteTodoButton' id=" + "'Morning-" + i + "'" +
        "type='button' onclick='deleteItem(this.id)'><img src='/static/deleteButton.png'/></button>" +
        "<div class='todoDivider'></div>" +
        "</div>";


    }



    //#1.2 - Day
    var dailyTodoItemsTitleDay = document.createElement("div");
    dailyTodoItemsTitleDay.setAttribute("class", "dailyTodoItemsTitleDay");
    dailyTodoItemsTitleDay.innerHTML = "DAY";

    var dailyTodoItemsDay = document.createElement("div");
    dailyTodoItemsDay.setAttribute("class", "dailyTodoItemsDay");
    
    //Load todos from db
    todos = data.Day["1"].todoList;
    for (var i=0;i<todos.length;i++){
        //Set complete color
        completeColor = "";
        if (todos[i][1] == 0) {
            completeColor = "white";
        } else {
            completeColor = "green";
        }

        dailyTodoItemsDay.innerHTML += 
        "<div>" +
        "&nbsp<button class='moveButtons completeTodoButton' id='Day-" + i + "'" +
        "type='button' onclick='completeItem(this.id)'><img style='background-color:" + completeColor + "' id='complete-Day-" + i + "' src='/static/doneButton.png'/></button>" +
        
        todos[i][0] +

        "&nbsp<button class='moveButtons' id=" + "'Day-Up-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/upButton.png'/></button>" +

        "&nbsp<button class='moveButtons' id=" + "'Day-Down-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/downButton.png'/></button>" +

        "&nbsp<button class='moveButtons deleteTodoButton' id=" + "'Day-" + i + "'" +
        "type='button' onclick='deleteItem(this.id)'><img src='/static/deleteButton.png'/></button>" +
        "<div class='todoDivider'></div>" +
        "</div>";
    }

    //#1.3 - Evening
    var dailyTodoItemsTitleEvening = document.createElement("div");
    dailyTodoItemsTitleEvening.setAttribute("class", "dailyTodoItemsTitleEvening");
    dailyTodoItemsTitleEvening.innerHTML = "EVENING";

    var dailyTodoItemsEvening = document.createElement("div");
    dailyTodoItemsEvening.setAttribute("class", "dailyTodoItemsEvening");
    
    //Load todos from db
    todos = data.Evening["1"].todoList;
    for (var i=0;i<todos.length;i++){
        //Set complete color
        completeColor = "";
        if (todos[i][1] == 0) {
            completeColor = "white";
        } else {
            completeColor = "green";
        }

        dailyTodoItemsEvening.innerHTML += 
        "<div>" +
        "&nbsp<button class='moveButtons completeTodoButton' id='Evening-" + i + "'" +
        "type='button' onclick='completeItem(this.id)'><img style='background-color:" + completeColor + "' id='complete-Evening-" + i + "' src='/static/doneButton.png'/></button>" +
        
        todos[i][0] +

        "&nbsp<button class='moveButtons' id=" + "'Evening-Up-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/upButton.png'/></button>" +

        "<button class='moveButtons' id=" + "'Evening-Down-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/downButton.png'/></button>" +

        "<button class='moveButtons deleteTodoButton' id=" + "'Evening-" + i + "'" +
        "type='button' onclick='deleteItem(this.id)'><img src='/static/deleteButton.png'/></button>" +
        "<div class='todoDivider'></div>" +
        "</div>";
    }

    
    //--- #2 --- Add new todo item
    var dailyTodoAdd = document.createElement("div");
    dailyTodoAdd.setAttribute("class", "dailyTodoAdd");

    dailyTodoAdd.innerHTML = 
    '<div class="selectBox"><input type="radio" id="radio-Morning" onclick="radioSwitch(this.id)">Morning</div>' +
    '<div class="selectBox"><input type="radio" id="radio-Day" onclick="radioSwitch(this.id)">Day</div>' +
    '<div class="selectBox"><input type="radio" id="radio-Evening" onclick="radioSwitch(this.id)">Evening</div>' +
    '<br>' +
    '<input type="text" id="dailyTodoInput" value="todo item"><button type="button" id="dailyTodoButton" onclick="insert()">Add</button></form>';
    



    //Add all to main container
    dailyTodoItems.appendChild(dailyTodoItemsTitleMorning)
    dailyTodoItems.appendChild(dailyTodoItemsMorning);

    dailyTodoItems.appendChild(dailyTodoItemsTitleDay);
    dailyTodoItems.appendChild(dailyTodoItemsDay);
    
    dailyTodoItems.appendChild(dailyTodoItemsTitleEvening)
    dailyTodoItems.appendChild(dailyTodoItemsEvening);

    mainContainer.appendChild(dailyTodoItems);


    mainContainer.appendChild(dailyTodoAdd);
    //Initialize radio button
    console.log(data.AddSelection["1"].selection);
    document.getElementById(data.AddSelection["1"].selection).checked = true;


    //Todo
    //-finish todo interface
    //-allow mark for completion (turns green)
    //-allow cross to delete
    //-have up and down arrows to allow moving within category up or down...
    //-each todo item is stored as { priority : "item"}
    //-get everything out into dictionary and then sort according to key
    //-put in labels to show more specific time (e.g. for morning, wake up -> start work)
}


function insert(formId) {

    var table = "";

    if (document.getElementById("radio-Morning").checked) { //Morning
        table = "Morning";
    } else if (document.getElementById("radio-Day").checked) { //Day
        table = "Day";
    } else { //Evening
        table = "Evening";
    }

    info = document.getElementById("dailyTodoInput").value;

    
    myUrl = "/dailyTodo/" + table + "/" + info;

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
    data = id.split('-');
    myUrl = "/dailyTodo/"+data[0]+"/"+data[1]
    console.log(myUrl);

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

function moveItem(id) {
    data = id.split('-');
    myUrl = "/dailyTodo/"+data[0]+"/"+data[1]+"/"+data[2]
    console.log(myUrl);

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
}

function completeItem(id) {
    data = id.split('-');
    myUrl = "completeDailyTodo/"+data[0]+"/"+data[1];
    id = "complete-" + id;

    currentState = document.getElementById(id).style.backgroundColor;
    nextState = "";
    if (currentState == "green") {
        nextState = "white";
    } else {
        nextState = "green";
    }

    //Send updates to db
    console.log(myUrl);

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

    //Make changes in UI
    document.getElementById(id).style.backgroundColor = nextState;
}

function radioSwitch(id) {
    morning = false;
    day = false;
    evening = false;

    if (id == "radio-Morning") {
        morning = true;
    } else if (id == "radio-Day") {
        day = true;
    } else {
        evening = true;
    }

    document.getElementById("radio-Morning").checked = morning;
    document.getElementById("radio-Day").checked = day;
    document.getElementById("radio-Evening").checked = evening;
}