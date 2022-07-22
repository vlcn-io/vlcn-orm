/**
 * Figures out what perf hit we take for:
 * - inserts
 * - updates
 * - deletes
 * - reads
 *
 * When using the CRR enabled schema vs a non-CRR schema.
 */

// insert N rows one at a time.
// insert N row en masse
// update N rows
// delete N rows
// merge N rows
// do N reads

/*
App...

todomvc app
but w/ p2p connection
on which we merge and push changes

simpler demo?
just sqlite console with merge commands?

Create auto migration script instead of app.
*/
