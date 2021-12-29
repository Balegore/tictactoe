//gameboard array
const gameboard = (() => {
    let board = [];

    const changeState = function(player, index){
        board[index] = player;
        console.log(board);
    };
    const getBoardIndex = function(index){
        return board[index];
    }
    const reset = function() {
    }
    return {changeState, getBoardIndex, reset};
})();

//factory function creates the players and keeps their score
const player = (name, symbol) => {
    return{name, symbol}
};

const gameDOM = (() => {
    let playerType;
    let symbol;

    //cache DOM
    const startBoxButtons = document.querySelectorAll('button');
    const menuBoxDOM = document.querySelector('#menuBox');
    const playerSelectMenuDOM = document.querySelector('#playerSelect');
    const playerNameMenuDOM = document.querySelector('#playerNames');
    const gameboardDOM = document.querySelector('.gameBoard');
    const nameInput = playerNameMenuDOM.querySelectorAll('input'); 

    //bind event   
    gameboardDOM.addEventListener('click', (event) => game.playGame(event.target));
    startBoxButtons.forEach(button => button.addEventListener('click', (event) => buttonPress(event.target)));
   
    function buttonPress(target){
        switch(target.id){
            case "vsAI":
                playerType = "AI";
                toggleHidden(playerSelectMenuDOM);
                toggleHidden(playerNameMenuDOM);
                break;
            case "vsPlayer":
                playerType = "player";
                toggleHidden(playerSelectMenuDOM);
                toggleHidden(playerNameMenuDOM);
                break;
            case "play":
                symbol = 'X';
                playerone = player(nameInput[0].value, symbol);
                symbol = 'O';
                playertwo = player(nameInput[1].value, symbol);
                toggleHidden(menuBoxDOM);
                toggleHidden(gameboardDOM);
                break;
            default:
                break;
        }
    }
    
    //toggle hidden    
    function toggleHidden(target){
        if(target.classList.contains('hidden')){
            target.classList.remove('hidden');
        }
        else{
            target.classList.add('hidden');
        }
    }
    //draw symbol to clicked square
    const renderBoard = function (targetHTML) {
        targetHTML.innerText = gameboard.getBoardIndex(targetHTML.id);
        }
    return {renderBoard};      
})();

//module handle game logic
const game = (() => {
    //combinations of  board game array index that win game
    const winConditions =[ 
        [0,1,2], [3,4,5], [6,7,8], //horizontal
        [0,3,6], [1,4,7], [2,5,8], //vertical
        [0,4,8], [2,4,6]           //diagonal
    ];
    let gameWon = false
    let players;

    const getPlayer = function (name) {

    }

    const playGame = function (target){            
        console.log(target.id);
        gameboard.changeState(symbol, target.id);
        if(gameWon == false){gameDOM.renderBoard(target);}
        gameState();       
        symbol = (symbol == "X")? "O": "X";
    };

    //check against array of win conditions to see if won 
    function gameState(){
       for(id in winConditions){
       if(  gameboard.getBoardIndex(winConditions[id][0]) == gameboard.getBoardIndex(winConditions[id][1]) && 
            gameboard.getBoardIndex(winConditions[id][0]) == gameboard.getBoardIndex(winConditions[id][2]) && 
            gameboard.getBoardIndex(winConditions[id][0]) != undefined){
                console.log("gameover");
                gameWon = true;
            }     
       }

    }
    return {playGame};
})();
