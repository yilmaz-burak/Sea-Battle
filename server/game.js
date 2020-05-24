class Game {
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.placementCompleted = false;

    p1.ships = [];
    p2.ships = [];
    p1.hits = [];
    p2.hits = [];
    p1.firstLastCoordinates = [];
    p2.firstLastCoordinates = [];
    p1.allShips = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
    p2.allShips = [1, 1, 1, 1, 2, 2, 2, 3, 3, 4];

    this.whoPlaysNow = p1;

    this.sendMessage("Game has STARTED!");


    this.players.forEach((player) => {
      player.on("coordinate", (coordinate) => {
        player.firstLastCoordinates.push(coordinate);
        if (player.firstLastCoordinates.length === 2) {
          this.addToShips(player, player.firstLastCoordinates[0], player.firstLastCoordinates[1]);
          player.firstLastCoordinates = [];
        }
      });
    });

  }
  // Functions and Methods

  sendMessage(msg) {
    this.players.forEach((player) => {
      player.emit("message", msg);
    });
  }

  addToShips(player, firstCoordinate, lastCoordinate) {

    if (!this.placementCompleted) {
      if (player.ships.length < 20) {
        let length = player.allShips[player.allShips.length-1];

        if (this.coordinateAvailable(length, firstCoordinate, lastCoordinate)) {
          let a = this.createCoordinates(player, length, firstCoordinate, lastCoordinate);
          player.ships = player.ships.concat(a);
          player.ships.forEach((coordinate) => {
            player.emit("placeShip", coordinate);
          });
          player.emit("message", "Successful Placement for " + length);
          console.log(player.allShips);
          player.allShips.pop();
          console.log(player.allShips);

        } else {
          player.emit("message", "Coordinates are invalid");
          player.emit("message", "Remember, your coordinates must be straight and at given length, " + length );
        }


      } else if (!this.placementCompleted) {
        player.emit("message", "You have placed all your ships.");
        player.emit("message", "Wait for other player to place.")
      }
    }

    if (this.players[0].ships.length > 19 && this.players[1].ships.length > 19 && !this.placementCompleted) {
      this.placementCompleted = true;
      this.players.forEach((player, playerId) => {
        player.emit("message", "Both players have placed. You can start attacking! Host goes first.");
        player.on("coordinate", (coordinate) => {
          this.attackShips(player, this.players[Math.abs(playerId - 1)], coordinate);
        });
      });

    }

  }

  attackShips(player, otherPlayer, coordinate) {
    // Something happens here.

    if (this.whoPlaysNow === player) {
      if (coordinate === "burakCheat") {
        var value = otherPlayer.ships.pop();
        player.emit("message", value);
        otherPlayer.ships.push(value);
      } else {
        if (!player.hits.includes(coordinate)) {
          player.hits.push(coordinate);

          if (otherPlayer.ships.includes(coordinate)) {
            player.emit("message", "Successful hit at : " + coordinate);
            otherPlayer.ships.splice(otherPlayer.ships.indexOf(coordinate), 1);
            player.emit("shipHit", ["red", "o" + coordinate]);
            //Check if the game is over.
            if (player.ships.length == 0 || otherPlayer.ships.length == 0) {
              player.emit("message", "GAME OVER");
              otherPlayer.emit("message", "GAME OVER");
              player.emit("message", "YOU HAVE WON!");
              otherPlayer.emit("message", "You have LOST.");
            } else {
              player.emit("message", "Still your turn!");
            }

            otherPlayer.emit("hitCoordinate", coordinate);

          } else {
            player.emit("message", "No ship at : " + coordinate);
            player.emit("message", "Lost your turn. Opponent Turn.");
            player.emit("shipHit", ["green", "o" + coordinate]);
            otherPlayer.emit("message", "Opponent missed. Your turn now");
            this.whoPlaysNow = otherPlayer;
            otherPlayer.emit("hitCoordinate", coordinate);
          }
        } else {
          player.emit("message", "You have already hit that spot.");
        }
      }
    } else {
      player.emit("message", "Wait, it is NOT your turn");
    }

  }

  // Creating Ship Coordinates
  coordinateAvailable(length, firstCoordinate, lastCoordinate) {

    if (firstCoordinate.length != 2 || lastCoordinate.length != 2) {
      return false;
    } else {
      const firstLetterPart = firstCoordinate.charAt(0).charCodeAt(0);
      const firstNumberPart = firstCoordinate.charAt(1).charCodeAt(0);
      const lastLetterPart = lastCoordinate.charAt(0).charCodeAt(0);
      const lastNumberPart = lastCoordinate.charAt(1).charCodeAt(0);
      console.log(firstCoordinate, lastCoordinate, firstLetterPart, firstNumberPart, lastLetterPart, lastNumberPart);
      console.log(String.fromCharCode(firstLetterPart));
      if (firstLetterPart === lastLetterPart && (Math.abs(lastNumberPart - firstNumberPart) + 1) === length) return true;
      else if (firstNumberPart === lastNumberPart && (Math.abs(lastLetterPart - firstLetterPart) + 1) === length) return true;
      else return false;
    }
  }


  createCoordinates(player, length, firstCoordinate, lastCoordinate) {
    const firstLetterPart = firstCoordinate.charAt(0);
    const lastLetterPart = lastCoordinate.charAt(0);
    const firstNumberPart = firstCoordinate.charAt(1);
    const lastNumberPart = lastCoordinate.charAt(1);
    const coordinates = [];

    if (firstLetterPart === lastLetterPart) {

      for (let i = 0; i < length; i++) {
        let min = Math.min(firstNumberPart.charCodeAt(0), lastNumberPart.charCodeAt(0));
        coordinates.push(firstLetterPart + String.fromCharCode((min + i)));
      }
    } else if (firstNumberPart === lastNumberPart) {
      let min = Math.min(firstLetterPart.charCodeAt(0), lastLetterPart.charCodeAt(0));
      for (let i = 0; i < length; i++) {
        coordinates.push(String.fromCharCode((min + i)) + firstNumberPart);
      }
    }

    return coordinates;

  }

}



module.exports = Game;
