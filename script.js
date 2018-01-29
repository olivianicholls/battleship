let shipFactory = {
  ships: [],
  ship: function(length) {
    this.shipLength = new Array(length);
    this.hit = new Array(length);
    this.sunk = false;    
  },
  createShip:function(length) {
    let newShip = new this.ship(length);
    this.ships.push(newShip);
  },
  setShipLength: function() {
    for(let i = 0; i < this.ships.length; i++) {
      for(let j = 0; j < this.ships[i].shipLength.length; j++) {
        this.ships[i].shipLength[j] = j;
      }
    }
  },
  setShipHit: function() {
    for(let i = 0; i < this.ships.length; i++) {
      for(let j = 0; j < this.ships[i].hit.length; j++) {
        this.ships[i].hit[j] = false;
      }
    }
  },
  hit:function() {
    let hitPosition = hitPosition;
    let hitPositions = 0;
    
    for(let i = 0; i < this.ships.length; i++) {
      for(let j = 0; j < this.ships[i].shipLength.length; j++) {
        if (this.ships[i].shipLength[j] === hitPosition) {
          this.ships[i].hit[j] = true;
          hitPositions++
        }
      }
    }
  },
  isSunk:function() {
    for(let i = 0; i < this.ships.length; i++) {
      if (this.hit.hitPositions !== 0) {
        this.ships[i].sunk = true;
      }
    }
  }
}

shipFactory.createShip(2);
shipFactory.createShip(2);
shipFactory.createShip(3);
shipFactory.createShip(4);
shipFactory.createShip(5);

shipFactory.setShipLength();
shipFactory.setShipHit();
console.log(shipFactory.ships);




// gameboard factory 

function getRandom() {
  return  Math.floor(Math.random() * (100 - 1) + 1)
}


function receiveAttack() {
  let container = document.getElementById('container');
  let ship = document.getElementsByClassName('ships');
  
  container.addEventListener('click', function(event) {
    let elementClicked = event.target;
    
    if(elementClicked.className === 'ships') {
//       mark it as hit// shipFactory.hit();
    }
  });
}

function makeBoard() {
let container = document.getElementById('container');

  for(let i = 1; i < 100; i++) {
    let newDiv = document.createElement('div');
    newDiv.className = 'boardSquare';
    newDiv.id = i;
    container.appendChild(newDiv);
  }

}
makeBoard();

function placeShips() {
  let container = document.getElementById('container');

  for(let i = 0; i < shipFactory.ships.length; i++) {

    let currentShip = shipFactory.ships[i].shipLength;
    let randomNumber = getRandom()
    let randomBoardSquare = document.getElementById(randomNumber);
    
    for(let j = 0; j < currentShip.length; j++){
      debugger;
      let position = j;
      
      
      if (position === 0) {
        randomBoardSquare.textContent = position;
        randomNumber++
      } else {
        let nextBoardsquare = document.getElementById(randomNumber);
        nextBoardsquare.textContent = position;
        randomNumber++
      }
      
  }
  }
}
placeShips()
