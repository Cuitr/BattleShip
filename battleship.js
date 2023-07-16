let view ={
    displayMessage : function(msg){
        let message = document.getElementById("messageArea");
        message.innerHTML = msg;
    },
    displayHit: function(location){
        let hitShip = document.getElementById(location);
        hitShip.setAttribute("class", "hit");

    },
    displayMiss: function(location){
        let missShip = document.getElementById(location);
        missShip.setAttribute("class", "miss");
    }
};
let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3, 
    shipsSunk: 0,
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],
    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
        var ship = this.ships[i];
        var index = ship.locations.indexOf(guess);
            if (index >= 0) {
            ship.hits[index] = "hit";
            view.displayHit(guess);
            view.displayMessage("HIT!");
            if (this.isSunk(ship)) {
                view.displayMessage("You sank my battleship!");
                this.shipsSunk++;
                }
            return true;
        }
        }
        
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
   },
   isSunk: function(ship) {
    for (let i = 0; i < this.shipLength; i++) {
    if (ship.hits[i] !== "hit") {
    return false;
    }
    }
    return true;
        
    },
    generateShipLocations: function(){
        let locations;
        for(let i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShips();
            }while(this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShips: function(){
        let direction = Math.floor(Math.random()*2);
        let col, row;
        if(direction === 1){
            col = Math.floor(Math.random()*(this.boardSize - this.shipLength));
            row = Math.floor(Math.random()*this.boardSize);
        }else{
            col = Math.floor(Math.random()*this.boardSize);
            row = Math.floor(Math.random()*(this.boardSize - this.shipLength));
        }
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++){
            if(direction === 1){
                newShipLocations.push(row + "" +(col + i));// may be there are mistakes at syntax
            }else{
                newShipLocations.push((row + i) + "" + col);//may be there are mistakes at syntax
            }
        }
        return newShipLocations;
    },
    collision: function (locations){
        for(let i = 0; i < this.numShips; i++){
            let ship = model.ships[i];
            for(let j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
        }
    }
    return false;
}  
};
let controller ={
    guesses: 0,
    processGuess: function(guess){
        let location = parseGuess(guess);
        if(location){
            this.guesses++;
            let hit = model.fire(location);
            if(hit && model.shipSunks == model.numShips){
                view.displayMessage(`You sank all my battle ships in ${this.guesses} guess`);
            }
        }
        function parseGuess(guess){
        let charactersOfBoard = ["A","B","C","D","E","F","G"];
        let letterPartOfGuess = guess.charAt(0);
        let numberPartOfGuess = guess.charAt(1);//numberPartOfGuess === column
        let row = charactersOfBoard.indexOf(letterPartOfGuess);//row is the letter part of guess converted to a number
        if(guess === null || guess.length !== 2){
            alert(`Invalid!, please enter a letter and a number on the board`);
        }else{
            if(row < 0 || row >= model.boardSize || numberPartOfGuess < 0 || numberPartOfGuess >= model.boardSize){
                alert(`Invalid!, that's off the board!`);
            }else if(isNaN(row) || isNaN(numberPartOfGuess)){
                alert(`Invalid! it is not on the board`);
            }else{
                return row + numberPartOfGuess;
            }
        }
        return null;
    }          
    }
};
function init(){
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    let guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress; 
    model.generateShipLocations();
};
function handleKeyPress(e){
    let fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
};
function handleFireButton(){
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
};
window.onload = init;