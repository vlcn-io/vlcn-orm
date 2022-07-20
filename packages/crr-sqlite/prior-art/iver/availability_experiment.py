import sqlite3, os, sys, time, random, time, uuid as myuuid
from faker import Faker
from matplotlib import pyplot as plt
import numpy as np
fake = Faker()

#Number of rows and transaction type to be tested
RUNS = 4
OPERATION = "DELETE"

#Number of rows and updates to perform, one for each run
INITIALROWS = [10000, 20000, 30000, 40000]
NUPDATES    = [10000, 10000, 10000, 10000]


fields = ["first_name", "last_name", "phone", "email"]
rand_vals = [fake.first_name, fake.last_name, fake.phone_number, fake.email]

def sqlFromFile(c, fname):
    sql_file = open(fname)
    sql_string = sql_file.read()
    c.executescript(sql_string)

def main(nRows, nUpdates, operation):

    testconn = sqlite3.connect('test_dbs/at_db.db')
    tc = testconn.cursor()
    sqlFromFile(tc, "users_schema.sql")

    conn = sqlite3.connect('test_dbs/a_db.db')
    c = conn.cursor()

    #Create schemas and setup triggers
    sqlFromFile(c, "users_schema.sql")
    sqlFromFile(c, "crr_users_schema.sql")
    sqlFromFile(c, "lock_tbl_schema.sql")
    sqlFromFile(c, "time_functions.sql")
    sqlFromFile(c, "crr_delete.sql")
    sqlFromFile(c, "crr_insert.sql")
    sqlFromFile(c, "crr_update.sql")

    scripts = []

    uuids = []
    for i in range(nRows):
        uuids.append(myuuid.uuid1().bytes)

    #First: Insert initial rows
    for i in range(nRows):
        first_name = fake.first_name()
        last_name = fake.first_name()
        phone = fake.phone_number()
        email = fake.email()
        tc.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))
        c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))


    for i in range(nUpdates):
        if operation == "UPDATE":
            field_idx = random.randint(0, len(fields)-1)
            uuid = uuids[random.randint(0, len(uuids)-1)]
            query = 'UPDATE users SET ' + fields[field_idx] + ' = "' + rand_vals[field_idx]() + '" WHERE uuid = ?'
            scripts.append((query, (uuid,)))

        elif operation == "DELETE":
            uuid = uuids[random.randint(0, len(uuids)-1)]
            scripts.append(("DELETE FROM users WHERE uuid = ?", (uuid,)))
            uuids.remove(uuid)

        elif operation == "INSERT":
            first_name = fake.first_name()
            last_name = fake.first_name()
            phone = fake.phone_number()
            email = fake.email()
            uuid = myuuid.uuid1().bytes
            scripts.append(("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuid, first_name, last_name, phone, email)))

        elif operation == "SELECT":
            uuid = uuids[random.randint(0, len(uuids)-1)]
            scripts.append(("SELECT * FROM users WHERE uuid = ?", (uuid,)))

        else: return

    #Execute on normal SQLite DB
    t1 = time.process_time() * 1000
    for script in scripts:
        tc.execute(script[0], script[1])
    t2 = time.process_time() * 1000


    #Execute on augemnted DB
    t3 = time.process_time() * 1000
    for script in scripts:
        c.execute(script[0], script[1])
    t4 = time.process_time() * 1000


    conn.close()
    testconn.close()

    return t2-t1, t4-t3

if __name__ == "__main__":

    resultsSQL = []
    resultsCRR = []

    assert(RUNS == len(INITIALROWS) == len(NUPDATES))

    for i in range(RUNS):
        x = 0
        y = 0
        for _ in range(10):
            tmpx, tmpy = main(INITIALROWS[i], NUPDATES[i], OPERATION)
            x += tmpx
            y += tmpy
        resultsSQL.append(x/10)
        resultsCRR.append(y/10)

    # create plot
    fig, ax = plt.subplots()
    index = np.arange(RUNS)
    bar_width = 0.35
    opacity = 0.8

    plt.figure(figsize=(8,5))
    plt.ylabel('Milliseconds')
    plt.xlabel('Number of Rows in Relation')
    plt.title('Time to Perform 10 000 ' + OPERATION + 'S')

    rects1 = plt.bar(index, resultsSQL, bar_width, alpha=opacity, color='b', label='SQL-DB')
    rects2 = plt.bar(index + bar_width, resultsCRR, bar_width, alpha=opacity, color='g', label='CRR SQL-DB')

    plt.xticks(index + bar_width/2, [str(i) for i in INITIALROWS])
    plt.legend()

    plt.tight_layout()
    lbl = "op = " + OPERATION + ", s = " + str(INITIALROWS) + ", u = " + str(NUPDATES)
    plt.savefig('plots/availability_'+ lbl +'.png', bbox_inches='tight')
    plt.show()
