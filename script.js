function direction() {
  return Math.round(Math.random());
  // 0 = vertical
  // 1 = horizontal
}
function randomPosition() {
  return Math.floor(Math.random() * (10 - 1) + 1);
}
function coordinate(x, y) {
  this.x = randomPosition();
  this.y = randomPosition();
}

// gameboard factory
function makeBoard() {
  let container = document.getElementById("container");
  
  for(let i = 1; i <= 100; i++) {
    let newDiv = document.createElement("div");
    newDiv.className = "boardSquare";
    newDiv.id = i;
    container.appendChild(newDiv);
  }
}
makeBoard();

// Create ships

let usedPositions = [];
let toBeRemoved = [];
let shipFactory = {
  ships: [],
  ship: function(length) {
    this.hit = new Array(length);
    this.hitCounter = 0;
    this.firstCoords = new Array(new coordinate());
    this.firstDivNumber = this.firstCoords[0].x.toString() + this.firstCoords[0].y.toString();
    this.direction = direction();
    this.sunk = false;
    this.positions = new Array(length);
  },
  createShip:function(length) {
    let newShip = new this.ship(length);
    this.ships.push(newShip);
    let divNumber = parseInt(newShip.firstDivNumber);
    for(let i = 0; i < newShip.positions.length; i++){
      
      if (i === 0) {
        newShip.positions[0] = divNumber
      } else {
        if (newShip.direction === 0 && (newShip.firstDivNumber  >= 1 && newShip.firstDivNumber  <= 5 || newShip.firstDivNumber  > 9 && newShip.firstDivNumber  <= 15 || newShip.firstDivNumber > 19 && newShip.firstDivNumber <= 25 || newShip.firstDivNumber > 29 && newShip.firstDivNumber <= 35 || newShip.firstDivNumber > 39 && newShip.firstDivNumber <= 45 || newShip.firstDivNumber > 49 && newShip.firstDivNumber <= 55 || newShip.firstDivNumber > 59 && newShip.firstDivNumber <= 65 || newShip.firstDivNumber > 69 && newShip.firstDivNumber <= 75 || newShip.firstDivNumber > 79 && newShip.firstDivNumber <= 85 || newShip.firstDivNumber > 89 && newShip.firstDivNumber <= 95)) {
          newShip.positions[i] = divNumber += 1;
        } else if (newShip.direction=== 0 && (newShip.firstDivNumber > 5 && newShip.firstDivNumber <= 9 || newShip.firstDivNumber > 15 && newShip.firstDivNumber <= 19 || newShip.firstDivNumber > 25 && newShip.firstDivNumber <= 29 || newShip.firstDivNumber > 35 && newShip.firstDivNumber <= 39 || newShip.firstDivNumber > 45 && newShip.firstDivNumber <= 49 || newShip.firstDivNumber > 55 && newShip.firstDivNumber <= 59 || newShip.firstDivNumber > 65 && newShip.firstDivNumber <= 69 || newShip.firstDivNumber > 75 && newShip.firstDivNumber <= 79 || newShip.firstDivNumber > 85 && newShip.firstDivNumber <= 89 || newShip.firstDivNumber > 95 && newShip.firstDivNumber <= 100)){
          newShip.positions[i] = divNumber -= 1;
        } else if (newShip.direction !== 0 && newShip.firstDivNumber < 50) {
          newShip.positions[i] = divNumber += 10;
        } else if (newShip.direction!== 0 && newShip.firstDivNumber >= 50) {
          newShip.positions[i] = divNumber -= 10;
        }
      }
      
      let match = false
      for(let j = 0; j < usedPositions.length ; j++) {
        
        if (newShip.positions[i] === usedPositions[j]) {
          this.ships.pop();
          usedPositions = [];
          match = true;
          
          for(let k = 0; k < this.ships.length; k++){
            for(let l = 0; l < this.ships[k].positions.length; l++){
              usedPositions.push(this.ships[k].positions[l]);
            }
          }
          this.createShip(newShip.positions.length);
        }
      }
      if (match === false) {
        usedPositions.push(newShip.positions[i]);
      }
    }
  },
};

shipFactory.createShip(2);
shipFactory.createShip(3);
shipFactory.createShip(3);
shipFactory.createShip(4);
shipFactory.createShip(5);

// Create Scoreboard
let scoreboard = {
  remainingShips: 5,
  remainingMissiles: 35,
  showRemainingShips: function() {
    let shipsLeft = document.getElementById("ships");
    let amount = document.createElement("p");
    amount.id = "shipsAmount";
    shipsLeft.appendChild(amount);
    amount.textContent = " " + this.remainingShips;
  },
  showRemainingMissiles: function() {
    let missilesLeft = document.getElementById("missiles");
    let amount = document.createElement("p");
    amount.id = "missilesAmount";
    missilesLeft.appendChild(amount);
    amount.textContent = " " + this.remainingMissiles;
  },
  amendRemainingMissles: function() {
    let missilesLeft = document.getElementById("missiles");
    let missileAmount = document.getElementById("missilesAmount");
    missilesLeft.removeChild(missileAmount);
    this.showRemainingMissiles();
    this.winLose();
  },
  amendRemainingShips: function() {
    let shipsLeft = document.getElementById("ships");
    let shipsAmount = document.getElementById("shipsAmount");
    shipsLeft.removeChild(shipsAmount);
    this.showRemainingShips();
    this.winLose();
  },
  winLose: function() {
    if (this.remainingMissiles !== 0 && this.remainingShips === 0){
      alert("Congrats, you win!!!");
    } else if (this.remainingMissiles === 0 && this.remainingShips !== 0) {
      alert("Sorry, you lose. Try again!");
    }
  }
}
scoreboard.showRemainingShips();
scoreboard.showRemainingMissiles();

function hit(hitPosition) {
  let hitPositionNumber = parseInt(hitPosition);
  let hitBoardSquare = document.getElementById(hitPosition);
  
  for(let i = 0; i < shipFactory.ships.length; i++) {
    for(let j = 0; j < shipFactory.ships[i].positions.length; j++) {
      
      if (shipFactory.ships[i].positions[j] === hitPositionNumber) {
        shipFactory.ships[i].hit[j] = true;
        shipFactory.ships[i].hitCounter++;
        
        if (shipFactory.ships[i].hitCounter === shipFactory.ships[i].positions.length) {
          shipFactory.ships[i].sunk = true;
          scoreboard.remainingShips -=1;
          scoreboard.amendRemainingShips();
        }
        
        hitBoardSquare.style.color = "black";
        hitBoardSquare.style.backgroundColor = "red";
      } else if (hitBoardSquare.textContent === "") {
        hitBoardSquare.style.backgroundColor = "navy";
      }
    }
  }
};

function placeShips() {
  for(let i = 0; i < shipFactory.ships.length; i++) {
    for(let j = 0; j < shipFactory.ships[i].positions.length; j++){
      let position = shipFactory.ships[i].positions[j];
      let positionString = position.toString();
      let boardSquare = document.getElementById(positionString);
      boardSquare.textContent = "X";
    }
  }
}
placeShips();

function receiveAttack() {
  let container = document.getElementById("container");
  
  container.addEventListener("click", function(event) {
    let elementClicked = event.target;
    
    if (elementClicked.style.backgroundColor !== "red" && elementClicked.style.backgroundColor !== "navy"){
      scoreboard.remainingMissiles -=1;
      scoreboard.amendRemainingMissles();
    }
    if (elementClicked.className === "boardSquare") {
      hit(elementClicked.id);
    }
  });
}

receiveAttack();
