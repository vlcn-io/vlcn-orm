Runs with python3.7+ with one external dependency: Faker
	>>> pip install faker
	OR
  	>>> pip3 install faker
To run:
	>>> python3 test.py

Look in .py files for details on how tests and experiments are performed


SQL-FILES - These files are used by the tests and experiments as the CRR SQL implementation. Represents a normal DB to catalog users
================================================================================
users_schema.sql: 		Schema and initialization for AR-layer.
crr_users_schema.sql: Schema and initialization for CRR-layer.
time_functions.sql:		Emulation of nano-second timestamps using only SQL.
crr_delete.sql: 			Deletion triggers on user table.
crr_insert.sql:				Insertion triggers on user table.
crr_update.sql:				Update triggers on user table.
crr_merge.sql:				Merge script that merges two local user/crr_user tables.
lock_tbl_schema.sql:	Functionality to selectively disable triggers during a merge.


TESTS - Tests correctness of two-layer CRR and merge behavior.
================================================================================
test.py: 			Tests that the AR and CRR layer communicate properly.
mergetest.py: Tests that merge functions properly.


EXPERIMENTS - Can vary inputs in top of .py files, automatically generates graphs. Experiments are local simulations of a network of database with user-tables using CRR.
================================================================================
consistency_experiment1.py: Measures consistency and periodically does a full merge.
consistency_experiment2.py: Measures consistency and periodically does a partial merge on another node chosen at random.
merge_experiment.py:				Merges relations and measure performance, size can be adjusted in files.
availability_experiment.py:	Measures availability as latency on a given type of transaction, compares a regular SQLite DB vs a Two-layer approach.


IC_PT - Integrity Constraints Prototype
================================================================================
IC_PT/crr_merge.sql: 	Now merges 3 two-layer relations that reference each other.
IC_PT/~.sql: 					New tables and triggers for a, b and c tables.
IC_PT/IC_test.py:			Performs some simple test to see how Prototype handles Integrity Constraints, assure that it meets expected behavior.
