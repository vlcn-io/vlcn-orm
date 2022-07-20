import sqlite3, os, sys, time, SQLUserFuncs, uuid, random
from faker import Faker
from matplotlib import pyplot as plt
import numpy as np
fake = Faker()

fields = ["first_name", "last_name", "phone", "email"]
rand_vals = [fake.first_name, fake.last_name, fake.phone_number, fake.email]

#Number of runs and updates to perform each run
TOTALUPDATES = 1000
RUNS = 2


#One list element per RUN
INITIALROWS = [200, 200]
MERGEINTERVAL = [50, 100]
NUMNODES = [5, 5]

#Flag of whether to plot Client Consistency and best fit
PLOTCC = False
BESTFIT = True

def myComp(list1, list2):
    section = list(set(list1) - set(list2))
    return (section)

def myIntersection(list1, list2):
    section = list(set(list1) & set(list2))
    return (section)


def compareDC(c_node, nodes):
    #Measures data consistecy
    inconsistent_rows = []

    #mege all tables into controll_db
    c_node.mergeAll()
    controll_rows = c_node.selectAll()

    #Get all rows from all nodes
    for node in nodes:
        rows = node.selectAll()
        i_rows = myComp(controll_rows, rows)
        for row in i_rows:
            inconsistent_rows.append(row)

    return len(myComp(controll_rows, inconsistent_rows)) / len(controll_rows)

def compareCC(c_node, nodes, numNodes):
    #Measures client consistecy

    #merge all tables into controll_db
    c_node.mergeAll()
    controll_rows = c_node.selectAll()

    total = 0.0
    #Get all rows from all nodes
    for node in nodes:
        rows = node.selectAll()
        total += len(myIntersection(controll_rows, rows)) / len(rows)

    return total / numNodes



def sqlFromFile(c, fname):
    sql_file = open(fname)
    sql_string = sql_file.read()
    c.executescript(sql_string)

class TestNode():
    def __init__(self, databases, id, db_name, uuids, mode):

        self.name = db_name
        self.databases = databases
        self.id = id
        self.conn = sqlite3.connect(self.name)
        self.c = self.conn.cursor()

        #Initialize user functions
        SQLUserFuncs.initUF(self.conn)

        #Create schemas and setup triggers
        sqlFromFile(self.c, "users_schema.sql")
        sqlFromFile(self.c, "crr_users_schema.sql")
        sqlFromFile(self.c, "lock_tbl_schema.sql")
        sqlFromFile(self.c, "time_functions.sql")
        sqlFromFile(self.c, "crr_delete.sql")
        sqlFromFile(self.c, "crr_insert.sql")
        sqlFromFile(self.c, "crr_update.sql")

        #Attach self as db 1
        self.c.execute("ATTACH DATABASE '"+self.name+"' as 'db1';")
        self.conn.commit()

        #Generate some UUIDs for later:
        self.uuids = uuids
        self.deleted_rows = []

        if mode == True:
            #First: Test inertion of new rows
            for uuid in self.uuids:
                first_name = fake.first_name()
                last_name = fake.first_name()
                phone = fake.phone_number()
                email = fake.email()
                self.c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuid, first_name, last_name, phone, email))

        self.conn.commit()

    def mergeAll(self):

        #Does a merge-pull from all other databases
        for db in self.databases:
            if db != self.name:
                #We do some attach/detach shuffeling, to since merge function is currently a little limited
                self.c.execute("ATTACH DATABASE '"+db+"' as 'db2';")
                self.conn.commit()
                sqlFromFile(self.c, "crr_merge.sql")

                self.c.execute("DETACH DATABASE 'db2';")
                self.conn.commit()

        tmp = self.c.execute("SELECT uuid FROM crr_users WHERE (crr_cl%2)=0").fetchall()
        self.deleted_rows = [i[0] for i in tmp]

    def doChaosUpdate(self):
        update_type = random.randint(1,3)

        #UPDATE random field
        if update_type == 1:
            field_idx = random.randint(0, len(fields)-1)
            uuid = self.uuids[random.randint(0, len(self.uuids)-1)]
            query = 'UPDATE users SET ' + fields[field_idx] + ' = "' + rand_vals[field_idx]() + '" WHERE uuid = ?'
            self.c.execute(query, (uuid,))

        #DELETE RANDOM ROW
        if update_type == 2:
            uuid = self.uuids[random.randint(0, len(self.uuids)-1)]
            if uuid in self.deleted_rows:
                return
            else:
                self.c.execute("DELETE FROM users WHERE uuid = ?", (uuid,))
                self.deleted_rows.append(uuid)

        #INSERT RANDOM DELETED ROW
        if update_type == 3:
            if len(self.deleted_rows) == 0:
                return

            first_name = fake.first_name()
            last_name = fake.first_name()
            phone = fake.phone_number()
            email = fake.email()

            uuid = self.deleted_rows[random.randint(0, len(self.deleted_rows)-1)]
            self.c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?)", (uuid, first_name, last_name, phone, email))
            self.deleted_rows.remove(uuid)

        self.conn.commit()

    def close(self):
        self.conn.commit()
        self.conn.close()

    def assertCrr(self):
        tmp1 = self.c.execute("SELECT * FROM crr_users WHERE (crr_cl%2)=1").fetchall()
        tmp2 = self.c.execute("SELECT * FROM users").fetchall()
        assert len(tmp1) == len(tmp2)

    def selectAll(self):
        return self.c.execute("SELECT * FROM users").fetchall()


def main(initialRows, numNodes, mergeInterval):

    datacon_x = []
    datacon_y = []
    clientcon_x = []
    clientcon_y = []

    #Initialization:
    #Generate some UUIDs for later:
    uuids = []
    for i in range (initialRows):
        uuids.append(uuid.uuid1().bytes)

    db_names = []
    for i  in range(1, numNodes+1):
        db_names.append("test_dbs/db_"+str(i))

    #list of database nodes
    db_nodes = []
    for i  in range(1, numNodes+1):
        db_nodes.append(TestNode(db_names, i, db_names[i-1], uuids, True))

    c_node = TestNode(db_names, 0, "test_dbs/controll_db", uuids, False)

    #Final step of Initialization, merge all databases so they are the same at start of experiments
    for node in db_nodes:
        node.mergeAll()
    c_node.mergeAll()


    #Start randomized updates
    for i in range(TOTALUPDATES):
        j = random.randint(0,numNodes-1)
        db_nodes[j].doChaosUpdate()

        if mergeInterval != 0:
            if i%mergeInterval == 0:
                for node in db_nodes:
                    node.mergeAll()

        if i%10 == 0:
            datacon_y.append(compareDC(c_node, db_nodes))
            datacon_x.append(i)
            clientcon_y.append(compareCC(c_node, db_nodes, numNodes))
            clientcon_x.append(i)



    for node in db_nodes:
        node.mergeAll()
    for node in db_nodes:
        node.assertCrr()
    c_node.close()
    for node in db_nodes:
        node.close()


    lbl = "Data Consistency: n = " + str(numNodes) + ", s = " + str(initialRows) + ", i = " + str(mergeInterval)
    plt.plot(datacon_x, datacon_y, label = lbl)

    if PLOTCC:
        lbl = "Client Consistency: n = " + str(numNodes) + ", s = " + str(initialRows) + ", i = " + str(mergeInterval)
        plt.plot(clientcon_x, clientcon_y, label = lbl)

    if BESTFIT:
        lbl = "DC Best Fit: n = " + str(numNodes) + ", s = " + str(initialRows) + ", i = " + str(mergeInterval)
        x = np.array(datacon_x)
        y = np.array(datacon_y)

        m, b = np.polyfit(x, y, 1)
        plt.plot(x, m*x + b, label = lbl)

        if PLOTCC:
            lbl = "CC Best Fit: n = " + str(numNodes) + ", s = " + str(initialRows) + ", i = " + str(mergeInterval)
            x = np.array(clientcon_x)
            y = np.array(clientcon_y)

            m, b = np.polyfit(x, y, 1)
            plt.plot(x, m*x + b, label = lbl)




if __name__ == "__main__":

    assert(RUNS == len(INITIALROWS) == len(NUMNODES) == len(MERGEINTERVAL))

    plt.figure(figsize=(11,7))
    plt.ylabel('Consistency')
    plt.xlabel('Number of SQL transactions')

    for i in range(RUNS):
        main(INITIALROWS[i], NUMNODES[i], MERGEINTERVAL[i])


    lbl = "n = " + str(NUMNODES) + ", s = " + str(INITIALROWS) + ", i = " + str(MERGEINTERVAL)
    plt.legend()
    plt.savefig('plots/consistency_'+ lbl +'.png', bbox_inches='tight')
    plt.show()
