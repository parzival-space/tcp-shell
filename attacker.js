#!/bin/node
/* -------------------------------------------------------------------------- */
/*                                   Server                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- Settings -------------------------------- */

// The port the server will listen on
const port = 1337;

/* ------------------------------ Do Not Touch ------------------------------ */

var version = "1.0.0";

/* ---------------------------------- Code ---------------------------------- */

// imports
var net = require('net');

// create a socket server redirect own stdin to socket
var server = net.createServer(async (socket) => {
  // check if the server is already connected to a socket
  if (await isConnected()) return socket.end();

  // redirect stdin to socket
  socket.setEncoding('utf8');
  process.stdin.pipe(socket);

  // handle incoming data
  socket.on('data', (data) => {
    let content = data.toString().replace("\r\n", "\n");

    content.split("\n").forEach((line, i) => {
      let msg = `\x1b[35m[R]\x1b[0m ${line}`;

      // add \n to the start of every line except the first
      if (i > 0) msg = `\n${msg}`;

      // if the first line is empty, skip it
      if (i === 0 && line.length === 0) return;

      // if first line, set cursor position to x = 0
      if (i === 0) msg = `\x1b[0G${msg}`;

      process.stdout.write(msg);
    });
  });

  // log when the connection status has changed
  console.log(`\x1b[32m[C]\x1b[0m New connection from ${socket.remoteAddress}:${socket.remotePort}. Starting session...`);
  socket.once('close', () => console.log(`\x1b[32m[C]\x1b[0m Connection from ${socket.remoteAddress}:${socket.remotePort} has been closed. Waiting for new session...`));

  // handle errors
  socket.on('error', (...args) => console.log(`\x1b[0G\x1b[31m[E]\x1b[0m Socket Error: ${args.join(' ')}`));
});

// handle errors
server.on('error', (...args) => console.log(`\x1b[31m[E]\x1b[0m Server Error: ${args.join(' ')}`));

// check if a socket connection has been made
var isConnected = async () => {
  return new Promise((resolve, reject) => {
    server.getConnections((err, count) => {
      if (err) reject(err);
      resolve(count > 1);
    });
  });
};

console.log(
  '\x1b[0m\n' +
  '\x1b[31m ______   __         ______     __    __     ______   \x1b[37m  ______     __  __     ______     __         __        \n' +
  '\x1b[31m/:  ___: /: :       /:  __ :   /: "-./  :   /:  ___:  \x1b[37m /:  ___:   /: :_: :   /:  ___:   /: :       /: :       \n' +
  '\x1b[31m: :  __: : : :____  : :  __ :  : : :-./: :  : :  __:  \x1b[37m : :___  :  : :  __ :  : :  __:   : : :____  : : :____  \n' +
  '\x1b[31m : :_:    : :_____:  : :_: :_:  : :_: : :_:  : :_____:\x1b[37m  :/:_____:  : :_: :_:  : :_____:  : :_____:  : :_____: \n' +
  '\x1b[31m  :/_/     :/_____/   :/_/:/_/   :/_/  :/_/   :/_____/\x1b[37m   :/_____/   :/_/:/_/   :/_____/   :/_____/   :/_____/ \n' +
  `\x1b[0m                                            FlameShell v${version} by Malte Linke\n`
  .replace(':', '\\')
);

// listen for incoming connections
server.listen(port, () => console.log(`\x1b[36m[F]\x1b[0m FlameShell Server is listening on port ${port}.`));