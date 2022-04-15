# Config Runtime TS

Package responsible for providing configuration to runtime layers.

Query layer builds some query which can be run against a backend. That mapping from query to backend is taken care of
here.

Model has a mutator which persists to same backend. Query is created and then mapped by this package to the data store.