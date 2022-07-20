import sqlite3, os, sys, time, SQLUserFuncs, uuid, random
from faker import Faker
fake = Faker()

fields = ["first_name", "last_name", "phone", "email"]
rand_vals = [fake.first_name, fake.last_name, fake.phone_number, fake.email]
c1_deleted_rows = []
c2_deleted_rows = []

def myComp(list1, list2):
  section = list(set(list1).intersection(list2))
  return ((len(section)>0))

#Make sure all rows in CRR-layer with even cl exists in AR-layer
def assertCrr(c1, c2):
    tmp1 = c1.execute("SELECT * FROM crr_users WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c1.execute("SELECT * FROM users").fetchall()
    assert len(tmp1) == len(tmp2)
    tmp1 = c2.execute("SELECT * FROM crr_users WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c2.execute("SELECT * FROM users").fetchall()
    assert len(tmp1) == len(tmp2)

def compareTables(c1, c2, tc):
    c1_rows = c1.execute("SELECT * FROM users").fetchall()
    c2_rows = c2.execute("SELECT * FROM users").fetchall()
    controll_rows = tc.execute("SELECT * FROM users").fetchall()

    i = 0
    #Iterate through lists of table rows and assert that theyre contaied in comparison table
    for rowx, rowy in zip(c1_rows, c2_rows):
        if myComp([rowx], controll_rows) & myComp([rowy], controll_rows):
            i+=1

    print("Numrows crr:" +str(len(c1_rows)) + " & " + str(len(c2_rows)))
    print("Num rows controll:" + str(len(controll_rows)))

    print("Matching rows: " + str(i))


def sqlFromFile(c, fname):
    sql_file = open(fname)
    sql_string = sql_file.read()
    c.executescript(sql_string)

def doChaosUpdate(c1, c2, tc, uuids):
    update_type = random.randint(1,3)
    tbl_to_update = random.randint(1,2)

    #UPDATE random field
    if update_type == 1:
        field_idx = random.randint(0, len(fields)-1)
        uuid = uuids[random.randint(0, len(uuids)-1)]
        query = 'UPDATE users SET ' + fields[field_idx] + ' = "' + rand_vals[field_idx]() + '" WHERE uuid = ?'
        if tbl_to_update == 1:
            c1.execute(query, (uuid,))
        if tbl_to_update == 2:
            c2.execute(query, (uuid,))
        tc.execute(query, (uuid,))

    #DELETE RANDOM ROW
    if update_type == 2:
        uuid = uuids[random.randint(0, len(uuids)-1)]
        if tbl_to_update == 1:
            if uuid in c1_deleted_rows:
                return
            c1.execute("DELETE FROM users WHERE uuid = ?", (uuid,))
            c1_deleted_rows.append(uuid)
        if tbl_to_update == 2:
            if uuid in c2_deleted_rows:
                return
            c2.execute("DELETE FROM users WHERE uuid = ?", (uuid,))
            c2_deleted_rows.append(uuid)

        tc.execute("DELETE FROM users WHERE uuid = ?", (uuid,))

    #INSERT RANDOM DELETED ROW
    if update_type == 3:

        first_name = fake.first_name()
        last_name = fake.first_name()
        phone = fake.phone_number()
        email = fake.email()
        if tbl_to_update == 1:
            if len(c1_deleted_rows) == 0:
                return
            uuid = c1_deleted_rows[random.randint(0, len(c1_deleted_rows)-1)]
            c1.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuid, first_name, last_name, phone, email))
            c1_deleted_rows.remove(uuid)

        if tbl_to_update == 2:
            if len(c2_deleted_rows) == 0:
                return
            uuid = c2_deleted_rows[random.randint(0, len(c2_deleted_rows)-1)]
            c2.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuid, first_name, last_name, phone, email))
            c2_deleted_rows.remove(uuid)

        if uuid in c2_deleted_rows:
            c2_deleted_rows.remove(uuid)
        if uuid in c1_deleted_rows:
            c1_deleted_rows.remove(uuid)

        tc.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuid, first_name, last_name, phone, email))


def main():
    testconn = sqlite3.connect('test_3.db')
    tc = testconn.cursor()
    sqlFromFile(tc, "users_schema.sql")


    conn1 = sqlite3.connect('test_1.db')
    c1 = conn1.cursor()

    #Initialize user functions
    SQLUserFuncs.initUF(conn1)

    #Create schemas and setup triggers
    sqlFromFile(c1, "users_schema.sql")
    sqlFromFile(c1, "crr_users_schema.sql")
    sqlFromFile(c1, "lock_tbl_schema.sql")
    sqlFromFile(c1, "time_functions.sql")
    sqlFromFile(c1, "crr_delete.sql")
    sqlFromFile(c1, "crr_insert.sql")
    sqlFromFile(c1, "crr_update.sql")


    #Create second db to test merge
    conn2 = sqlite3.connect('test_2.db')
    c2 = conn2.cursor()


    #Initialize user functions
    SQLUserFuncs.initUF(conn2)

    #Create schemas and setup triggers
    sqlFromFile(c2, "users_schema.sql")
    sqlFromFile(c2, "crr_users_schema.sql")
    sqlFromFile(c2, "lock_tbl_schema.sql")
    sqlFromFile(c2, "time_functions.sql")
    sqlFromFile(c2, "crr_delete.sql")
    sqlFromFile(c2, "crr_insert.sql")
    sqlFromFile(c2, "crr_update.sql")

    #Attach database objects, important to commit afterwards
    c1.execute("ATTACH DATABASE 'test_1.db' as 'db1';")
    c1.execute("ATTACH DATABASE 'test_2.db' as 'db2';")
    c2.execute("ATTACH DATABASE 'test_2.db' as 'db1';")
    c2.execute("ATTACH DATABASE 'test_1.db' as 'db2';")

    conn1.commit()
    conn2.commit()

    #Generate some UUIDs for later:
    uuids = []
    for i in range (200):
        uuids.append(uuid.uuid1().bytes)

    #First: Test inertion of new rows
    for i in range(200):
        first_name = fake.first_name()
        last_name = fake.first_name()
        phone = fake.phone_number()
        email = fake.email()
        #insert into t1 as correctness reference
        tc.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))
        tbl_to_update = random.randint(1,2)
        if tbl_to_update == 1:
            c1.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))
        if tbl_to_update == 2:
            c2.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], first_name, last_name, phone, email))


    #Commit both connections, by default the execute script function will commit before executing a script,
    #however there is now two connections and cursors and execute script only coppits the one calling the method.
    #To ensure that the merge can happen, we must also perform a commit on the other connection (c2 in this case).
    #If we dont there will be a Lock Error as 'c2' has uncommited instructions while being read from/written to.
    conn1.commit()
    conn2.commit()
    testconn.commit()

    #Do merge
    sqlFromFile(c1, "crr_merge.sql")
    sqlFromFile(c2, "crr_merge.sql")

    #Assert that the tables are equal
    compareTables(c1, c2, tc)

    #Do some randomized insertions, deletions and updates
    for _ in range(5000):
        doChaosUpdate(c1, c2, tc, uuids)

    conn1.commit()
    conn2.commit()
    testconn.commit()

    #Assert that crr rules are in place after chaos updates
    assertCrr(c1, c2)

    #Do merge
    sqlFromFile(c1, "crr_merge.sql")
    sqlFromFile(c2, "crr_merge.sql")

    assertCrr(c1, c2)

    #Assert that the tables are equal
    compareTables(c1, c2, tc)

    # Save (commit) the changes:
    conn1.commit()
    conn2.commit()
    testconn.commit()
    conn1.close()
    conn2.close()
    testconn.close()




if __name__ == "__main__":
   main()
