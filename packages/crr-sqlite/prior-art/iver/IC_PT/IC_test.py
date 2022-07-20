import sqlite3, os, sys, time, uuid, random
from faker import Faker
fake = Faker()

fields = ["first_name", "last_name", "phone", "email"]
rand_vals = [fake.first_name, fake.last_name, fake.phone_number, fake.email]
c1_deleted_rows = []
c2_deleted_rows = []

def myComp(list1, list2):
  section = list(set(list1).intersection(list2))
  return ((len(section)>0))

#Ensure correct behaviour of CRR and AR layer
def assertCrr(c1, c2):
    tmp1 = c1.execute("SELECT * FROM crr_a WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c1.execute("SELECT * FROM a").fetchall()
    assert len(tmp1) == len(tmp2)
    tmp1 = c1.execute("SELECT * FROM crr_b WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c1.execute("SELECT * FROM b").fetchall()
    assert len(tmp1) == len(tmp2)
    tmp1 = c1.execute("SELECT * FROM crr_b WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c1.execute("SELECT * FROM b").fetchall()
    assert len(tmp1) == len(tmp2)

    tmp1 = c2.execute("SELECT * FROM crr_a WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c2.execute("SELECT * FROM a").fetchall()
    assert len(tmp1) == len(tmp2)
    tmp1 = c2.execute("SELECT * FROM crr_b WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c2.execute("SELECT * FROM b").fetchall()
    assert len(tmp1) == len(tmp2)
    tmp1 = c2.execute("SELECT * FROM crr_b WHERE (crr_cl%2)=1").fetchall()
    tmp2 = c2.execute("SELECT * FROM b").fetchall()
    assert len(tmp1) == len(tmp2)


def sqlFromFile(c, fname):
    sql_file = open(fname)
    sql_string = sql_file.read()
    c.executescript(sql_string)

def testCrr(c1, c2, conn1, conn2):
    #Generate some UUIDs for later:
    uuids_a = []
    for i in range (100):
        uuids_a.append(uuid.uuid1().bytes)

    uuids_b = []
    for i in range (100):
        uuids_b.append(uuid.uuid1().bytes)

    uuids_c = []
    for i in range (100):
        uuids_c.append(uuid.uuid1().bytes)

    #First: Test inertion of new rows with null values
    for i in range(100):
        c1.execute("INSERT INTO a VALUES (?, ?)", (uuids_a[i], None))
        c2.execute("INSERT INTO a VALUES (?, ?)", (uuids_a[i], None))
    for i in range(100):
        c1.execute("INSERT INTO b VALUES (?, ?)", (uuids_b[i], None))
        c2.execute("INSERT INTO b VALUES (?, ?)", (uuids_b[i], None))
    for i in range(100):
        c1.execute("INSERT INTO c VALUES (?, ?)", (uuids_c[i], None))
        c2.execute("INSERT INTO c VALUES (?, ?)", (uuids_c[i], None))

    assertCrr(c1, c2)


    #Second: Give REFERENCES to a
    for i in range(100):
        c1.execute("UPDATE a SET b = ? WHERE uuid = ?", (uuids_b[i], uuids_a[i]))
        c1.execute("UPDATE b SET c = ? WHERE uuid = ?", (uuids_c[i], uuids_b[i]))
        c1.execute("UPDATE c SET a = ? WHERE uuid = ?", (uuids_a[i], uuids_c[i]))

    assertCrr(c1, c2)

    conn1.commit()
    conn2.commit()
    #Merge updates into c2
    sqlFromFile(c2, "crr_merge.sql")

    conn1.commit()
    conn2.commit()


    #Lets cause some integrety constraints on merge
    #reset to NULL for simplicity

    for i in range(100):
        c1.execute("UPDATE a SET b = ? WHERE uuid = ?", (None, uuids_a[i]))
        c1.execute("UPDATE b SET c = ? WHERE uuid = ?", (None, uuids_b[i]))
        c1.execute("UPDATE c SET a = ? WHERE uuid = ?", (None, uuids_c[i]))
        c2.execute("UPDATE a SET b = ? WHERE uuid = ?", (None, uuids_a[i]))
        c2.execute("UPDATE b SET c = ? WHERE uuid = ?", (None, uuids_b[i]))
        c2.execute("UPDATE c SET a = ? WHERE uuid = ?", (None, uuids_c[i]))

    assertCrr(c1, c2)

    #Make some references to a row in node 1
    for i in range(10):
        c1.execute("UPDATE a SET b = ? WHERE uuid = ?", (uuids_b[50], uuids_a[i]))

    #delete row in other node
    c2.execute("DELETE FROM b WHERE uuid = ?", (uuids_b[50],))

    assertCrr(c1, c2)

    conn1.commit()
    conn2.commit()
    #Merge updates into c2
    sqlFromFile(c1, "crr_merge.sql")
    sqlFromFile(c2, "crr_merge.sql")
    conn1.commit()
    conn2.commit()

    #Make sure that deletion has been undone and applied the same in both layers:
    row = c1.execute("SELECT * FROM b WHERE uuid = ?", (uuids_b[50],)).fetchall()
    assert len(row) == 1
    row = c2.execute("SELECT * FROM b WHERE uuid = ?", (uuids_b[50],)).fetchall()
    assert len(row) == 1

    #Reference constraints type 2: Undoing update (Basically the same but the order is different)
    c1.execute("DELETE FROM b WHERE uuid = ?", (uuids_b[60],))

    #Make some references to deleted row in node 1
    for i in range(10):
        c2.execute("UPDATE a SET b = ? WHERE uuid = ?", (uuids_b[60], uuids_a[i]))

    assertCrr(c1, c2)

    conn1.commit()
    conn2.commit()
    #Merge updates into c2
    sqlFromFile(c1, "crr_merge.sql")
    sqlFromFile(c2, "crr_merge.sql")
    conn1.commit()
    conn2.commit()

    row = c1.execute("SELECT * FROM a WHERE b = ?", (uuids_b[50],)).fetchall()
    assert len(row) == 10
    row = c2.execute("SELECT * FROM a WHERE b = ?", (uuids_b[50],)).fetchall()
    assert len(row) == 10


def main():

    conn1 = sqlite3.connect('test_1.db')
    c1 = conn1.cursor()


    #Create schemas and setup triggers
    sqlFromFile(c1, "abc_schema.sql")
    sqlFromFile(c1, "crr_abc_schema.sql")
    sqlFromFile(c1, "lock_tbl_schema.sql")
    sqlFromFile(c1, "time_functions.sql")
    sqlFromFile(c1, "crr_delete.sql")
    sqlFromFile(c1, "crr_insert.sql")
    sqlFromFile(c1, "crr_update.sql")


    #Create second db to test merge
    conn2 = sqlite3.connect('test_2.db')
    c2 = conn2.cursor()


    #Create schemas and setup triggers
    sqlFromFile(c2, "abc_schema.sql")
    sqlFromFile(c2, "crr_abc_schema.sql")
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

    # Test:
    testCrr(c1, c2, conn1, conn2)


    # Save (commit) the changes:
    conn1.commit()
    conn2.commit()
    conn1.close()
    conn2.close()


if __name__ == "__main__":
   main()
