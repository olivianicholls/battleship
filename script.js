// Create gameboard
let gameboardFactory = {
  makeBoard: function(boardId, squareId) {
    const gameboard = document.getElementById(boardId);
    let rowCounter = 1
    
    for(let i = 1; i <= 100; i++) {
      let newDiv = document.createElement("div");
      newDiv.className = "boardSquare";
      newDiv.id = squareId + i;
      gameboard.appendChild(newDiv);
      
      // If board square is first in its row, insert a new element to create the Y-axis number squares
      if (i % 10 == 1) {
        let boardNumber = document.createElement("div");
        newDiv.insertAdjacentElement("beforebegin",boardNumber);
        boardNumber.textContent = rowCounter;
        boardNumber.className = "boardNumbers"
        rowCounter++;
      }
    }
  }
}

// Create ships
function direction() {
  return Math.round(Math.random());
  // 0 = vertical
  // 1 = horizontal
}

function randomPosition() {
  return Math.floor(Math.random() * (100 - 1) + 1);
}

// let usedPositions = [];
// let guessedPositions = [];

let shipFactory = {
  usedPositions: [],
  computerShips: [],
  playerShips: [],
  computerShip: function(length, name) {
    this.name = name;
    this.firstDivNumber = randomPosition();
    this.direction = direction();
    this.positions = new Array(length);
    this.hitCounter = 0;
    this.sunk = false;
  },
  playerShip: function(length, name) {
    this.name = name;    
    this.positions = new Array(length);
    this.hitCounter = 0;
    this.sunk = false;
  },
  createComputerShip:function(length, name) {
    let newShip = new this.computerShip(length, name);
    this.computerShips.push(newShip);
    let divNumber = newShip.firstDivNumber;
    
    for(let i = 0; i < newShip.positions.length; i++){
      if (i === 0) {
        newShip.positions[0] = divNumber
      } else { 
        if (newShip.direction === 0 && (newShip.firstDivNumber % 10 >= 1 && newShip.firstDivNumber  % 10 <= 5)) {
          newShip.positions[i] = divNumber += 1; // if first position on LEFT half of board, build ship to the RIGHT
        } else if (newShip.direction === 0 && (newShip.firstDivNumber % 10 > 5 && newShip.firstDivNumber % 10 <= 9 || newShip.firstDivNumber % 10 == 0)){
          newShip.positions[i] = divNumber -= 1; // if first position on RIGHT half of board, build ship to the LEFT
        } else if (newShip.direction !== 0 && newShip.firstDivNumber < 50) {
          newShip.positions[i] = divNumber += 10; // if first position on TOP half of board, build ship DOWN
        } else if (newShip.direction !== 0 && newShip.firstDivNumber >= 50) {
          newShip.positions[i] = divNumber -= 10; // if first position on BOTTOM half of board, build UP
        }
      }
      // Check if position has already been taken by another ship
      let match = false
      for(let j = 0; j < shipFactory.usedPositions.length ; j++) {
        
        // if position has already been used, remove ship from computerShips array, clear usedPositions
        if (newShip.positions[i] === shipFactory.usedPositions[j]) { 
          this.computerShips.pop();
          shipFactory.usedPositions = [];
          match = true;
          
          // Loop through set computerShips in order to reset usedPositions
          for(let k = 0; k < this.computerShips.length; k++) { 
            for(let l = 0; l < this.computerShips[k].positions.length; l++) {
              shipFactory.usedPositions.push(this.computerShips[k].positions[l]);
            }
          }
           // Remake this ship and try again until positions selected are unused
          this.createComputerShip(newShip.positions.length, newShip.name);
        }
      }
      // if positions have not been used, add to usedPositions and continue
      if (match === false) { 
        shipFactory.usedPositions.push(newShip.positions[i]);
      }
    }
  },
  createAllComputerShips: function() {
    this.createComputerShip(2, "Destroyer");
    this.createComputerShip(3, "Submarine");
    this.createComputerShip(3, "Cruiser");
    this.createComputerShip(4, "Battleship");
    this.createComputerShip(5, "Carrier");
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
  createPlayerShip: function(length, name) {
    let newShip = new this.playerShip(length, name);
    this.playerShips.push(newShip);
  },
  createAllPlayerShips: function() {
    this.createPlayerShip(2, "Destroyer");
    this.createPlayerShip(3, "Submarine");
    this.createPlayerShip(3, "Cruiser");
    this.createPlayerShip(4, "Battleship");
    this.createPlayerShip(5, "Carrier");
  },
  playerShipColors: function (i, element) {
    switch (i) {
      case 0:
        element.style.backgroundColor = "#F6DCC8";
        element.style.border = "2px solid #F89B53";
        break;
      case 1:
        element.style.backgroundColor = "#A39BD6";
        element.style.border = "2px solid #705FD8";
        break;
      case 2:
        element.style.backgroundColor = "#afdea3";
        element.style.border = "2px solid #5cb544";
        break;
      case 3:
        element.style.backgroundColor = "#A5E1E4";
        element.style.border = "2px solid #4ACBD1";
        break;
      case 4:
        element.style.backgroundColor = "#E4A5C8";
        element.style.border = "2px solid #DF4C9E";
        break;
             }
  },
  placePlayerShips: function() {
    const scoreboard = document.getElementById("scoreboard");
    const computerBoard = document.getElementById("computerBoardWrapper");
    const playerBoard = document.getElementById("playerBoard");
    const addShip = document.getElementById("addShip");
    const shipName = document.createElement("p");
    const alertUsed = document.getElementById("alertUsed");
    const alertStart = document.getElementById("alertStart");
    const alertPlacement = document.getElementById("alertPlacement");

    let i = 0
    let j = 0;
    
    addShip.appendChild(shipName);
    shipName.id = "shipName";
    shipName.textContent = shipFactory.playerShips[i].name + " (" + shipFactory.playerShips[i].positions.length + " squares)";
    
    playerBoard.addEventListener("click", function(event) {
      let elementClicked = event.target;
      // if player has selected an unused space
      if (elementClicked.className === "boardSquare") { 
        
        let positionId = elementClicked.id;
        let idNumber = positionId.substr(6); // remove 'pboard' from id in order to select square number character
        let positionNumber = parseInt(idNumber);
        let firstPosition = shipFactory.playerShips[i].positions[0]
        // Select the positions that are inline with the last selected position
        let toTheLeft = firstPosition - j;
        let toTheRight = firstPosition + j;
        let above = firstPosition - (j * 10);
        let below = firstPosition + (j * 10);
      
      if (j > 0) { 
        // if next selected position is inline with the last selected position
        if (positionNumber === toTheLeft || positionNumber === toTheRight || positionNumber === above || positionNumber === below) {
          shipFactory.playerShips[i].positions[j] = positionNumber;
          shipFactory.playerShipColors(i, elementClicked);
          elementClicked.className = "shipSquare"; // Change class name in order to signify square has been used
          j++
        } else {
         alertPlacement.style.display = "grid";
        } 
      } else { // Do not need to check that positions are inline as first position
        shipFactory.playerShips[i].positions[j] = positionNumber;
        shipFactory.playerShipColors(i, elementClicked);
        elementClicked.className = "shipSquare"; // Change class name in order to signify square has been used
        j++
      }
        // Move on to next ship if whole ship has been placed
        if (j === shipFactory.playerShips[i].positions.length) {
          i++;
          j = 0;
        }
        if (i != 5) { // Change text to next ship
    shipName.textContent = shipFactory.playerShips[i].name + " (" + shipFactory.playerShips[i].positions.length + " squares)";
          

        } else if (i === 5) {
          alertStart.style.display = "grid"; // Start game
        }
      } else if (elementClicked.className === "shipSquare") { // if selected a used space, show alert
        alertUsed.style.display = "grid";
      }
    });
  }
}

// Scoring Elements
let display = {
  remainingPlayerShips: 5,
  remainingComputerShips: 5,
  amendRemainingShips: function() {
    this.winLose();
  },
  winLose: function() {
    const alertWin = document.getElementById("alertWin");
    const alertLose = document.getElementById("alertLose");
    
    if (this.remainingComputerShips === 0) {
      alertWin.style.display = "grid";
    } else if (this.remainingPlayerShips === 0) {
      alertLose.style.display = "grid";
    }
  },
  alertActions: function(event, alert) {
    let elementClicked = event.target;
    const instructionsWrapper = document.getElementById("instructions-wrapper");
    const gameWrapper = document.getElementById("game-wrapper");
    
    if (elementClicked.className === "okayButton") { 
      alert.style.display = "none";
      if (elementClicked.parentElement.id === "alertStart") {
        gameplay.startGame();
      }
    } else if (elementClicked.className === "playAgainButton") { 
      location.reload();
    } else if (elementClicked.id === "startButton") {
      instructionsWrapper.style.display = "none";
      gameWrapper.style.display = "block";
    } else if (elementClicked.id === "instructions-button") {
      instructionsWrapper.style.display = "grid";
      gameWrapper.style.display = "none";
    }
  },
  alertEventListenters: function() {
    const alertPlacement = document.getElementById("alertPlacement");
    const alertUsed = document.getElementById("alertUsed");
    const alertStart = document.getElementById("alertStart");
    const alertWin = document.getElementById("alertWin");
    const alertLose = document.getElementById("alertLose");
    const instructions = document.getElementById("instructions-wrapper");
    const instructionsButton = document.getElementById("instructions-button");
    
    alertPlacement.addEventListener("click", function(){display.alertActions(event, alertPlacement)});
    alertUsed.addEventListener("click", function(){display.alertActions(event, alertUsed)});
    alertStart.addEventListener("click", function() {display.alertActions(event, alertStart)});
    alertWin.addEventListener("click", function() {display.alertActions(event, alertWin)});
    alertLose.addEventListener("click", function() {display.alertActions(event, alertLose)});
    instructions.addEventListener("click", function() {display.alertActions(event, instructions)});
    instructionsButton.addEventListener("click", function() {display.alertActions(event, instructionsButton)});
  }
}

// Gameplay
let gameplay = {
  turnCounter: 1,
  guessedPositions: [],
  startGame: function() {
    const scoreboard = document.getElementById("scoreboard");
    const container = document.getElementById("container");
    const computerBoardWrapper = document.getElementById("computerBoardWrapper");
    const addShip = document.getElementById("addShip");
    const turn = document.getElementById("turn");
    const shipsToSink = document.getElementById("shipsToSink");
    let remainingShips = document.createElement("p");
    
    shipsToSink.appendChild(remainingShips);
    remainingShips.id = "remainingShips";
    remainingShips.textContent = " " + 5;
    
    container.style.marginTop = 0;
    scoreboard.style.display = "grid";
    computerBoardWrapper.style.display = "block";
    addShip.style.display = "none";
    turn.style.display = "block";
    shipsToSink.style.display = "inline";
  },
  turns: function() { // Determine whether it's the player's or computer's turn
    const turnText = document.getElementById("turn");
    if (this.turnCounter % 2 === 0) {
      turnText.textContent = "Computer's Turn";
      this.computerTurn();
    } else if (this.turnCounter % 2 !== 0){
      turnText.textContent = "Player's Turn";
    }
},
  computerNextGuess: function() {
    let computerGuessedDivNumber = randomPosition();
    // Ensures the computer will not guess a position it has already guessed
    while (this.guessedPositions.indexOf(computerGuessedDivNumber) !== -1) {
      computerGuessedDivNumber = randomPosition();
    }
    this.guessedPositions.push(computerGuessedDivNumber);
    return computerGuessedDivNumber;
  },
  computerTurn: function () {
    let turnText = document.getElementById("turn");

    setTimeout(function() { // Wait 0.5 seconds after player's guess to simulate computer "thinking"
      let computerGuessedDivNumber = gameplay.computerNextGuess();
      let computerGuessedDivString = computerGuessedDivNumber.toString();
      let attackedDiv = document.getElementById("pBoard" + computerGuessedDivString);
      
      if (attackedDiv.className === "shipSquare") { // if computer selects a correct space        
        for(let i = 0; i < shipFactory.playerShips.length; i++) {
          for(let j = 0; j < shipFactory.playerShips[i].positions.length; j++) {
            
            if (shipFactory.playerShips[i].positions[j] === computerGuessedDivNumber) {
              shipFactory.playerShips[i].hitCounter++;
              attackedDiv.style.backgroundColor = "#E61C1C";
              attackedDiv.textContent = "X";
              
              // if each position has been hit, mark ship as sunk
              if (shipFactory.playerShips[i].hitCounter === shipFactory.playerShips[i].positions.length) {
              shipFactory.playerShips[i].sunk = true;
              display.remainingPlayerShips -=1; 
              display.amendRemainingShips();
              }
            }
          }
        }
        gameplay.turnCounter++;
      } else { // if the computer's guess is a miss
        attackedDiv.style.backgroundColor = "#03355F";
        gameplay.turnCounter++;
      }
      turnText.textContent = "Player's Turn";
    }, 500);
    console.log(this.guessedPositions);
  },
  playerTurn: function(hitPosition) {
    let idNumber = hitPosition.substr(6);
    let hitPositionNumber = parseInt(idNumber);
    const hitBoardSquare = document.getElementById(hitPosition);

    for(let i = 0; i < shipFactory.computerShips.length; i++) {
      for(let j = 0; j < shipFactory.computerShips[i].positions.length; j++) {
        if(hitBoardSquare.className !== "boardLetters" && hitBoardSquare.className !== "boardNumbers") {
        if (shipFactory.computerShips[i].positions[j] === hitPositionNumber && hitBoardSquare.style.backgroundColor !== "#E61C1C") {
          shipFactory.computerShips[i].hitCounter++;
          hitBoardSquare.style.backgroundColor = "#E61C1C";
          hitBoardSquare.style.color = "#000";
          hitBoardSquare.textContent = "X";          
          
          if (shipFactory.computerShips[i].hitCounter === shipFactory.computerShips[i].positions.length) {
            shipFactory.computerShips[i].sunk = true;
            display.remainingComputerShips -=1;
            display.amendRemainingShips();
            this.sunkenShip();
          }
        } else if (hitBoardSquare.className === "boardSquare") {
          hitBoardSquare.style.backgroundColor = "#03355F";
        }
      }
    }
    }
  },
  sunkenShip: function() {
    const remainingShips = document.getElementById("remainingShips");
    remainingShips.textContent = display.remainingComputerShips;
  },
  playerClick: function() {
    const computerBoard = document.getElementById("computerBoard");
    const waitTurn = document.getElementById("alertTurn");
    const alertWin = document.getElementById("alertWin");
    const alertLose = document.getElementById("alertLose");
    
    computerBoard.addEventListener("click", function(event) {
      let elementClicked = event.target;
      if (gameplay.turnCounter % 2 === 0) {
        waitTurn.style.display = "grid";
        setTimeout(function() {
          waitTurn.style.display = "none";
        }, 500);
      } else {
        // Only runs if player clicks a previously unguessed square, and ensures game will not continue once someone wins
        if (elementClicked.style.backgroundColor !== "#03355f" && elementClicked.style.backgroundColor !== "#E61C1C" && elementClicked.className !== "boardLetters" && elementClicked.className !== "boardNumbers" && elementClicked.id !== "blankSquare" && alertWin.style.display !== "grid" && alertLose.style.display !== "grid") {
          gameplay.playerTurn(elementClicked.id);
          gameplay.turnCounter++;
          gameplay.turns();
        }
      }
    });
  }
}

gameboardFactory.makeBoard("playerBoard", "pBoard");
gameboardFactory.makeBoard("computerBoard", "cBoard");
shipFactory.createAllComputerShips();
shipFactory.createAllPlayerShips();
shipFactory.placePlayerShips();
shipFactory.placeComputerShips();
gameplay.playerClick();
display.alertEventListenters();
console.log(shipFactory.computerShips);
