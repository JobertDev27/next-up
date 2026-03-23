import Express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { SerialPort, ReadlineParser } from "serialport";
import {
  checkActiveCode,
  addTransaction,
  getTransactions,
  deactivateTransaction,
} from "./database/database.js";

const app = Express();
const server = createServer(app);
const io = new Server(server);

app.use(Express.json());

const port = new SerialPort({
  path: "/dev/ttyUSB0",
  baudRate: 9600,
  autoOpen: false,
});

let codes = [];

io.on("connection", (socket) => {
  socket.on("joinQueue", ({ ticket }) => {
    socket.join(String(ticket));
  });
});

const deleteCode = (code) => {
  const indx = codes.indexOf(codes.some((c) => c.code == code));
  codes.pop(indx);
};

const generateCode = () => {
  let code;
  const expiresAt = Date.now() + 5 * 60 * 1000;

  do {
    code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  } while (codes.some((c) => c.code === code) || checkActiveCode(code));

  codes.push({
    code: code,
    end: expiresAt,
  });

  return code;
};

setInterval(() => {
  const now = Date.now();
  codes = codes.filter((c) => c.end > now);
}, 60 * 1000);

port.open((err) => {
  if (err) {
    console.log("Running without Arduino", err);
    return;
  }
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.on("data", (line) => {
  const msg = line.trim();
  if (msg == "requestCode") {
    port.write(`${generateCode()}\n`);
    console.log(JSON.stringify(codes));
  }
});

app.get("/getTransaction", (req, res) => {
  res.json(getTransactions());
});

app.post("/transactions", (req, res) => {
  const data = req.body;
  addTransaction(data);
  deleteCode(data.ticket_code);
  io.emit("transactionAdded");
  res.json({ success: true });
});

app.post("/checkTicket", (req, res) => {
  const { ticket } = req.body;
  const exist = codes.some((c) => c.code == ticket);
  res.json(exist);
});

app.post("/callStudent", (req, res) => {
  const { ticket } = req.body;

  io.to(String(ticket)).emit("called", {
    message: "Please proceed to the registrar",
  });
  console.log("called ticket", ticket);
  res.json({ success: true });
});

app.post("/next", (req, res) => {
  const { ticket } = req.body;

  deactivateTransaction(ticket);
  io.emit("transactionUpdated");

  res.json({ success: true });
});

server.listen(3000, () => {
  console.log("Server live at port 3000");
});
