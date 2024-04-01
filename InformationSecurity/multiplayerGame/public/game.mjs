import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');
const winnerText = document.getElementById('winning');
const gameConstants = {
  playerSize: 20,
  collectibleSize: 10,
}

socket.on('init', (id) => {
  console.log("initialized")
  const player = new Player({ x: 100, y: 100, score: 0, id: id})

  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === "w" || key === "ArrowUp") {
      player.direction.up = true
    } else if (key === "s" || key === "ArrowDown") {
      player.direction.down = true
    } else if (key === "a" || key === "ArrowLeft") {
      player.direction.left = true
    } else if (key === "d" || key === "ArrowRight") {
      player.direction.right = true
    }
    socket.emit('inputChange', {directions: player.direction})
  })

  document.addEventListener('keyup', (event) => {
    const key = event.key;
    if (key === "w" || key === "ArrowUp") {
      player.direction.up = false
    } else if (key === "s" || key === "ArrowDown") {
      player.direction.down = false
    } else if (key === "a" || key === "ArrowLeft") {
      player.direction.left = false
    } else if (key === "d" || key === "ArrowRight") {
      player.direction.right = false
    }
    socket.emit('inputChange', {directions: player.direction})
  })

  socket.on('state', (state) => {
    const {players, collectibles} = state;
    window.requestAnimationFrame((timestamp) => updateFrame(timestamp, players, collectibles))
  })

  const updateFrame = (timestamp, players, collectibles) => {
    clearCanvas()
    for (let i = 0; i < players.length; i++) {
      const playerToDraw = players[i];
      drawPlayer(playerToDraw)
    }
    for (let i = 0; i < collectibles.length; i++) {
      const collectibleToDraw = collectibles[i];
      drawCollectible(collectibleToDraw)
    }
    
    players.sort((a, b) => b.score - a.score)
    const playerPosition = players.findIndex(entry => entry.id === id)
    const playerScore = players[playerPosition].score
    const playerPos = (playerPosition + 1).toString()
    if (playerPos === "1") {
      winnerText.innerText = `You are winning with a score of ${playerScore}!`
    } else {
      let suffix
      switch (playerPos) {
        case "1":
          suffix = "st"
          break;
        case "2":
          suffix = "nd"
          break;
        case "3":
          suffix = "rd"
          break;
        default:
          suffix = "th"
          break;
      }
      winnerText.innerText = `You are in ${playerPos}${suffix} place with a score of ${playerScore}`
    }
  }

  const clearCanvas = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'tan';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  const drawPlayer = (player) => {
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, gameConstants.playerSize, gameConstants.playerSize);
  }

  const drawCollectible = (collectible) => {
    let color
    switch(collectible.value) {
      case 1:
        color = 'brown';
        break;
      case 3:
        color = 'grey';
        break;
      case 10:
        color = 'yellow';
        break;
    }
    const colSz = gameConstants.collectibleSize
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();
    context.arc(collectible.x + colSz/2, collectible.y + colSz/2, colSz/2, 0, 2 * Math.PI);
    context.fill()
  }
})

