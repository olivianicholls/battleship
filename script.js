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
let gameboardFactory = {
  makeBoard: function() {
    let gameboard = document.getElementById("gameboard");
    let sideCount = 1
    for(let i = 1; i <= 100; i++) {
      let newDiv = document.createElement("div");
      newDiv.className = "boardSquare";
      newDiv.id = i;
      gameboard.appendChild(newDiv);
      
      if (i === 1 || i === 11 || i === 21|| i === 31 || i === 41 || i === 51 || i === 61 || i === 71 || i === 81 || i === 91) {
        
        let number = document.createElement('p');
        newDiv.insertAdjacentElement('beforebegin',number);
        number.textContent = sideCount;
        number.className = 'numbers'
        sideCount++;
      }
    }
  },
  clearBoard: function() {
   for(let i = 1; i <= 100; i++) {
     let boardSquare = document.getElementById(i);
     boardSquare.textContent = "";
   }
  }
}

// Create ships
let usedPositions = [];
let toBeRemoved = [];
let shipFactory = {
  ships: [],
  ship: function(length, name) {
    this.name = name;
    this.hit = new Array(length);
    this.hitCounter = 0;
    this.firstCoords = new Array(new coordinate());
    this.firstDivNumber = this.firstCoords[0].x.toString() + this.firstCoords[0].y.toString();
    this.direction = direction();
    this.sunk = false;
    this.positions = new Array(length);
  },
  createShip:function(length, name) {
    let newShip = new this.ship(length, name);
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
          this.createShip(newShip.positions.length, newShip.name);
        }
      }
      if (match === false) {
        usedPositions.push(newShip.positions[i]);
      }
    }
  },
  createShips: function() {
    this.createShip(2, 'destroyer');
    this.createShip(3, 'submarine');
    this.createShip(3, 'cruiser');
    this.createShip(4, 'battleship');
    this.createShip(5, 'carrier');
  },
  placeShips:function() {
    for(let i = 0; i < shipFactory.ships.length; i++) {
      for(let j = 0; j < shipFactory.ships[i].positions.length; j++){
        let position = shipFactory.ships[i].positions[j];
        let positionString = position.toString();
        let boardSquare = document.getElementById(positionString);
        boardSquare.className = 'boardSquare-ship';
        // boardSquare.textContent = "X";
      }
    }
  }
};

// Create Scoreboard
let scoreboard = {
  remainingShips: 5,
  remainingMisses: 30,
  showRemainingShips: function() {
    let shipsLeft = document.getElementById("ships");
    let amount = document.createElement("p");
    amount.id = "shipsAmount";
  },
  showRemainingMisses: function() {
    let missesLeft = document.getElementById("misses");
    let amount = document.createElement("p");
    amount.id = "missesAmount";
    missesLeft.appendChild(amount);
    amount.textContent = " " + this.remainingMisses;
  },
  amendRemainingMisses: function() {
    let missesLeft = document.getElementById("misses");
    let missesAmount = document.getElementById("missesAmount");
    missesLeft.removeChild(missesAmount);
    this.showRemainingMisses();
    this.winLose();
  },
  amendRemainingShips: function() {
    this.showRemainingShips();
    this.winLose();
  },
  winLose: function() {
    if (this.remainingShips == 0) {
      alert("Congrats, you sunk my battleship!!! Play again?");
    } else if (this.remainingMisses === 0 && this.remainingShips !== 0) {
      alert("Sorry, you lose. Try again?");
    }
    // gameplay.newGame();
  }
}

let gameplay = {
  hit: function(hitPosition) {
    let hitPositionNumber = parseInt(hitPosition);
    let hitBoardSquare = document.getElementById(hitPosition);
    
    for(let i = 0; i < shipFactory.ships.length; i++) {
      for(let j = 0; j < shipFactory.ships[i].positions.length; j++) {
        
        if (shipFactory.ships[i].positions[j] === hitPositionNumber && hitBoardSquare.style.backgroundColor !== '#B91212') {
          shipFactory.ships[i].hit[j] = true;
          shipFactory.ships[i].hitCounter++;
          hitBoardSquare.style.backgroundColor = "#B91212";
          hitBoardSquare.style.color = '#000';
          hitBoardSquare.textContent = "X";
          
          
          if (shipFactory.ships[i].hitCounter === shipFactory.ships[i].positions.length) {
            shipFactory.ships[i].sunk = true;
            scoreboard.remainingShips -=1;
            scoreboard.amendRemainingShips();
            this.sunkenShip();
          }
          
        } else if (hitBoardSquare.className !== 'boardSquare-ship') {
          hitBoardSquare.style.backgroundColor = "#03355F";
        }
      }
    }
  },
  sunkenShip: function() {
    let destroyer = document.getElementById("destroyer");
    let submarine = document.getElementById("submarine");
    let cruiser = document.getElementById("cruiser");
    let battleship = document.getElementById("battleship");
    let carrier = document.getElementById("carrier");
    let sunk = document.getElementById("sunk");
    
    for (let i = 0; i < shipFactory.ships.length; i++) {
      if (shipFactory.ships[i].sunk === true && shipFactory.ships[i].name === 'destroyer') {
        destroyer.style.textDecoration = 'line-through';
        destroyer.style.color = '#660006';
      } else if (shipFactory.ships[i].sunk === true && shipFactory.ships[i].name === 'submarine') {
        submarine.style.textDecoration = 'line-through';
        submarine.style.color = '#660006';
      } else if (shipFactory.ships[i].sunk === true && shipFactory.ships[i].name === 'cruiser') {
        cruiser.style.textDecoration = 'line-through';
        cruiser.style.color = '#660006';
      } else if (shipFactory.ships[i].sunk === true && shipFactory.ships[i].name === 'battleship') {
        battleship.style.textDecoration = 'line-through';
        battleship.style.color = '#660006';
      } else if (shipFactory.ships[i].sunk === true && shipFactory.ships[i].name === 'carrier') {
        carrier.style.textDecoration = 'line-through';
        carrier.style.color = '#660006';
      }
    }
    
//     function hideSunk() {
//       sunk.style.display = 'none'
//     }
//     // alert('You Sunk My Battleship!');
    // sunk.style.display = 'block';
    
//     setTimeout(hideSunk(), 5000);
  },
  newGame: function() {
   shipFactory.ships = [];
    shipFactory.createShips();
  }
}


function receiveAttack() {
  let gameboard = document.getElementById("gameboard");
  gameboard.addEventListener("click", function(event) {
    let elementClicked = event.target;
    
    if (elementClicked.className !== "boardSquare-ship" && elementClicked.style.backgroundColor !== "navy"){
      scoreboard.remainingMisses -=1;
      scoreboard.amendRemainingMisses();
    }
    
    if (elementClicked.className === "boardSquare" || elementClicked.className === "boardSquare-ship") {
      gameplay.hit(elementClicked.id);
    }
    console.log(scoreboard.remainingShips);
  });
}


gameboardFactory.makeBoard();
shipFactory.createShips();
scoreboard.showRemainingMisses();
shipFactory.placeShips();
receiveAttack();
