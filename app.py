from flask import Flask, render_template

from tinydb import TinyDB, Query
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from datetime import date
from dateutil.relativedelta import *
import time
import shutil
import os
import csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


#-----------------------------------------------------------------------| POST |
#FinancePage
@app.route('/finance/<table>/<info>/<amount>', methods=['POST'])
def financeInsert(table, info, amount):
    
    amount = float(amount)

    #Add database
    db = TinyDB('static/financeDb.json')

    #Update db
    Key = Query()
    if (db.table(table).search(Key.info == info)):
        return "Error: Duplicate Entry"
    else:
        db.table(table).insert({'info' : info, 'amount' : amount})
        return "200"


#DailyTodoPage
@app.route('/dailyTodo/<table>/<info>', methods=['POST'])
def dailyTodoInsert(table, info):
    
    #Add database
    db = TinyDB('static/dailyTodoDb.json')

    #Get number of current items
    Key = Query()
    todoList = db.table(table).search(Key.id == "todoList")[0]['todoList']

    if (todoList.__contains__([info,0]) | todoList.__contains__([info,1])):
        return "Error: Duplicate Entry"

    todoList.append([info, 0])
    #Update db
    db.table(table).remove(Key.id == "todoList")
    db.table(table).insert({'id' : "todoList", 'todoList' : todoList})

    #Update radio button that was last selected
    db.table("AddSelection").remove(Key.selection != ("radio-"+table))
    db.table("AddSelection").insert({"selection" : "radio-"+table})
    
    return "200"


#OverallTodoPage
@app.route('/overallTodo/<info>', methods=['POST'])
def overallTodoInsert(info):
    
    #Add database
    db = TinyDB('static/overallTodoDb.json')

    #Get number of current items
    Key = Query()
    todoList = db.table("OverallTodo").search(Key.id == "todoList")[0]['todoList']

    if (todoList.__contains__([info,0]) | todoList.__contains__([info,1])):
        return "Error: Duplicate Entry"

    todoList.append([info, 0])
    #Update db
    db.table("OverallTodo").remove(Key.id == "todoList")
    db.table("OverallTodo").insert({'id' : "todoList", 'todoList' : todoList})
        
    return "200"


#MonthlyPaymentsPage
@app.route('/monthlyPayments/<month>/<day>/<year>/<info>/<amount>/<method>', methods=['POST'])
def monthlyPaymentsInsert(month, day, year, info, amount, method):
    
    #Add database
    db = TinyDB('static/monthlyPaymentsDb.json')

    #Get number of current items
    Key = Query()
    paymentsList = db.table("MonthlyPayments").search(Key.id == "paymentsList")[0]['paymentsList']

    #Find a unique key for this entry (assume less than 30 monthly payment entries)
    newKey = -1
    existingKeys = set()
    for item in paymentsList:
        existingKeys.add(item[1])

    for i in range(0,30):
        if (i not in existingKeys):
            newKey = i
            break
    

    date = month+"/"+day+"/"+year
    paymentsList.append([0, newKey, date, info, float(amount), method])
    #Update db
    db.table("MonthlyPayments").remove(Key.id == "paymentsList")
    db.table("MonthlyPayments").insert({'id' : "paymentsList", 'paymentsList' : paymentsList})
        
    return "200"

#-----------------------------------------------------------------------| DELETE |
#FinancePage
@app.route('/finance/<table>/<key>', methods=['DELETE'])
def financeDelete(table, key):
    #Add database
    db = TinyDB('static/financeDb.json')
    Key = Query()
    db.table(table).remove(Key.info == key)
    return "200"


#DailyTodoPage
@app.route('/dailyTodo/<table>/<key>', methods=['DELETE'])
def dailyTodoDelete(table, key):
    #Add database
    db = TinyDB('static/dailyTodoDb.json')
    Key = Query()
    key = int(key)
    #Fetch list and remove
    todoList = db.table(table).search(Key.id == "todoList")[0]['todoList']
    for i in range(0,len(todoList)):
        if (i == key):
            todoList.pop(i)
            break
    
    db.table(table).remove(Key.id == "todoList")
    db.table(table).insert({'id' : "todoList", 'todoList' : todoList})
    return "200"


#OverallTodoPage
@app.route('/overallTodo/<key>', methods=['DELETE'])
def overallTodoDelete(key):
    #Add database
    db = TinyDB('static/overallTodoDb.json')
    Key = Query()
    key = int(key)
    #Fetch list and remove
    todoList = db.table("OverallTodo").search(Key.id == "todoList")[0]['todoList']
    for i in range(0,len(todoList)):
        if (i == key):
            todoList.pop(i)
            break
    
    db.table("OverallTodo").remove(Key.id == "todoList")
    db.table("OverallTodo").insert({'id' : "todoList", 'todoList' : todoList})
    return "200"


#MonthlyPaymentsPage
@app.route('/monthlyPayments/<key>', methods=['DELETE'])
def monthlyPaymentsDelete(key):
    #Add database
    db = TinyDB('static/monthlyPaymentsDb.json')
    Key = Query()
    key = int(key)
    #Fetch list and remove
    paymentsList = db.table("MonthlyPayments").search(Key.id == "paymentsList")[0]['paymentsList']
    for i in range(0,len(paymentsList)):
        if (paymentsList[i][1] == key):
            paymentsList.pop(i)
            break
    
    db.table("MonthlyPayments").remove(Key.id == "paymentsList")
    db.table("MonthlyPayments").insert({'id' : "paymentsList", 'paymentsList' : paymentsList})
    return "200"

#-----------------------------------------------------------------------| PUT |
#DailyTodoPage
@app.route('/dailyTodo/<table>/<direction>/<key>', methods=['PUT'])
def moveDailyTodoItem(table, direction, key):
    #Add database
    db = TinyDB('static/dailyTodoDb.json')
    Key = Query()
    key = int(key)
    #Get and re-arrange list
    todoList = db.table(table).search(Key.id == "todoList")[0]['todoList']
    if (direction == "Up"):
        if (key != 0):
            temp = todoList[key-1]
            todoList[key-1] = todoList[key]
            todoList[key] = temp
    else:
        if (key < len(todoList)-1):
            temp = todoList[key+1]
            todoList[key+1] = todoList[key]
            todoList[key] = temp
    db.table(table).remove(Key.id == "todoList")
    db.table(table).insert({'id' : "todoList", 'todoList' : todoList})
    return "200"


#DailyTodoPage
@app.route('/completeDailyTodo/<table>/<key>', methods=['PUT'])
def completeDailyTodoItem(table, key):
    #Add database
    db = TinyDB('static/dailyTodoDb.json')
    Key = Query()
    key = int(key)
    #Get and re-arrange list
    todoList = db.table(table).search(Key.id == "todoList")[0]['todoList']
    if (todoList[key][1] == 0):
        todoList[key][1] = 1
    else:
        todoList[key][1] = 0
    db.table(table).remove(Key.id == "todoList")
    db.table(table).insert({'id' : "todoList", 'todoList' : todoList})
    return "200"


#OverallTodoPage
@app.route('/overallTodo/<direction>/<key>', methods=['PUT'])
def moveOverallTodoItem(direction, key):
    #Add database
    db = TinyDB('static/overallTodoDb.json')
    Key = Query()
    key = int(key)
    #Get and re-arrange list
    todoList = db.table("OverallTodo").search(Key.id == "todoList")[0]['todoList']    
    if (direction == "Up"):
        if (key != 0):
            temp = todoList[key-1]
            todoList[key-1] = todoList[key]
            todoList[key] = temp
    else:
        if (key < len(todoList)-1):
            temp = todoList[key+1]
            todoList[key+1] = todoList[key]
            todoList[key] = temp
    db.table("OverallTodo").remove(Key.id == "todoList")
    db.table("OverallTodo").insert({'id' : "todoList", 'todoList' : todoList})
    return "200"


#OverallTodoPage
@app.route('/completeOverallTodo/<key>', methods=['PUT'])
def completeOverallTodoItem(key):
    #Add database
    db = TinyDB('static/overallTodoDb.json')
    Key = Query()
    key = int(key)
    #Get and re-arrange list
    todoList = db.table("OverallTodo").search(Key.id == "todoList")[0]['todoList']
    if (todoList[key][1] == 0):
        todoList[key][1] = 1
    else:
        todoList[key][1] = 0
    db.table("OverallTodo").remove(Key.id == "todoList")
    db.table("OverallTodo").insert({'id' : "todoList", 'todoList' : todoList})
    return "200"


#MonthlyPaymentsPage
@app.route('/completeMonthlyPayments/<key>', methods=['PUT'])
def completeMonthlyPaymentsItem(key):
    #Add database
    db = TinyDB('static/monthlyPaymentsDb.json')
    Key = Query()
    key = int(key)
    #Get and re-arrange list
    paymentsList = db.table("MonthlyPayments").search(Key.id == "paymentsList")[0]['paymentsList']
    
    #Change key from meaning (unique key) to the index in the payments list pointing to the intended payment
    for i in range(0,len(paymentsList)):
        if (paymentsList[i][1] == key):
            key = i
            break

    currentDate = paymentsList[key][2].split("/")
    currentDate = date(month=int(currentDate[0]), day=int(currentDate[1]), year=int(currentDate[2]))
    time.mktime(currentDate.timetuple())

    if (paymentsList[key][0] == 0):
        paymentsList[key][0] = 1
        paymentsList[key][2] = currentDate+relativedelta(months=+1)
        curr = paymentsList[key][2]
        paymentsList[key][2] = str(curr.month) + "/" + str(curr.day) + "/" + str(curr.year)
    else:
        paymentsList[key][0] = 0
        paymentsList[key][2] = currentDate+relativedelta(months=-1)
        curr = paymentsList[key][2]
        paymentsList[key][2] = str(curr.month) + "/" + str(curr.day) + "/" + str(curr.year)    

    db.table("MonthlyPayments").remove(Key.id == "paymentsList")
    db.table("MonthlyPayments").insert({'id' : "paymentsList", 'paymentsList' : paymentsList})
    return "200"

#MonthlyPaymentsPage
@app.route('/resetMonthlyPayments', methods=['PUT'])
def resetMonthlyPayments():
    #Add database
    db = TinyDB('static/monthlyPaymentsDb.json')
    Key = Query()
    #Get and reset first index of every entry
    paymentsList = db.table("MonthlyPayments").search(Key.id == "paymentsList")[0]['paymentsList']
    for item in paymentsList:
        item[0] = 0

    db.table("MonthlyPayments").remove(Key.id == "paymentsList")
    db.table("MonthlyPayments").insert({'id' : "paymentsList", 'paymentsList' : paymentsList})
    return "200"

#-----------------------------------------------------------------------| GET |
#FinancePage
@app.route('/fetchBalance/<item1>/<item2>', methods=['GET'])
def fetchBoABalance(item1, item2):

    #Delete existing savings data
    db = TinyDB('static/financeDb.json')
    db.table('Spending').remove(all)

    # #Change download location
    # chrome_options = webdriver.ChromeOptions()
    # prefs = {'download.default_directory' : "/Users/danielkoenigsperger/Documents/PersonalFinanceProject", "safebrowsing.enabled":"false"}
    # chrome_options.add_experimental_option('prefs', prefs)

    # browser = webdriver.Chrome('./chromedriver', chrome_options=chrome_options)
    # browser.maximize_window()

    # browser.get("https://www.bankofamerica.com/")

    # #Enter Username
    # username = browser.find_element_by_name("onlineId1")
    # username.send_keys(item1)
    # #Wait
    # time.sleep(0.5)
    # #Enter Password
    # password = browser.find_element_by_name("passcode1")
    # password.send_keys(item2)
    # #Hit Enter
    # time.sleep(0.5)
    # password.send_keys(Keys.RETURN)

    # #Entering Checking Account
    # browser.find_element_by_name("DDA_details").click()
    # time.sleep(0.5)
    # #Entering Download Menu
    # browser.find_element_by_name('download_transactions_top').click()
    # time.sleep(0.5)
    # #Select CSV file type
    # browser.find_element_by_id("select_filetype").click()
    # browser.find_element_by_name("download_file_in_this_format_CSV").click()
    # time.sleep(0.5)
    # #Set Custom Date Range
    # browser.find_element_by_id("cust-date").click()
    # time.sleep(0.5)
    # startDateBox = browser.find_element_by_id("start-date")
    # startDateBox.send_keys('06/01/2021')
    # time.sleep(0.5)
    # endDateBox = browser.find_element_by_id("end-date")
    # endDateBox.send_keys('07/02/2021')
    # time.sleep(0.5)
    # #Confirm download
    # browser.find_element_by_link_text("Download transactions").click()
    # time.sleep(0.5)
    # #Wait for file to download
    # time.sleep(5)



    #Parse csv and update 'Spending' table in db
    file_to_open = 'stmt.csv'


    #Process
    checkingBalance = 0.00
    with open(file_to_open, 'r') as this_csv_file:
        this_csv_reader = csv.reader(this_csv_file, delimiter=",")
    
        for i in range(4):
            header = next(this_csv_reader)

        totalDebits = header[2]
        print("Total Debits: $" + totalDebits)
        header = next(this_csv_reader)
        checkingBalance = header[2]
        print("Checking Balance: $" + checkingBalance)

        listOfDebits = []

        i=0
        for row in this_csv_reader:
            if (i>2):
                if (float(row[2]) < 0.00):
                    listOfDebits.append([row[0], row[1], float(row[2])])
            i+=1
    
    #Insert into db
    db = TinyDB('static/financeDb.json')
    for debit in reversed(listOfDebits):
        info = debit[0] + " - " + debit[1]
        db.table("Spending").insert({'info' : info, 'amount' : debit[2]})

    #Delete statement
    #os.remove("stmt.csv")


    #Todo
    #-Get local jquery
    # -Clear Spending db every time
    #-Creat new db table for general info
    #-Uncomment removing stmt.csv

    return "200"




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)




    #Change download location in Chrome
    #Change download to overwrite files with same name (may need extension)
    #Install everything on raspberry pi
    #Encrypt password
    #Add a 'update database & data' button/backend
    #Make UI nicer
    #Figure out an exact use case from login until data display that I will want
        #Login once a week to update my data
        #See all monthly costs in one table
        #See all variable high costs in another (gas, groceries)
        #See all random costs per day ordered by smallest to largest (food, drinks)
        #See progress bar to see how much of my weekly/monthly allocation I have spent