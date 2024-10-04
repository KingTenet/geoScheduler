# GeoScheduler Action Creation and Execution

## Overview

The GeoScheduler system uses two primary concepts: GeoSchedule configurations and Actions. GeoSchedules are templates that define when and where certain apps should be blocked. Actions are specific instances of app blocking derived from these templates.

## Action Creation Process

1. **On-Demand Creation**: Actions are created when the daemon requests the latest actions. This is a periodic process initiated by the daemon.

2. **Time Window**: The creation process considers a three-week window, spanning from one week in the past to two weeks in the future from the current date. This allows for immediate execution of newly created GeoSchedules and handles configurations spanning across midnight.

3. **Pure Function Generation**: Actions are generated using a pure function `fn:createActionsFromGeoScheduleConfig` that takes this time window as an argument. This function produces a set of actions based on the current GeoSchedule configurations.

4. **Recurrence Patterns**:

   - Currently, the system supports daily recurrence.
   - There are plans to implement weekly recurrence, allowing for more flexible day selection.

5. **Start and End Times**:

   - GeoSchedule start and end times are stored as minutes past midnight.
   - This allows for configurations where the end time is earlier than the start time (spanning across midnight).
   - For schedules spanning midnight, one action is created, keyed off the start date and geoscheduleConfigId.
   - Actions can be created and potentially executed immediately upon GeoSchedule creation, even if the start time is earlier in the current day.

6. **Deduplication**:

   - Existing actions are pulled from the database.
   - Only new actions (those that don't already exist) are attempted to be written to the database.
   - The database schema includes a unique constraint on the `col:fromDate` and `col:geoscheduleConfigId` columns of the action table, preventing duplicates.

7. **Time Zone Handling**: All times are stored in UTC and converted to local time when needed.

## Action Execution

1. **Polling**: The daemon continuously polls the database for actions to execute.

2. **Execution Determination**:

   - The daemon determines execution based on the action's end date.
   - If the end date is in the past, the action won't be executed.
   - If the end date is in the future, it's scheduled for execution, potentially immediately if the start date is in the past.

3. **Parallel Execution**: Multiple active actions are executed in parallel by the daemon.

4. **Location Monitoring**: A separate location provider updates actions when their location criteria have been met.

5. **Status Reporting**: The daemon reports back the execution status of actions. This information is used to:
   - Filter subsequent daemon requests for actions
   - Determine when deleted geoschedules and associated actions can be removed

## GeoSchedule Updates and Action Management

1. When a user updates a GeoSchedule, a new GeoSchedule is created with the updated configuration.

2. The old GeoSchedule is marked with:

   - A deletion started date `col:deleteStartedDate`
   - `col:deletionStatus` = `WAITING_FOR_CLIENT`

3. When an action is created, it checks if its associated geoschedule has been deleted or updated (indicated by a `col:deleteStartedDate`).

4. The maximum commitment period for a geoschedule config is 1 week `col:updateDelaySeconds` - this indicates how long after deletion or modification, a geoschedule config will continue to be respected. It can be thought of as the system not getting the message that the user wanted to delete or change their settings until after the commitment delay.

5. The `shouldBeExecuted` function determines if an action should be executed based on the `col:deleteStartedDate` and `col:updateDelaySeconds` and `col:updateDelayType`.

## Cleanup Process

1. Actions with start dates more than two weeks old are completely removed from the database.

2. This cleanup process does not overlap with the action creation window, which spans from one week in the past to two weeks in the future.

## Future Considerations

1. Implement weekly recurrence pattern support.
2. Consider the impact of daylight saving time changes on recurring schedules.
3. Optimize the deduplication process, potentially by implementing a "create if not exists" functionality in the database layer.
