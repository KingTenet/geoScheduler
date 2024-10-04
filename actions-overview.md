# GeoScheduler Action Creation, Scheduling, and Execution

## Overview

This document outlines the process of creating, scheduling, and executing actions in the GeoScheduler system. It covers the lifecycle of actions from their creation based on GeoSchedule configurations to their execution by the daemon.

## Key Concepts

- **GeoSchedule**: A template defining when and where certain apps should be blocked.
- **Action**: A specific instance of app blocking derived from a GeoSchedule.
- **Daemon**: The component responsible for executing scheduled actions on the user's device.

## Action Creation Process

### Time Window

- Actions are created for a three-week window:
  - One week in the past
  - Current date
  - Two weeks in the future
- Rationale: Covers recently completed actions and future actions beyond the maximum commitment period.

### Creation Trigger

- Actions are created when the daemon requests the latest actions from the backend API.
- This is a periodic process initiated by the daemon.

### Creation Logic

1. Existing actions are pulled from the database.
2. New actions are generated using the pure function `fn:createActionsFromGeoScheduleConfig`.
3. Only new actions (those that don't already exist) are written to the database.

### Action Properties

- Start and end times (stored in UTC)
- Associated apps to block
- Unique constraint: `col:fromDate` and `col:geoscheduleConfigId`

### Special Cases

- Schedules spanning midnight: One action is created, keyed off the start date.
- Actions can be created and potentially executed immediately upon GeoSchedule creation.

### Recurrence Patterns

- Currently supports daily recurrence.
- Plans for weekly recurrence in the future.

## Action Scheduling and Execution

### Daemon Responsibilities

1. Periodically pull actions from the backend API.
2. Update the local database (daemonDB) with new actions.
3. Schedule and execute actions based on their properties.

### Execution Determination

- Based on the action's end date:
  - If in the past: Won't be executed.
  - If in the future: Scheduled for execution (potentially immediately if the start date is in the past).

### Execution Process

1. Daemon checks the `shouldBeExecuted` flag for each action.
2. If true, the action is executed at the scheduled time.
3. Multiple active actions are executed in parallel.

### Commitment Period

- Defined by `updateDelaySeconds` in the GeoSchedule configuration.
- Determines the `deletionDateThreshold` for each action.
- Once past this threshold, an action cannot be prevented from executing.

### Action States

- `WONT_START`: For actions with end dates in the past.
- `STARTED`: When an action begins execution.
- `WONT_FINISH`: If an action is stopped before completion.
- `FINISHED`: Successfully completed actions.
- `FAILED`: Actions that encountered errors during execution.

## Schedule Modifications and Action Management

### Modifying GeoSchedules

1. A new GeoSchedule is created with updated configuration.
2. The old GeoSchedule is marked with:
   - `col:deleteStartedDate`
   - `col:deletionStatus` = `WAITING_FOR_CLIENT`

### Handling Existing Actions

- Actions within the commitment period are not affected.
- New actions are created for the updated schedule.
- This may result in overlapping actions during the commitment period.

### Conflict Resolution

- Blocking takes precedence in overlapping schedules.
- Overlaps result in a union of blocking periods.

## Time Zone and Daylight Saving Time Handling

- All times are stored and processed in UTC.
- Actions execute at the configured UTC time.
- Local execution time may shift by one hour after daylight saving changes.

## Performance and Scalability

- Current design assumes users have a limited number of GeoSchedules.
- No specific optimizations for large numbers of actions per user.
- Consider monitoring database performance as the user base grows.

## Future Considerations

- Implementing weekly recurrence patterns.
- Potential for more granular recurrence (monthly, yearly).
- Enhancing user notifications for commitment periods and time changes.
- Implementing comprehensive logging for troubleshooting.

## Conclusion

This system provides a robust method for creating, scheduling, and executing actions based on user-defined GeoSchedules. It handles various edge cases, enforces user commitments, and manages schedule modifications effectively. As the system evolves, consider user experience enhancements and performance optimizations to support a growing user base and more complex scheduling needs.
