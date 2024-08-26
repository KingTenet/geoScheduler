# TaskGeo: Time and Location-Based Task Scheduler for MacOS

## Overview

TaskGeo is a sophisticated task automation system for MacOS that allows users to schedule and execute tasks based on both time and geographical constraints. It combines the power of traditional time-based scheduling with location-aware triggering, offering users a flexible and powerful tool for task management.

## Key Features

1. **Time and Location-Based Scheduling**: Schedule tasks to run at specific times when certain geographical conditions are met.

2. **Managed Script Library**: Execute pre-approved scripts stored in a secure, managed library.

3. **Web-Based User Interface**: Configure tasks, schedules, and location triggers through an intuitive web interface.

4. **Recurring Task Patterns**: Set up daily or weekly recurring tasks with customizable start and end dates.

5. **Commitment-Bound Cyclical Tasks**: Lock recurring tasks for a specified period, preventing modifications.

6. **Offline Functionality**: Continue operations even when network connectivity is unavailable.

7. **Mobile Device Support**: Use mobile devices as location beacons to trigger tasks.

## System Architecture

TaskGeo consists of three main components:

1. **MacOS Daemon**: Executes scheduled tasks on the user's MacOS device.
2. **Web Frontend**: Provides the user interface for task configuration and management.
3. **Backend Service**: Manages schedules, user authentication, and coordinates between the daemon and web frontend.

## Technical Details

- **Time Zone**: All scheduling is done in GMT for consistency.
- **Geofencing**: Location constraints are defined by latitude, longitude, and radius.
- **Communication**: The daemon uses a pull model with HTTP GET requests and a tRPC interface.
- **Offline Support**: The daemon caches up to one week of schedules for offline operation.
- **Data Privacy**: Location data is not stored long-term; only temporary geotrigger states are maintained.

## Getting Started

(Instructions for installation and initial setup would go here)

## Usage

(Basic usage instructions and examples would go here)

## Security

TaskGeo prioritizes security through:

- End-to-end user authentication
- Restricted script execution from a managed library
- Secure communication between components

## Limitations

- Currently supports only circular geofences
- Limited to MacOS for task execution
- Requires GMT for all time-based scheduling

## Future Enhancements

While not part of the current MVP, future versions may include:

- Enhanced error handling and reporting
- Audit trails for task executions
- Performance optimizations for simultaneous task execution
- Extended geofencing shapes
- Integration with third-party services

## Contributing

(Information about how to contribute to the project would go here)

## License

(License information would go here)

## Contact

(Contact information or links would go here)
