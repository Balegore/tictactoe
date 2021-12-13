//gameboard array
const gameboard = (() => {
    let board = [];

    const changeState = function(player, index){
        board[index] = player;
        console.log(board);
    };
    const getState = function(index){
        return board[index];
    }
    const reset = function() {
    }
    return {changeState, getState, reset};
})();

//factory function creates the players and keeps their score
const player = (name, symbol) => {
    return{name, symbol}
};

const playerSelect = (() => {
    let playerType;
    //cache DOM
    const startBox = document.querySelector('.startGame');
    const startBoxButtons = document.querySelectorAll('button');
    //bind events
    startBoxButtons.forEach(button => button.addEventListener('click', (event) => buttonPress(event.target)));
   
    function buttonPress(target){
        switch(target.id){
            case "vsAI":
                playerType = "AI";
                break;
            case "vsPlayer":
                playerType = "player";
                break;
            case "play":
                player();
                player();
                break;
            default:
                break;
        }
    }

    function toggleHidden(target){
        if(target.classList.contains('hidden')){
            target.classList.remove('hidden');
        }
        else{
            target.classList.add('hidden');
        }
    }
      
})();

//module handle game logic
const game = (() => {
    //array indexs that win game
    const winConditions =[ 
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    let gameWon = false
    let symbol = "X";  
    
    //cache DOM 
    const gameboardDIV = document.querySelector('.gameBoard');   
    //bind event   
    gameboardDIV.addEventListener('click', (event) => playGame(event.target));

    function playGame(target){            
        console.log(target.id);
        gameboard.changeState(symbol, target.id);
        if(gameWon == false){renderBoard(target);}
        gameState();       
        symbol = (symbol == "X")? "O": "X";
    };

    //check against array of win conditions to see if won 
    function gameState(){
       for(id in winConditions){
       if(  gameboard.getState(winConditions[id][0]) == gameboard.getState(winConditions[id][1]) && 
            gameboard.getState(winConditions[id][0]) == gameboard.getState(winConditions[id][2]) && 
            gameboard.getState(winConditions[id][0]) != undefined){
                console.log("gameover");
                gameWon = true;
            }     
       }
    }

    //draw symbol to clicked square
    function renderBoard(targetHTML) {
        targetHTML.innerText = gameboard.getState(targetHTML.id);
        }
})();
