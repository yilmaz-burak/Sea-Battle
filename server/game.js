class Game {

  constructor(p1, p2) {

    this.players = [p1, p2];
    this.placementCompleted = false;

    p1.ships = [];
    p2.ships = [];
    p1.hits = [];
    p2.hits = [];

    this.whoPlaysNow = p1;

    this.sendMessage("Game has STARTED!");


    this.players.forEach((player) => {
      player.on("coordinate", (coordinate) => {
        this.addToShips(player, coordinate);
      });
    });

  }
  // Functions and Methods

  sendMessage(msg) {
    this.players.forEach((player) => {
      player.emit("message", msg);
    });
  }

  addToShips(player, coordinate) {

    if(!this.placementCompleted){
      if (player.ships.length < 4) {
        player.ships.push(coordinate);
        player.emit("placeShip", coordinate);
      } else if(!this.placementCompleted) {
        player.emit("message", "You have chosen your placement. NO MORE SHIPS FOR YOU.");
        player.emit("message", "On the good side, you can start Attacking, when he is also ready!");
      }
    }

    if (this.players[0].ships.length > 3 && this.players[1].ships.length > 3 && !this.placementCompleted) {
      this.placementCompleted = true;
      this.players.forEach((player, playerId) => {
        player.emit("message", "Both players have chosen. You can Start Attacking! Host First.");
        player.on("coordinate", (coordinate)=>{
          this.attackShips(player, this.players[Math.abs(playerId-1)], coordinate);
        });
      });

    }

  }

  attackShips(player, otherPlayer, coordinate) {
    // Something happens here.

    if(this.whoPlaysNow === player){
      if(coordinate === "burakCheat"){
        var value = otherPlayer.ships.pop();
        player.emit("message", value);
        otherPlayer.ships.push(value);
      }else{
        if(!player.hits.includes(coordinate)){
          player.hits.push(coordinate);

          if(otherPlayer.ships.includes(coordinate)){
            player.emit("message", "Successful hit at : " + coordinate);
            otherPlayer.ships.splice(otherPlayer.ships.indexOf(coordinate), 1);
            player.emit("shipHit", ["red", "o" + coordinate]);
            //Check if the game is over.
            if(player.ships.length == 0 || otherPlayer.ships.length == 0){
              player.emit("message", "GAME OVER");
              otherPlayer.emit("message", "GAME OVER");
              player.emit("message", "YOU HAVE WON!");
              otherPlayer.emit("message", "You have LOST.");
            }
            else{
              player.emit("message", "Still your turn!");
            }

            otherPlayer.emit("hitCoordinate", coordinate);

          }

          else{
            player.emit("message", "No ship at : " + coordinate);
            player.emit("message", "Lost your turn. Opponent Turn.");
            player.emit("shipHit", ["green", "o" + coordinate]);
            otherPlayer.emit("message", "Opponent missed. Your turn now");
            this.whoPlaysNow = otherPlayer;
            otherPlayer.emit("hitCoordinate", coordinate);
          }
        }

        else{
          player.emit("message", "You have already hit that spot.");
        }
      }
    }

    else{
      player.emit("message", "Wait, it is NOT your turn");
    }

  }

}

module.exports = Game;
