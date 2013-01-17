import poplib
import email
from email import parser
from bs4 import BeautifulSoup

# returns the oracle shipping method for the entered shipmethod
def get_ship_code(shipmethod):
    codes = {'Ups Ground':'00-UNASSIGNED,19-UPS GROUND',
             'second day': '00-UNASSIGNED,21-UPS BLUE 2 DAY' ,
             'UPS - NEXT DAY 10:30AM': '00-UNASSIGNED,22-UPS RED 1 DAY' ,
             'next day saver': '00-UNASSIGNED,32-UPS NEXT DAY AIR SAVER' ,
             'LaserShip': 'N920-GA COURIER,N920-GA COURIER',
             'First Class': 'N10-MAIL-FIRST CLASS,N10-MAIL-FIRST CLASS',
             'Pickup': 'N34-PICK UP,N34-PICK UP' }
    if shipmethod in codes:
        return codes[shipmethod]
    else:
        return shipmethod

# returns the timestamp corrected to eastern and drops the year
# maybe add timestamp to order number or something?
def fix_time(timestamp):
    return timestamp

# sets up data load structure
def make_data_load(order):
    # determine if account is a cardianl account
    def is_cardinal(account):
        return account[:3] == "397"

    # find order type for given account number
    def order_type(account):
        types = {'392': 'NASSAU_ATLANTA_LENS_DAILY',
                 '397': 'NASSAU_CARDINAL_LENS_DAILY',
                 '388': 'NASSAU_ATLANTA_LENS_DAILY'}
        if account[:3] in types:
            return types[account[:3]]
        return 'NASSAU_LENS_DAILY'

    # find out if order has contacts
    def has_contacts(order_lines):
        for line in order_lines:
            if len(line[0]) > 10:
                return true
        return False

    # chooes warehouse based on shipmethod and contacts
    def pick_warehouse(order):
        next_day = ['00-UNASSIGNED,22-UPS RED 1 DAY','00-UNASSIGNED,21-UPS BLUE 2 DAY',
                    '00-UNASSIGNED,32-UPS NEXT DAY AIR SAVER', 'N10-MAIL-FIRST CLASS,N10-MAIL-FIRST CLASS']
        if has_contacts(order[4]):
            return 'F01'
        elif order[2] in next_day:
            return 'F01'
        else:
            return 'F06'


    ordstr = ''
    # header stuff here
    ordstr = ordstr + '"*NF","'
        #enter account
    ordstr = ordstr + order[0] + '","*NF","*NF","'
        #tab -> fix order type -> tab
    ordstr = ordstr + order_type(order[0]) + '","*NF","'
        #enter order number -> tab
    ordstr = ordstr + order[1] + '"\n"*NF","'
        #set email field -> click ok
    ordstr = ordstr + '3*ONLINE","\{TAB 11}","YES","*AO"\n'
        #set warehouse
#### IF ORDER IS A CARDINAL ORDER LEAVE SHIPMETHOD AND WAREHOUSE ALONE FOR NOW ##########
    if not is_cardinal(order[0]):
        ###### NEED to use mouse clicks here as tabs and next field are not working for some reason
        ordstr = ordstr + '"*NF","' + pick_warehouse(order) + '","*NF",'
        ordstr = ordstr + '"ML(x,y)","' + order[2] + '",'

    #move cursor to next block (Body)
    ordstr = ordstr + '"*NB"\n'
    # body stuff here
    for line in order[4]:
        ordstr = ordstr + '"' + line[0] + '","*NF","' + line[1] + '","*NF","' + line[2] + '","*AO","\{DOWN}"\n'
        #for all items
            #enter item# -> tab
            #enter qty -> tab
            #enter patient -> click ok
        #save order for later booking
    ordstr = ordstr + '"*SAVE"'
    # return string or text? or write to file?
    return ordstr


# pop3 connection stuff here
emailserver = raw_input('Input mail server: ')
emailuser = raw_input('Input email username: ')
emailpass = raw_input('Input email password: ')

pop_conn = poplib.POP3(emailserver)
pop_conn.user(emailuser)
pop_conn.pass_(emailpass)

#Get messages from server:
messages = [pop_conn.retr(i) for i in range(1, 3)]  #len(pop_conn.list()[1]) + 1)]

# Concat message pieces:
messages = ["\n".join(mssg[1]) for mssg in messages]

# Parse message into an email object:
messages = [parser.Parser().parsestr(mssg) for mssg in messages]


# list of all orders(see below) gathered from the server
allorders = []


for message in messages:

    # an order element with following structure
    # [account, order number, shipping method, order date, [[itemcode, qty, patient]]]
    order = []

    for part in message.walk():

        date = fix_time(part.__getitem__('Date'))
        soup = BeautifulSoup(part.get_payload(None, True))

        acct = soup.find(id="lboacct").get_text()
        ordernumber = soup.find(id="lbinv").get_text()
        shipmethod = get_ship_code(soup.find(id="lbshipmethod").get_text())
        order.append(acct)
        order.append(ordernumber)
        order.append(shipmethod)
        order.append(date)

        grouprow = []
        for tr in soup.find(id="GridView1").find_all("tr"):
            row = []
            for data in tr.find_all("td"):
                row.append(data.get_text())

            if len(row) > 0:
                grouprow.append([row[0],row[1],row[3]])

        order.append(grouprow)
    print order
    print ''
    allorders.append(order)

print make_data_load(allorders[0])
print ''
print make_data_load(allorders[1])

pop_conn.quit()

