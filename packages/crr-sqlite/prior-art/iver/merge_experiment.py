import sqlite3, os, sys, time, random, time, uuid as myuuid
from faker import Faker
from matplotlib import pyplot as plt
import numpy as np
fake = Faker()

RUNS = 4
INITIALROWS = [10000, 20000, 30000, 40000]

fields = ["first_name", "last_name", "phone", "email"]
rand_vals = [fake.first_name, fake.last_name, fake.phone_number, fake.email]

def sqlFromFile(c, fname):
    sql_file = open(fname)
    sql_string = sql_file.read()
    c.executescript(sql_string)

def main(nRows):

    conn1 = sqlite3.connect('test_dbs/a_db1.db')
    c1 = conn1.cursor()

    #Create schemas and setup triggers
    sqlFromFile(c1, "users_schema.sql")
    sqlFromFile(c1, "crr_users_schema.sql")
    sqlFromFile(c1, "lock_tbl_schema.sql")
    sqlFromFile(c1, "time_functions.sql")
    sqlFromFile(c1, "crr_delete.sql")
    sqlFromFile(c1, "crr_insert.sql")
    sqlFromFile(c1, "crr_update.sql")

    conn2 = sqlite3.connect('test_dbs/a_db2.db')
    c2 = conn2.cursor()

    #Create schemas and setup triggers
    sqlFromFile(c2, "users_schema.sql")
    sqlFromFile(c2, "crr_users_schema.sql")
    sqlFromFile(c2, "lock_tbl_schema.sql")
    sqlFromFile(c2, "time_functions.sql")
    sqlFromFile(c2, "crr_delete.sql")
    sqlFromFile(c2, "crr_insert.sql")
    sqlFromFile(c2, "crr_update.sql")

    #Attach database objects, important to commit afterwards
    c1.execute("ATTACH DATABASE 'test_dbs/a_db1.db' as 'db1';")
    c1.execute("ATTACH DATABASE 'test_dbs/a_db2.db' as 'db2';")
    c2.execute("ATTACH DATABASE 'test_dbs/a_db2.db' as 'db1';")
    c2.execute("ATTACH DATABASE 'test_dbs/a_db1.db' as 'db2';")

    uuids = []
    for i in range(nRows):
        uuids.append(myuuid.uuid1().bytes)

    #First: Insert initial rows
    for i in range(nRows):
        first_name = fake.first_name()
        last_name = fake.first_name()
        phone = fake.phone_number()
        email = fake.email()
        c1.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))

    for i in range(nRows):
        first_name = fake.first_name()
        last_name = fake.first_name()
        phone = fake.phone_number()
        email = fake.email()
        c2.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))

    conn1.commit()
    conn2.commit()

    #Execute on augemnted DB
    t1 = time.process_time() * 1000
    sqlFromFile(c1, "crr_merge.sql")
    t2 = time.process_time() * 1000

    conn1.commit()
    conn2.commit()
    conn1.close()
    conn2.close()

    return t2-t1

if __name__ == "__main__":

    results = []

    for i in range(RUNS):
        x = 0
        y = 0
        for _ in range(10):
            tmpx = main(INITIALROWS[i])
            x += tmpx
        results.append(x/10)


    # create plot
    plt.figure(figsize=(8,5))
    plt.ylabel('Milliseconds')
    plt.xlabel('Number of Rows in Relation')
    plt.title('Time to Merge two Relations')

    x_pos = [i for i, _ in enumerate(results)]

    plt.bar(x_pos, results, color='green')
    plt.xticks(x_pos, INITIALROWS)

    for index, value in enumerate(results):
        plt.text(index, value, str(int(value)), ha='center')

    lbl = "op = MERGE, s = " + str(INITIALROWS)
    plt.savefig('plots/availability2_'+ lbl +'.png', bbox_inches='tight')
    plt.show()
