import Database from "better-sqlite3";

const db = new Database("database/nextUp.db", { verbose: console.log });

const tableQuery = db.prepare(`
    CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    student_name TEXT,
    student_id TEXT,
    ticket_code INTEGER,
    active BOOLEAN,
    identification BOOLEAN,
    rf BOOLEAN,
    grades BOOLEAN,
    dismissal BOOLEAN,
    other TEXT
    )
    `);

tableQuery.run();
db.close();
