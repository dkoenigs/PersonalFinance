var localhostconst = "http://0.0.0.0:5000/";

//Initial db fetch
updateFromDb();


function updateFromDb() {
    fetch('/static/overallTodoDb.json')
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

    var overallTodoItemsTitle= document.createElement("div");
    overallTodoItemsTitle.setAttribute("class", "overallTodoItemsTitle");
    overallTodoItemsTitle.innerHTML = "OVERALL TODO";

    var overallTodoItems = document.createElement("div");
    overallTodoItems.setAttribute("class", "overallTodoItems");
    
    //Load todos from db
    todos = data.OverallTodo["1"].todoList;
    for (var i=0;i<todos.length;i++){
        //Set complete color
        completeColor = "";
        if (todos[i][1] == 0) {
            completeColor = "white";
        } else {
            completeColor = "green";
        }
        overallTodoItems.innerHTML += 
        "<div>" +
        "&nbsp<button class='moveButtons completeTodoButton' id='" + i + "'" +
        "type='button' onclick='completeItem(this.id)'><img style='background-color:" + completeColor + "' id='complete-" + i + "' src='/static/doneButton.png'/></button>" +
        
        todos[i][0] +

        "&nbsp<button class='moveButtons' id=" + "'Up-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/upButton.png'/></button>" +

        "&nbsp<button class='moveButtons' id=" + "'Down-" + i + "'" +
        "type='button' onclick='moveItem(this.id)'><img src='/static/downButton.png'/></button>" +

        "&nbsp<button class='moveButtons deleteTodoButton' id='" + i + "'" +
        "type='button' onclick='deleteItem(this.id)'><img src='/static/deleteButton.png'/></button>" +
        "<div class='todoDivider'></div>" +
        "</div>";


    }

    
    //--- #2 --- Add new todo item
    var overallTodoAdd = document.createElement("div");
    overallTodoAdd.setAttribute("class", "overallTodoAdd");

    overallTodoAdd.innerHTML = 
    '<br>' +
    '<input type="text" id="overallTodoInput" value="todo item"><button type="button" id="overallTodoButton" onclick="insert()">Add</button></form>';
    



    //Add all to main container
    mainContainer.appendChild(overallTodoItemsTitle)
    mainContainer.appendChild(overallTodoItems);


    mainContainer.appendChild(overallTodoAdd);
}


function insert(formId) {
    info = document.getElementById("overallTodoInput").value;
    myUrl = "/overallTodo/" + info;

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
    myUrl = "/overallTodo/"+id
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
    myUrl = "/overallTodo/"+data[0]+"/"+data[1]

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
    myUrl = "completeOverallTodo/"+id;
    
    id = "complete-"+id
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

    //Update UI 
    document.getElementById(id).style.backgroundColor = nextState;
}