import sqlite3, time


#
#
# This file contains user defined functions used by CRR.
# While good for testing, a 'C' solution might be considered for final
# project.
#
#

def _getNanoTime():
    return time.time_ns()


def initUF(conn):
    conn.create_function("TIME_NS", 0, _getNanoTime)
