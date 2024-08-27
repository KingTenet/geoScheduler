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

## Tech Stack

- NextJS for web frontend and API routes
- tRPC for end-to-end typesafe APIs
- Prisma as the ORM for database operations
- TypeScript for type-safe development
- Tailwind CSS and Radix UI for styling and components
- esbuild for compiling the daemon application

## Current Implementation Status

- Basic web UI implemented for creating and managing geo-schedules
- tRPC API routes set up for CRUD operations on schedules and user data
- Prisma database schema defined with models for User, GeoScheduleConfig, AppsToBlock, etc.
- Initial structure for MacOS daemon with OAuth setup
- Basic authentication system in place

## Next Steps

1. Complete the MacOS daemon implementation
2. Enhance the web UI for a more user-friendly experience
3. Implement offline functionality for both daemon and web app
4. Finalize authentication and security measures
5. Implement the managed script library feature
6. Add comprehensive error handling and logging
7. Develop unit and integration tests

## Getting Started

(Instructions for setting up the development environment, running the application, and contributing to the project will be added here.)

## License

(License information will be added here.)

## Contact

(Contact information or links will be added here.)
