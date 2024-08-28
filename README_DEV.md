# PostgreSQL Database Management

This README provides useful commands for managing your PostgreSQL database using the `psql` command-line tool.

## Connecting to the Database

Connect to your database:

psql -h hostname -U username -d database_name

Replace `hostname`, `username`, and `database_name` with your specific details.

## Basic psql Commands

- \l: List all databases
- \c database_name: Connect to a specific database
- \dt: List all tables in the current database
- \d table_name: Describe the structure of a specific table
- \du: List all users and their roles
- \q: Quit psql
- \c @GeoScheduler

## Querying Tables

1. Select all records from a table:
   SELECT \* FROM table_name;

2. Select specific columns:
   SELECT column1, column2 FROM table_name;

3. Filter results:
   SELECT \* FROM table_name WHERE condition;

## Clearing Tables

1. Delete all records from a table:
   DELETE FROM table_name;

2. Truncate a table (faster than DELETE, resets auto-increment):
   TRUNCATE TABLE table_name;

3. Drop a table (removes the table structure):
   DROP TABLE table_name;

## Useful Queries

1. Count records in a table:
   SELECT COUNT(\*) FROM table_name;

2. Get the first 10 records:
   SELECT \* FROM table_name LIMIT 10;

3. Order records:
   SELECT \* FROM table_name ORDER BY column_name DESC;

4. Group and aggregate data:
   SELECT column1, COUNT(\*) FROM table_name GROUP BY column1;

Remember to end your SQL commands with a semicolon (;) when using psql.

## Exporting and Importing Data

1. Export a table to a CSV file:
   \copy (SELECT \* FROM table_name) TO '/path/to/file.csv' WITH CSV HEADER;

2. Import data from a CSV file:
   \copy table_name FROM '/path/to/file.csv' WITH CSV HEADER;

Always be cautious when deleting or modifying data. It's recommended to have regular backups of your database.
