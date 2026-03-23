import Database from "better-sqlite3";

const db = new Database("database/nextUp.db", { verbose: console.log });

function addTransaction(data) {
  const query = db.prepare(`
    INSERT INTO transactions (
      student_name,
      student_id,
      ticket_code,
      active,
      identification,
      rf,
      grades,
      dismissal,
      other
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  query.run(
    data.name,
    data.id,
    data.code,
    1,
    data.identification ? 1 : 0,
    data.rf ? 1 : 0,
    data.grades ? 1 : 0,
    data.dismissal ? 1 : 0,
    typeof data.other === "string" ? data.other : "",
  );
}

function getTransactions() {
  const query = db
    .prepare(`SELECT * FROM transactions WHERE active = 1 ORDER BY id ASC`)
    .all();
  return query;
}

function deactivateTransaction(code) {
  const query = db.prepare(`
    UPDATE transactions SET active = 0 WHERE ticket_code = ?
    `);
  query.run(code);
}

function checkActiveCode(code) {
  const query = db.prepare(`
    SELECT * FROM transactions WHERE ticket_code = ? AND ACTIVE = 1
    `);
  return query.get(code);
}

export {
  getTransactions,
  addTransaction,
  deactivateTransaction,
  checkActiveCode,
};
