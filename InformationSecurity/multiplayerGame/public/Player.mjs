class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    this.direction = {
      up: false,
      down: false,
      left: false,
      right: false
    }
  }

  movePlayer(dir, speed) {
    //ghost function, player movement is handled in server.js
    switch(dir) {
      case "up":
        this.y -= speed;
        break;
      case "down":
        this.y += speed;
        break;
      case "left":
        this.x -= speed;
        break;
      case "right":
        this.x += speed;
        break;
    }
  }

  collision(item) {
    const plrSz = 20
    const colSz = 10
    const colX = item.x
    const colY = item.y
    if (((this.x + plrSz >= colX) && (this.x <= colX + colSz)) && ((this.y + plrSz >= colY) && (this.y <= colY + colSz))) {
      return true
    } else {
      return false
    }
  }

  calculateRank(arr) {
    //Moved functionality to game.mjs since tests want specific outcome
    const sortedArr = arr.sort((a, b) => b.score - a.score)
    const rank = sortedArr.findIndex((entry) => entry.id === this.id) + 1
    return "Rank: " + rank + " / " + sortedArr.length
  }
}

export default Player;
