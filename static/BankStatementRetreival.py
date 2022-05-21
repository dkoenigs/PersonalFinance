
# make necessary imports
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from datetime import date
import time
import shutil
import os


def downloadStatement(usernameSent, passwordSent, dateStart, dateEnd):
    browser = webdriver.Chrome('/Users/danielkoenigsperger/documents/PersonalFinanceProject/chromedriver')
    browser.maximize_window()
    browser.get("https://www.bankofamerica.com/")

    #Enter Username
    username = browser.find_element_by_name("onlineId1")
    username.send_keys(usernameSent)
    #Wait
    time.sleep(2)
    #Enter Password
    password = browser.find_element_by_name("passcode1")
    password.send_keys(passwordSent)
    #Hit Enter
    password.send_keys(Keys.RETURN)

    #Entering Checking Account
    browser.find_element_by_name("DDA_details").click()

    #Entering Download Menu
    browser.find_element_by_name('download_transactions_top').click()

    #Set Custom Date Range
    browser.find_element_by_id("cust-date").click()

    startDateBox = browser.find_element_by_id("start-date")
    startDateBox.send_keys(dateStart)

    endDateBox = browser.find_element_by_id("end-date")
    endDateBox.send_keys(dateEnd)

    #Select CSV file type
    browser.find_element_by_id("select_filetype").click()
    browser.find_element_by_name("download_file_in_this_format_CSV").click()

    #Confirm download
    browser.find_element_by_link_text("Download transactions").click()

    #Wait for file to download
    time.sleep(5)

    print("Statement Downloaded")
  

def moveFile():
    try:
        shutil.move("/Users/danielkoenigsperger/Downloads/stmt.csv", "./stmt.csv")
    except: #If we already have a statement overwrite it
        os.replace("/Users/danielkoenigsperger/Downloads/stmt.csv", "./stmt.csv")
    

  
def main():
    #usernameSent = input("username: ")
    #passwordSent = input("password: ")
    usernameSent = "d"
    passwordSent = "k"
    #dateStart = input("date start: ")
    #dateEnd = input("date end: ")
    dateStart = "01/01/2021"
    dateEnd = date.today().strftime("%m/%d/%Y")

    #Download Statement
    downloadStatement(usernameSent, passwordSent, dateStart, dateEnd)
    #Move statement to correct folder
    moveFile()
    print("File Downloaded Successfully.")




if __name__ == "__main__":
    main()