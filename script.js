//factory function creates the players and keeps their score
const createPlayer = (name, symbol) => {
    let score = 0;
    return{name, symbol, score}
};

//gameboard array
const gameboard = (() => {
    let board = [];
    //combinations of  board game array index that win game
    const winConditions =[ 
        [0,1,2], [3,4,5], [6,7,8], //horizontal
        [0,3,6], [1,4,7], [2,5,8], //vertical
        [0,4,8], [2,4,6]           //diagonal
    ];

    const changeState = function(player, index){
        board[index] = player;
        console.log(board);
    };
    const getBoardIndex = function(index){
        return board[index];
    }
    const reset = function() {
    }

    //check against array of win conditions to see if won 
    const gameWon = function(){
        for(id in winConditions){
            if(  board[winConditions[id][0]] == board[winConditions[id][1]] && 
                board[winConditions[id][0]] == board[winConditions[id][2]] && 
                board[winConditions[id][0]] != undefined){
                        console.log("gameover");
                        return true;}
           }     
           return false;   
        }   

    return {changeState, getBoardIndex, reset, gameWon};
})();

//module handle game play
const game = (() => {
    let player = [];
    let playerType;
    let turn = 0;

    //cache DOM
    const startBoxButtons = document.querySelectorAll('button');
    const menuBoxDOM = document.querySelector('#menuBox');
    const playerSelectMenuDOM = document.querySelector('#playerSelect');
    const playerNameMenuDOM = document.querySelector('#playerNames');
    const gameboardDOM = document.querySelector('.gameBoard');
    const nameInput = playerNameMenuDOM.querySelectorAll('input'); 

    //bind buttons       
    startBoxButtons.forEach(button => button.addEventListener('click', (event) => buttonPress(event.target)));

    const playGame = function (target){        
        console.log(target.id);
        gameboard.changeState(player[turn].symbol, target.id);
        if(gameboard.gameWon()){
            console.log(`${player[turn].name} wins!`)            
        }
        else{   
            turn = (turn == 0)? 1: 0;
        }        
        renderBoard(target);      
    };

    //draw symbol to clicked square
    const renderBoard = function (targetHTML) {
        targetHTML.innerText = gameboard.getBoardIndex(targetHTML.id);
        }     
        
           
    function buttonPress(target){
        switch(target.id){
            case "vsAI":
                playerType = "AI";
                toggleHidden(playerSelectMenuDOM);
                toggleHidden(playerNameMenuDOM);
                break;
            case "vsPlayer":
                playerType = "human";
                toggleHidden(playerSelectMenuDOM);
                toggleHidden(playerNameMenuDOM);
                break;
            case "play":               
                player[0] = createPlayer(nameInput[0].value, 'X');
                player[1] = createPlayer(nameInput[1].value, 'O');
                toggleHidden(menuBoxDOM);
                //bind board
                gameboardDOM.addEventListener('click', (event) => playGame(event.target));
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
})();
