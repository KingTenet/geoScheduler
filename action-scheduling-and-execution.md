# GeoScheduler Action scheduling and execution

## Overview

Action scheduling takes place on the daemon. It will periodically pull actions from the backend API, as per the other markdown document (TODO add link). The daemon will utilise 3 components to acheive action scheduling and a further component to handle syncronisation action state with the backend. These are:

1. A local database, daemonDB - this will persist all actions pulled from the backend. So the backend is the source of truth for action configuration, specifically id, fromDate, toDate, shouldBeExecuted and appNames (as derived from `fn:transformActionFromDB`). Whilst the local daemonDB is the source of truth for `executionStatus`.

2. A scheduler - this may well be built on the `bree` library. This component will allow a script to be executed upon a schedule, as such it will be used to execute actions via scripts. It will also monitor execution state, eg. queued, running, completed, failed and update th database upon state change.
   - Action scripts - each type of action will have an associated script.

### Process flow

1. Upon daemon process startup assume no actions running and therefore assume DB may be inconsistent (`STARTED` actions are not running)

   - update where `executionStatus` = `STARTED`
     - if `endDate` in past, set `executionStatus` = `WONT_FINISH`
     - else set `executionStatus` = `NULL`

1. Pull new actions and update DB

   - add all new actions to daemonDB
   - pull to get local state, actions with truthy `shouldBeExecuted` and:
     - if `executionStatus` = `NULL`, set `executionStatus` = `WONT_START` (**AVOID SCHEDULER RACE:** Ensure DB update is conditional on `executionStatus`=`NULL`)
     - if `executionStatus` = `STARTED`, attempt to stop action, set `executionStatus` = `WONT_FINISH` if successfully stopped, else do nothing
     - if `executionStatus` is (`WONT_START` or `WONT_FINISH` or `FINISHED` or `FAILED`) do nothing
     - Add all actions to scheduler if `executionStatus`=`NULL`

1. Upon scheduler event, if `executionStatus` = `NULL` and:

   - if `endDate` in future, set `executionStatus`=`STARTED` and start action script, onError, set `executionStatus`=`FAILED`
   - if `endDate` in past update `executionStatus` = `WONT_START`

1. Periodically run, step 2.

Expected behaviours and features

1. If daemon stops and restarts, it should be able to get back into the same state as before (eg. with actions that were running, continuing to run by restarting their associated scripts)
2.
