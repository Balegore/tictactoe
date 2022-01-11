//factory function creates the players and keeps their score
const createPlayer = (nameInput, symbol) => {
    let score = 0;
    let name = (nameInput === "")? symbol: nameInput.toString();
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

    const changeState = function(playerSymbol, index){
        board[index] = playerSymbol;
        console.log(board);
    };
    const getBoardIndex = function(index){
        return board[index];
    }

    const getBoard = function(){
        return [...board];
    }

    const reset = function() {
        board.length = 0;
    }

    //check against array of win conditions to see if won 
    const gameOver = function(passedBoard){
        for(id in winConditions){
            if( passedBoard[winConditions[id][0]] == passedBoard[winConditions[id][1]] && 
                passedBoard[winConditions[id][0]] == passedBoard[winConditions[id][2]] && 
                passedBoard[winConditions[id][0]] != undefined){
                        return true;}
           }     
           return false;   
    }      
    const checkWin = function(){
        return gameOver(board)
    }

    return {changeState, getBoardIndex, getBoard, reset, gameOver, checkWin};
})();

const AI = (function() {
        
    function minimax(testBoard, maximizing, depthCounter, maxDepth){
        let gamewon = gameboard.gameOver(testBoard); 
         
        if(gamewon || depthCounter >= maxDepth){
            let score = 0;
            if(gamewon){ 
                if(maximizing){ 
                    score = 10;
                }
                else{
                        score = -10;
                    }   
                }    
            console.log(`Got to the end score = ${score} depth counter = ${depthCounter}`);
            return (score-depthCounter);
        }

        
        else{
            if(maximizing){      
                let maxEval = Number.NEGATIVE_INFINITY;
                for(let i = 0; i<=8; i++){                
                    if(testBoard[i] == undefined){
                        testBoard[i] = 'O';                                  
                        let eval = minimax(testBoard, false, (depthCounter + 1), maxDepth)
                        testBoard[i] = undefined;                                               
                        maxEval = Math.max(maxEval, eval);                        
                    }
                }                    
                return maxEval;                    
            }
            else{          
                let minEval = Number.POSITIVE_INFINITY;
                for(let n = 0; n<=8; n++){ 
                    if(testBoard[n] == undefined){
                        testBoard[n]= 'X';
                        let eval = minimax(testBoard, true, depthCounter + 1, maxDepth);
                        testBoard[n] = undefined;
                        minEval = Math.min(minEval, eval);
                    }                                
                }
                return minEval;
            }
        }
    };

    function getMaxDepth(testBoard){
        let maxDepth = 0;
        for(let i = 0; i<=8; i++){
            if(testBoard[i] == undefined){
                maxDepth++;
            }
        }
        return maxDepth;
    }

    const getMove = function() {        
        let newScore = 0;
        let oldScore = Number.NEGATIVE_INFINITY
        let move;
        let testBoard = gameboard.getBoard();
        let maxDepth = getMaxDepth(testBoard); 

        console.log(`starting board = ${testBoard}`)

        for(let i = 0; i <= 8; i++){                     
            console.log(`loop board = ${testBoard} with ${maxDepth} empty spaces`);
            if(testBoard[i] == undefined){
                newScore = minimax(testBoard, true, 0, 1);    
                if(newScore > oldScore){ 
                    move = i;
                }                        
                oldScore = newScore;
            }
        };
        console.log(move);
        return (move);
    };
    return {getMove};   
})();

//module handle game play
const game = (() => {
    let player = [];
    let vsAI = false;
    let turn;
    let tieCounter = 0;   

    const playGame = function (target){
        if(!(gameboard.getBoardIndex(target)) && target){ //check to make sure square isn't filled and not a row div       
            gameboard.changeState(player[turn].symbol, target);
            if((gameboard.checkWin())){
                displayController.renderGameMessage(`${player[turn].name} wins!`);
                player[turn].score++;
                displayController.renderScore(player);
                displayController.removeBoardListener();                   
            }
            else if(tieCounter >= 8){
                displayController.renderGameMessage(`Tie Game!`);
                displayController.removeBoardListener();
            }                
            
            else{               
                turn = (turn == 0)? 1: 0;                
                tieCounter++;
                displayController.renderGameMessage(`${player[turn].name}'s turn.`);
            }        
            displayController.renderBoard(target);      
            
            if(vsAI && !gameboard.checkWin()){
                let move = AI.getMove();
                console.log(move);                     
            }

        }
    };

   

    //sets turn by random number of 0 (P1) or 1 (P2) 
    const setTurnOrder = () => {    
        if(vsAI){
            turn = 0;
        }
        else{
            turn = Math.round(Math.random());
        }
    }
    
    const setPlayerType = (isAI) => {
        vsAI = isAI;
    }

    const setPlayer = function(createdPlayer, playerNumber) {
        player[playerNumber] = createdPlayer;
    }

    const whosTurn = () => {
        return player[turn].name;
    }

    const reset = () => {
        tieCounter = 0;
        setTurnOrder();
        displayController.renderScore(player);
        gameboard.reset();
    }
    
    return {playGame, setPlayerType, setPlayer, whosTurn, reset}

})();



//handle page manipulation
const displayController = (() =>{    
    const boardRenderEvent = (event) => game.playGame(event.target.id); //used to set gameboard to be able to play

    //cache DOM
    const gameboardHTML = document.querySelector('.gameBoard'); //gameboard
    const startBoxButtons = document.querySelectorAll('button'); //buttons

    //menus
    const resetGameHTML = document.querySelector('#resetGame'); 
    const playerSelectMenuHTML = document.querySelector('#playerSelect');
    const playerNameMenuHTML = document.querySelector('#playerNames');
    const nameInputHTML = playerNameMenuHTML.querySelectorAll('input');
    const p1ScoreHTML = document.querySelector('#playerOneScore');
    const p2ScoreHTML = document.querySelector('#playerTwoScore');
    const p1NameHTML = document.querySelector('#playerOneName');
    const p2NameHTML = document.querySelector('#playerTwoName');
    const gameMessageHTML = document.querySelector('#gameMessage');
    const squaresHTML = document.querySelectorAll('.square');

    //bind buttons       
    startBoxButtons.forEach(button => button.addEventListener('click', (event) => buttonPress(event.target)));

    function buttonPress(target){
        switch(target.id){
            case "vsAI":
                game.setPlayerType(true);
                nameInputHTML[1].value = 'Computer';
                nameInputHTML[1].disabled = true;
                toggleHidden(playerSelectMenuHTML);
                toggleHidden(playerNameMenuHTML);
                break;
            case "vsPlayer":
                game.setPlayerType(false);
                toggleHidden(playerSelectMenuHTML);
                toggleHidden(playerNameMenuHTML);
                break;
            case "play":               
                game.setPlayer(createPlayer(nameInputHTML[0].value, 'X'), 0);
                game.setPlayer(createPlayer(nameInputHTML[1].value, 'O'), 1);
                game.reset();
                toggleHidden(playerNameMenuHTML);
                renderGameMessage(`${game.whosTurn()} starts.`);
                toggleHidden(resetGameHTML);
                //bind board
                addBoardListener();
                break;
            case "reset":
                game.reset();
                renderGameMessage(`${game.whosTurn()} starts.`);
                resetBoard();
                addBoardListener();
            default:
                break;
        }
    }
    
    //draw symbol to clicked square
    const renderBoard = function(target) {
        squaresHTML[target].innerText = gameboard.getBoardIndex(target);
        }
        
    const renderGameMessage = function(gameMessageText){
        gameMessageHTML.innerText = gameMessageText; 
    }

    const renderScore = function (player){
        p1NameHTML.innerText = (player[0].name);
        p1ScoreHTML.innerText = (player[0].score);
        p2NameHTML.innerText = (player[1].name);
        p2ScoreHTML.innerText = (player[1].score);
    }
            
    const removeBoardListener = () => {
        gameboardHTML.removeEventListener('click', boardRenderEvent);   
     
    };

    const addBoardListener = () => {
        gameboardHTML.addEventListener('click', boardRenderEvent);
    };

    const resetBoard = function (){
        for(let i = 0; i <=8; i++){
            document.getElementById(i).innerText = "";
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

    return {renderBoard, renderScore, renderGameMessage, renderBoard, addBoardListener, removeBoardListener}
})();