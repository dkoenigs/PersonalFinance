//Initial tab
switchTabs("monthlyPayments");


function switchTabs(newTab){

    //Remove old page script
    var currentTab = document.getElementById("currentTab"); 
    document.getElementById("currentTab").innerHTML = "";

    //Insert new page script
    var script = document.createElement('script');
    script.setAttribute("id", newTab);
    script.src = "/static/" + newTab + "Page.js";
    currentTab.appendChild(script);

    //Update active tab theme
    var pages = ["finance", "dailyTodo", "calendar", "monthlyPayments", "friendsNetworking", "overallTodo"];
    for (let i = 0; i < pages.length; i++) {
        if (pages[i] == newTab) {
            document.getElementById(pages[i]).style.backgroundColor = "rgb(127, 193, 255)";
            document.getElementById(pages[i]).style.color = "black";
            document.getElementById(pages[i]).style.border = "1px solid black";
        } else {
            document.getElementById(pages[i]).style.backgroundColor = "black";
            document.getElementById(pages[i]).style.color = "white";
            document.getElementById(pages[i]).style.border = "none";
        }
    }
    
    
}


/*
Todo

Bugs
- Input checking, allows and fails on '/'


Summary Tab
- Create new tab that lists: any upcoming monthly payments | finance balance (& last synced date) | friends past due | current chunk of daily todo

Overall Todo
- Overall Todo require 1-10 severity, 1-10 time and calculate an overall importance score that initially orders (and is displayed in info)

Calendar
- Sync personal outlook calendar

Friend&Networking
- Couple different tabs
- Just name for personal, short what we did last, last contacted/hung out (over limit will turn red)
- Professional contacts, same, Name, email, short what we did last, last contacted/hung out (over limit will turn red)

Monthly Payments
- 'Due Date | Who I need to pay | How much | Weblink to portal, info on what to do'
- 'Shows days remaining till due'
- 'Color turns red if it's due within 5 days'
- 'Complete mark removes color, resets timer to one month from now and moves item to the bottom of the list'
*/