import sqlite3, os, sys, time, SQLUserFuncs, uuid
from faker import Faker
fake = Faker()

def sqlFromFile(c, fname):
    sql_file = open(fname)
    sql_string = sql_file.read()
    c.executescript(sql_string)

def testCrr(c):
    #Generate some UUIDs for later:
    uuids = []
    for i in range (100):
        uuids.append(uuid.uuid1().bytes)



    #First: Test inertion of new rows
    for i in range(100):
        c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuids[i], fake.first_name(), fake.last_name(), fake.phone_number(), fake.email()))


    #ensure rows are added in ar and cr layer
    c.execute("SELECT * FROM users")
    assert len(c.fetchall()) == 100

    c.connection.commit()

    c.execute("SELECT * FROM crr_users")
    assert len(c.fetchall()) == 100

    #Second: Test deletion of existing rows
    for i in range(20):
        c.execute("DELETE FROM users WHERE uuid=?", (uuids[i],))

    #ensure cl is updated in crr layer
    c.execute("SELECT * FROM crr_users WHERE crr_cl=2")
    for id, row in zip(uuids, c.fetchall()):
        assert id == row[0]

    #ensure rows are deleted in ar layer
    c.execute("SELECT * FROM users")
    assert len(c.fetchall()) == 80


    #Third: Test deletion of deleted rows
    for id, _ in zip(uuids, range(10)):
        c.execute("DELETE FROM users WHERE uuid=?", (id,))

    #ensure cl is not updates
    c.execute("SELECT * FROM crr_users WHERE crr_cl=2")
    assert len(c.fetchall()) == 20

    #ensure rows are deleted in ar layer
    c.execute("SELECT * FROM users")
    assert len(c.fetchall()) == 80


    #Third: Test deletion of non-existing rows
    for _ in range(10):
        c.execute("DELETE FROM users WHERE uuid=?", (uuid.uuid1().bytes,))

    #ensure nothing has changed
    c.execute("SELECT * FROM crr_users WHERE crr_cl=2")
    assert len(c.fetchall()) == 20
    c.execute("SELECT * FROM users")
    assert len(c.fetchall()) == 80

    #First: Test inertion of new rows
    for id, _ in zip(uuids, range(20)):
        c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (id, fake.first_name(), fake.last_name(), fake.phone_number(), fake.email()))

    #ensure the re-added nodes have cl=3
    c.execute("SELECT * FROM crr_users WHERE crr_cl=3")
    assert len(c.fetchall()) == 20
    #ensure all rows exists in cr layer again
    c.execute("SELECT * FROM users")
    for row in c.fetchall():
        assert row[0] in uuids

    #update test ensure that only one field is edited and that time is updated in crr:layer

    c.execute("SELECT email, crr_email FROM crr_users WHERE uuid = ?", (uuids[0],))
    old_email = c.fetchall()
    c.execute("SELECT uuid, first_name, crr_first_name, last_name, crr_last_name, phone, crr_phone, crr_cl FROM crr_users WHERE uuid = ?", (uuids[0],))
    old_other = c.fetchall()

    c.execute("UPDATE users SET email = 'test@foo.foo' WHERE uuid = ?", (uuids[0],))

    #Make sure timestamp is greater and attribute is changed correctly
    c.execute("SELECT email, crr_email FROM crr_users WHERE uuid = ?", (uuids[0],))
    new_email = c.fetchall()
    assert new_email[0] != old_email[0]
    assert new_email[0][0] == "test@foo.foo"
    assert new_email[0][1] > old_email[0][1]

    c.execute("SELECT email FROM users WHERE uuid = ?", (uuids[0],))
    user_email = c.fetchall()
    assert user_email[0][0] == "test@foo.foo"

    #Make sure update has no side effect for other attributes
    c.execute("SELECT uuid, first_name, crr_first_name, last_name, crr_last_name, phone, crr_phone, crr_cl FROM crr_users WHERE uuid = ?", (uuids[0],))
    new_other = c.fetchall()
    assert new_other == old_other


    print("ALL TESTS PASSED")

def main():
    conn1 = sqlite3.connect('test.db')
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

    #Test functionality
    testCrr(c1)

    # Save (commit) the changes:
    conn1.commit()
    conn1.close()




if __name__ == "__main__":
   main()
