// Load most basic dependencies
// Create require function 
// https://nodejs.org/docs/latest-v18.x/api/module.html#modulecreaterequirefilename
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
// The above two lines allow us to use ES methods and CJS methods for loading
// dependencies.
// Load minimist for command line argument parsing
// https://www.npmjs.com/package/minimist
const minimist = require('minimist')
// Parse our command line arguments
const args = minimist(process.argv.slice(2))
// Are we debugging or testing?
// If so, then let's look at our command line arguments just to see what is in there
if (args.debug) {
    console.info('Minimist parsed and created the following `args` object:')
    console.info(args)
}
// Did we call for help? 
if (args.h || args.help) {
    console.log(`
usage: node server.js --port=5000
This package serves the static HTML, CSS, and JS files in a /public directory.
It also creates logs in a common log format (CLF) so that you can better.
  --stat,  -s    Specify the directory for static files to be served
                    Default: ./public/
  --port, -p    Specify the port for the HTTP server to listen on
                    Default: 8080
  --log,  -l    Specify the directory for the log files
                    Default: ./log/
  --help, -h    Displays this help message and exit 0 
                    (Does not work when run with nodemon)
  --debug       Echos more information to STDOUT so that you can see what is
                    stored in internal variables, etc.
    `)
    process.exit(0)
} 
// Load express and other dependencies for serving HTML, CSS, and JS files
import express from 'express'
// Use CJS __filename and __dirname in ES module scope
// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Load dependencies for logging
const fs = require('fs')
const morgan = require('morgan')
// Create log path
const logpath = args.log || args.l || process.env.LOGPATH || path.join(__dirname, 'log')
if (!fs.existsSync(logpath)){
    fs.mkdirSync(logpath);
}
if (args.debug) {
    console.info('HTTP server is logging to this directory:')
    console.info(logpath)
}
// Create an app server
const app = express()
// Set a port for the server to listen on
const port = args.port || args.p || process.env.PORT || 8080
// Load app middleware here to serve routes, accept data requests, etc.
//
// Create and update access log
// The morgan format below is the Apache Foundation combined format but with ISO8601 dates
app.use(morgan(':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
    {stream: fs.createWriteStream(path.join(logpath, 'access.log')), flags: 'a' }
))
// Serve static files
const staticpath = args.stat || args.s || process.env.STATICPATH || path.join(__dirname, 'public');
app.use('/', express.static(staticpath));

app.use(express.json());

const determineWinner = (playerMove, opponentMove, gameType) => {
  if (playerMove === opponentMove) {
    return 'draw';
  }

  const winningMoves = {
    rps: {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper',
    },
    rpsls: {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      lizard: ['spock', 'paper'],
      spock: ['scissors', 'rock'],
    },
  };

  if (winningMoves[gameType][playerMove].includes(opponentMove)) {
    return 'win';
  } else {
    return 'lose';
  }
};

const generateOpponentMove = (gameType) => {
  const moves = gameType === 'rps' ? ['rock', 'paper', 'scissors'] : ['rock', 'paper', 'scissors', 'lizard', 'spock'];
  return moves[Math.floor(Math.random() * moves.length)];
};

app.post('/app/:gameType/play', (req, res) => {
  const gameType = req.params.gameType;
  const playerMove = req.body.move;
  const opponentMove = generateOpponentMove(gameType);
  const gameResult = determineWinner(playerMove, opponentMove, gameType);

  const result = {
    player: playerMove,
    opponent: opponentMove,
    result: gameResult,
  };

  res.json(result);
});

// Create app listener
const server = app.listen(port);

// Create a log entry on start
let startlog = new Date().toISOString() + ' HTTP server started on port ' + port + '\n';
// Debug echo start log entry to STDOUT
if (args.debug) {
  console.info(startlog);
}
// Log server start to file
fs.appendFileSync(path.join(logpath, 'server.log'), startlog);

// Exit gracefully and log
process.on('SIGINT', () => {
  // Create a log entry on SIGINT
  let stoppinglog = new Date().toISOString() + ' SIGINT signal received: stopping HTTP server\n';
  // Log SIGINT to file
  fs.appendFileSync(path.join(logpath, 'server.log'), stoppinglog);
  // Debug echo SIGINT log entry to STDOUT
  if (args.debug) {
    console.info('\n' + stoppinglog);
  }
  // Create a log entry on stop
  server.close(() => {
    let stoppedlog = new Date().toISOString() + ' HTTP server stopped\n';
    // Log server stop to file
    fs.appendFileSync(path.join(logpath, 'server.log'), stoppedlog);
    // Debug echo stop log entry to STDOUT
    if (args.debug) {
      console.info('\n' + stoppedlog);
    }
  })
})
import { rps, rpsls } from "./lib/rpsls.js";

// endpoint at /app/ returns 200 OK
app.get("/app/", (req,res) => {
    res.status(200).send({"message":"200 OK"});
});

// endpoint at /app/rps/ returns {"player":"(rock|paper|scissors)"}
app.get("/app/rps/", (req,res) => {
    var result = JSON.stringify(rps())
    res.status(200)
    .setHeader('Content-type', 'application/json')
    .send(result)
});

// '/app/rpsls/' accepts the correct request bodies
app.get("/app/rpsls/", (req,res) => {
    var result = JSON.stringify(rpsls())
    res.status(200)
    .setHeader('Content-type', 'application/json')
    .send(result)
});

// playing rps endpoint
app.get("/app/rps/play/", (req,res) => {
    try {
        const choice = req.query.choice;
        const result = JSON.stringify(rps(choice));
        res.status(200)
        .setHeader('Content-Type', 'application/json')
        .send(result);
    } catch{
        res.status(400).send(`${choice} is out of range.`);
    }
});

// playing rpsls endpoint
app.get("/app/rpsls/play/", (req,res) => {
    try {
        const choice = req.query.choice;
        const result = JSON.stringify(rpsls(choice));
        res.status(200)
        .setHeader('Content-Type', 'application/json')
        .send(result);
    } catch{
        res.status(400).send(`${choice} is out of range.`);
    }
});

// rps play post
app.post("/app/rps/play/", (req,res) => {
    try {
        const choice = req.body.choice;
        const result = JSON.stringify(rps(choice));
        res.status(200)
        .setHeader('Content-Type', 'text/plain')
        .send(result);
    } catch{
        res.status(400).send(`${choice} is out of range.`);
    }
});

// rpsls play post
app.post("/app/rpsls/play/", (req,res) => {
    try {
        const choice = req.body.choice;
        const result = JSON.stringify(rpsls(choice));
        res.status(200)
        .setHeader('Content-Type', 'application/json')
        .send(result);
    } catch{
        res.status(400).send(`${choice} is out of range.`);
    }
});

app.get("/app/rps/play/:choice", (req,res) => {
    try {
        const choice = req.params.choice;
        const result = JSON.stringify(rps(choice));
        res.status(200)
        .setHeader('Content-Type', 'application/json')
        .send(result);
    } catch{
        res.status(400).send(`${choice} is out of range.`);
    }
});

app.get("/app/rpsls/play/:choice", (req,res) => {
    try {
        const choice = req.params.choice;
        const result = JSON.stringify(rpsls(choice));
        res.status(200)
        .setHeader('Content-Type', 'application/json')
        .send(result);
    } catch{
        res.status(400).send(`${choice} is out of range.`);
    }
});

// catch 404 error
app.get("app/*", (req,res) => {
    res.status(404)
    .send('404: Not Found!');
});
