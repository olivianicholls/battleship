function direction() {
  return Math.round(Math.random());
  // 0 = vertical
  // 1 = horizontal
}
function randomPosition() {
  return Math.floor(Math.random() * (100 - 1) + 1);
}

let turnCounter = 1;

// gameboard factory
let gameboardFactory = {
  makeBoard: function(boardId, squareId) {
    let gameboard = document.getElementById(boardId);
    let sideCount = 1
    for(let i = 1; i <= 100; i++) {
      let newDiv = document.createElement("div");
      newDiv.className = "boardSquare";
      newDiv.id = squareId + i;
      gameboard.appendChild(newDiv);
      
      if (i === 1 || i === 11 || i === 21|| i === 31 || i === 41 || i === 51 || i === 61 || i === 71 || i === 81 || i === 91) {

        let number = document.createElement("p");
        newDiv.insertAdjacentElement("beforebegin",number);
        number.textContent = sideCount;
        number.className = "numbers"
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

let usedPositions = [];
let guessedPositions = [];

// Create ships
let shipFactory = {
  computerShips: [],
  playerShips: [],
  computerShip: function(length, name) {
    this.name = name;
    this.hit = new Array(length);
    this.hitCounter = 0;
    this.firstDivNumber = randomPosition();
    this.direction = direction();
    this.sunk = false;
    this.positions = new Array(length);
  },
  playerShip: function(length, name) {
    this.name = name;
    this.hit = new Array(length);
    this.hitCounter = 0;
    this.sunk = false;
    this.positions = new Array(length);
  },
  createComputerShip:function(length, name) {
    let newShip = new this.computerShip(length, name);
    this.computerShips.push(newShip);
    let divNumber = newShip.firstDivNumber;
    
    for(let i = 0; i < newShip.positions.length; i++){
      if (i === 0) {
        newShip.positions[0] = divNumber
      } else {
        if (newShip.direction === 0 && (newShip.firstDivNumber >= 1 && newShip.firstDivNumber <= 5 || newShip.firstDivNumber > 10 && newShip.firstDivNumber  <= 15 || newShip.firstDivNumber > 20 && newShip.firstDivNumber <= 25 || newShip.firstDivNumber > 30 && newShip.firstDivNumber <= 35 || newShip.firstDivNumber > 40 && newShip.firstDivNumber <= 45 || newShip.firstDivNumber > 50 && newShip.firstDivNumber <= 55 || newShip.firstDivNumber > 60 && newShip.firstDivNumber <= 65 || newShip.firstDivNumber > 70 && newShip.firstDivNumber <= 75 || newShip.firstDivNumber > 80 && newShip.firstDivNumber <= 85 || newShip.firstDivNumber > 90 && newShip.firstDivNumber <= 95)) {
          newShip.positions[i] = divNumber += 1;
        } else if (newShip.direction === 0 && (newShip.firstDivNumber > 5 && newShip.firstDivNumber <= 10 || newShip.firstDivNumber > 15 && newShip.firstDivNumber <= 20 || newShip.firstDivNumber > 25 && newShip.firstDivNumber <= 30 || newShip.firstDivNumber > 35 && newShip.firstDivNumber <= 40 || newShip.firstDivNumber > 45 && newShip.firstDivNumber <= 50 || newShip.firstDivNumber > 55 && newShip.firstDivNumber <= 60 || newShip.firstDivNumber > 65 && newShip.firstDivNumber <= 69 || newShip.firstDivNumber > 75 && newShip.firstDivNumber <= 80 || newShip.firstDivNumber > 85 && newShip.firstDivNumber <= 90 || newShip.firstDivNumber > 95 && newShip.firstDivNumber <= 100)){
          newShip.positions[i] = divNumber -= 1;
        } else if (newShip.direction !== 0 && newShip.firstDivNumber < 50) {
          newShip.positions[i] = divNumber += 10;
        } else if (newShip.direction !== 0 && newShip.firstDivNumber >= 50) {
          newShip.positions[i] = divNumber -= 10;
        }
      }
      
      let match = false
      for(let j = 0; j < usedPositions.length ; j++) {
        
        if (newShip.positions[i] === usedPositions[j]) {
          this.computerShips.pop();
          usedPositions = [];
          match = true;
          
          for(let k = 0; k < this.computerShips.length; k++){
            for(let l = 0; l < this.computerShips[k].positions.length; l++){
              usedPositions.push(this.computerShips[k].positions[l]);
            }
          }
          this.createComputerShip(newShip.positions.length, newShip.name);
        }
      }
      if (match === false) {
        usedPositions.push(newShip.positions[i]);
      }
    }
  },
  createAllComputerShips: function() {
    this.createComputerShip(2, "destroyer");
    this.createComputerShip(3, "submarine");
    this.createComputerShip(3, "cruiser");
    this.createComputerShip(4, "battleship");
    this.createComputerShip(5, "carrier");
  },
  placeComputerShips:function() {
    for(let i = 0; i < shipFactory.computerShips.length; i++) {
      for(let j = 0; j < shipFactory.computerShips[i].positions.length; j++){

        let position = shipFactory.computerShips[i].positions[j];      
        let positionString = position.toString();
        let boardSquare = document.getElementById("cBoard" + positionString);
        boardSquare.className = "shipSquare";
      }
    }
  },
  createPlayerShips: function(length, name) {
    let newShip = new this.playerShip(length, name);
    this.playerShips.push(newShip);
  },
  createAllPlayerShips: function() {
    this.createPlayerShips(2, "Destroyer (2 Squares)");
    this.createPlayerShips(3, "Submarine (3 Squares)");
    this.createPlayerShips(3, "Cruiser (3 Squares)");
    this.createPlayerShips(4, "Battleship (4 Squares)");
    this.createPlayerShips(5, "Carrier (5 Squares)");
  },
  placePlayerShips: function() {
    let scoreboard = document.getElementById("scoreboard");
    let computerBoard = document.getElementById("computerBoardWrapper");
    let playerBoard = document.getElementById("playerBoard");
    let addShip = document.createElement("p");
    addShip.id = "addShip";
    computerBoard.insertAdjacentElement("afterend",addShip);
    
    let i = 0
    let j = 0;
    
    addShip.textContent = "Place Your " + shipFactory.playerShips[i].name;
    
    playerBoard.addEventListener("click", function(event) {
      let elementClicked = event.target;
      
      if (elementClicked.className === "boardSquare" || elementClicked.className === "shipSquare") {
        
        let positionId = elementClicked.id;
        let idNumber = positionId.substr(6);
        let positionNumber = parseInt(idNumber);
        let firstPosition = shipFactory.playerShips[i].positions[0]
        let toTheLeft = firstPosition - j;
        let toTheRight = firstPosition + j;
        let above = firstPosition - (j * 10);
        let below = firstPosition + (j * 10);
      
      // if (elementClicked.style.backgroundColor !== "rgba(0, 0, 0, 0.12)") {
      //   alert("THAT SPOT IS TAKEN");
      // }
      
      
      if (j > 0) { 

        if (positionNumber === toTheLeft || positionNumber === toTheRight || positionNumber === above || positionNumber === below) {
           shipFactory.playerShips[i].positions[j] = positionNumber;
          
           switch (i) {
             case 0:
               elementClicked.style.backgroundColor = "#F6DCC8";
               elementClicked.style.border = "2px solid #F89B53";
               break;
             case 1:
               elementClicked.style.backgroundColor = "#A39BD6";
               elementClicked.style.border = "2px solid #705FD8";
               break;
             case 2:
               elementClicked.style.backgroundColor = "#afdea3";
               elementClicked.style.border = "2px solid #5cb544";
               break;
             case 3:
               elementClicked.style.backgroundColor = "#A5E1E4";
               elementClicked.style.border = "2px solid #4ACBD1";
               break;
             case 4:
               elementClicked.style.backgroundColor = "#E4A5C8";
               elementClicked.style.border = "2px solid #DF4C9E";
               break;
                    }
          elementClicked.className = "shipSquare";
          j++;
        
        } else {
         alert("CANT GO THERE!");
        } 
      } else {
        shipFactory.playerShips[i].positions[j] = positionNumber;
        
        switch (i) {
          case 0:
               elementClicked.style.backgroundColor = "#F6DCC8";
               elementClicked.style.border = "2px solid #F89B53";
               break;
             case 1:
               elementClicked.style.backgroundColor = "#A39BD6";
               elementClicked.style.border = "2px solid #705FD8";
               break;
             case 2:
               elementClicked.style.backgroundColor = "#afdea3";
               elementClicked.style.border = "2px solid #5cb544";
               break;
             case 3:
               elementClicked.style.backgroundColor = "#A5E1E4";
               elementClicked.style.border = "2px solid #4ACBD1";
               break;
             case 4:
               elementClicked.style.backgroundColor = "#E4A5C8";
               elementClicked.style.border = "2px solid #DF4C9E";
               break;
                 }
        elementClicked.className = "shipSquare";
        j++
      }
        if (j === shipFactory.playerShips[i].positions.length) {
          i++;
          j = 0;
        }
        if (i != 5) {
        addShip.textContent = "Place Your " + shipFactory.playerShips[i].name;
        } else if (i === 5){
          gameplay.startGame();
        }
      }
    });
  }
}


// Create Scoreboard
let scoreboard = {
  remainingPlayerShips: 5,
  remainingComputerShips: 5,
  showRemainingShips: function() {
    let shipsLeft = document.getElementById("ships");
    let amount = document.createElement("p");
    amount.id = "shipsAmount";
  },
  amendRemainingShips: function() {
    this.showRemainingShips();
    this.winLose();
  },
  winLose: function() {
    if (this.remainingComputerShips === 0) {
      alert("Congrats, you sunk my battleship!!! Play again?");
      location.reload();
    } else if (this.remainingPlayerShips === 0) {
      alert("Sorry, you lose. Try again?");
      location.reload();
    }
  }
}

let gameplay = {
  startGame: function() {
    alert("Start sinking!");
    
    let scoreboard = document.getElementById("scoreboard");
    let computerBoardWrapper = document.getElementById("computerBoardWrapper");
    let addShip = document.getElementById("addShip");
    let turn = document.getElementById("turn");
    let ships = document.getElementById("ships");
    let remainingShips = document.createElement("p");
    
    ships.appendChild(remainingShips);
    remainingShips.id = "remainingShips";
    remainingShips.textContent = 5;
    
    scoreboard.style.display = "grid";
    computerBoardWrapper.style.display = "block";
    addShip.style.display = "none";
    turn.style.display = "block";
    ships.style.display = "grid";
  },
  turns: function() {
    let turnText = document.getElementById("turn");
    
    if (turnCounter % 2 === 0) {
      turnText.textContent = "Computer's Turn";
      this.computerTurn();
    } else if (turnCounter % 2 !== 0){
      turnText.textContent = "Player's Turn";
    }
},
  computerNextGuess: function() {
    let computerGuessedDivNumber = randomPosition();
    
    while (guessedPositions.indexOf(computerGuessedDivNumber) !== -1) {
      computerGuessedDivNumber = randomPosition();
    }
    
    guessedPositions.push(computerGuessedDivNumber);
    return computerGuessedDivNumber;
  },
  computerTurn: function () {
    let turnText = document.getElementById("turn");
    
    setTimeout(function() {
      let computerGuessedDivNumber = gameplay.computerNextGuess();
      
      let computerGuessedDivString = computerGuessedDivNumber.toString();
      let attackedDiv = document.getElementById("pBoard" + computerGuessedDivString);
      
      if (attackedDiv.className === "shipSquare") {
        
        for(let i = 0; i < shipFactory.playerShips.length; i++) {
          for(let j = 0; j < shipFactory.playerShips[i].positions.length; j++) {
            
            if (shipFactory.playerShips[i].positions[j] === computerGuessedDivNumber) {
              shipFactory.playerShips[i].hit[j] = true;
              shipFactory.playerShips[i].hitCounter++;
              attackedDiv.style.backgroundColor = "#E61C1C";
              attackedDiv.textContent = "X";
              
              if (shipFactory.playerShips[i].hitCounter === shipFactory.playerShips[i].positions.length) {
              shipFactory.playerShips[i].sunk = true;
              scoreboard.remainingPlayerShips -=1;
              scoreboard.amendRemainingShips();
              }
            }
          }
        }
        turnCounter++;
      } else {
        attackedDiv.style.backgroundColor = "#03355F";
        turnCounter++;
      }
      turnText.textContent = "Player's Turn";
    }, 500);
  },
  hit: function(hitPosition) {

    let idNumber = hitPosition.substr(6);
    let hitPositionNumber = parseInt(idNumber);
    let hitBoardSquare = document.getElementById(hitPosition);

    for(let i = 0; i < shipFactory.computerShips.length; i++) {
      for(let j = 0; j < shipFactory.computerShips[i].positions.length; j++) {
        
        if (shipFactory.computerShips[i].positions[j] === hitPositionNumber && hitBoardSquare.style.backgroundColor !== "#E61C1C") {
          shipFactory.computerShips[i].hit[j] = true;
          shipFactory.computerShips[i].hitCounter++;
          hitBoardSquare.style.backgroundColor = "#E61C1C";
          hitBoardSquare.style.color = "#000";
          hitBoardSquare.textContent = "X";          
          
          if (shipFactory.computerShips[i].hitCounter === shipFactory.computerShips[i].positions.length) {
            shipFactory.computerShips[i].sunk = true;
            scoreboard.remainingComputerShips -=1;
            scoreboard.amendRemainingShips();
            this.sunkenShip();
          }
        } else if (hitBoardSquare.className !== "shipSquare") {
          hitBoardSquare.style.backgroundColor = "#03355F";
        }
      }
    }
  },
  sunkenShip: function() {
    let remainingShips = document.getElementById("remainingShips");
    remainingShips.textContent = scoreboard.remainingComputerShips;
  },
}

function playerAttack() {
  let computerBoard = document.getElementById("computerBoard");
  computerBoard.addEventListener("click", function(event) {
    if (turnCounter % 2 === 0) {
      alert("WAIT YOUR TURN!")
    } else {
      
    let elementClicked = event.target;
      
    if (elementClicked.style.backgroundColor !== "rgb(3, 53, 95)" && elementClicked.style.backgroundColor !== "rgb(185, 18, 18)") {
      gameplay.hit(elementClicked.id);
       turnCounter++
      gameplay.turns();
    }
    }
  });
}


gameboardFactory.makeBoard("playerBoard", "pBoard");
gameboardFactory.makeBoard("computerBoard", "cBoard");
shipFactory.createAllComputerShips();
shipFactory.createAllPlayerShips();
shipFactory.placePlayerShips();
shipFactory.placeComputerShips();
playerAttack();
