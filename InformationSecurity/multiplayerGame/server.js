require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();


//helmet stuff

app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' }))
app.use(helmet.noSniff());
app.use(nocache())
app.use(helmet.noCache())

//middleware

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

//socket

//simulating player movement on the client then shipping the information to server seems very unsecure so i handled it all on the server

const players = []
const collectibles = []
const io = socket.listen(server)
let gameInterval

const gameConstants = {
  playerSize: 20,
  collectibleSize: 10,
  canvasWidth: 640,
  canvasHeight: 480,
  frameRate: 60,
  speed: 5
}

const generateRandomCollectible = () => {
  let value = Math.random() * 10
  if (value <= 6) {
    value = 1
  } else if (value <= 9) {
    value = 3
  } else {
    value = 10
  }
  const badCoords = []
  for (let i = 0; i < players.length; i++) {
    badCoords.push({x: players[i].x, y: players[i].y})
  }
  const plrSz = gameConstants.playerSize
  const colSz = gameConstants.collectibleSize
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * (gameConstants.canvasWidth - gameConstants.collectibleSize))
    const y = Math.floor(Math.random() * (gameConstants.canvasHeight - gameConstants.collectibleSize))
    if (i === 99) {
      return {x: x, y: y, value: value}
    }
    for (let j = 0; j < badCoords.length; j ++) {
      let coords = badCoords[j];
      if (((coords.x + plrSz >= x) && (coords.x <= x + colSz)) && ((coords.y + plrSz >= y) && (coords.y <= y + colSz))) {
        continue;
      } else {
        return {x: x, y: y, value: value}
      }
    }
  }
}

const checkCollision = () => {
  const collectible = collectibles[0]
  const colX = collectible.x
  const colY = collectible.y
  const plrSz = gameConstants.playerSize
  const colSz = gameConstants.collectibleSize
  for (let i = 0; i < players.length; i++) {
    const plrX = players[i].x
    const plrY = players[i].y
    if (((plrX + plrSz >= colX) && (plrX <= colX + colSz)) && ((plrY + plrSz >= colY) && (plrY <= colY + colSz))) {
      players[i].score += collectible.value
      collectibles.pop()
      collectibles.push(generateRandomCollectible())
    }
  }
}

const calculatePlayerMovement = () => {
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    if (player.direction.up == true) { player.y -= gameConstants.speed }
    if (player.direction.down == true) { player.y += gameConstants.speed }
    if (player.direction.left == true) { player.x -= gameConstants.speed }
    if (player.direction.right == true) { player.x += gameConstants.speed }
    if (player.x < 0) {
      player.x = 0
    } else if (player.x > gameConstants.canvasWidth - gameConstants.playerSize) {
      player.x = gameConstants.canvasWidth - gameConstants.playerSize
    }
    if (player.y < 0) {
      player.y = 0
    } else if (player.y > gameConstants.canvasHeight - gameConstants.playerSize) {
      player.y = gameConstants.canvasHeight - gameConstants.playerSize
    }
  }
}




io.on('connection', (socket) => {
  console.log('User connected with ID: ' + socket.id);
  const startX = gameConstants.canvasWidth / 2 - gameConstants.playerSize / 2
  const startY = gameConstants.canvasHeight / 2 - gameConstants.playerSize / 2
  players.push({
    x: startX,
    y: startY,
    score: 0,
    id: socket.id,
    color: '#' + Math.floor(Math.random()*16777215).toString(16),
    direction: {
      up: false,
      down: false,
      left: false,
      right: false
    }
  })
  if (players.length === 1) {
    collectibles.push(generateRandomCollectible())
    gameInterval = setInterval(() => {
      calculatePlayerMovement()
      checkCollision()
      io.emit('state', {players, collectibles})
    }, 1000 / gameConstants.frameRate)
  }
  socket.on('inputChange', (data) => {
    playerIndex = players.findIndex((entry) => entry.id === socket.id)
    const { left, up, right, down } = data.directions
    players[playerIndex].direction = {
      up: up,
      down: down,
      left: left,
      right: right
    }
  })
  io.to(socket.id).emit('init', socket.id)
  socket.on('disconnect', () => {
    const removeIndex = players.findIndex((entry) => entry.id === socket.id)
    players.splice(removeIndex, 1)
    if (players.length === 0) {
      collectibles.pop()
      clearInterval(gameInterval)
    }
  })
})

module.exports = app; // For testing
