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
        board.length = 0;
    }

    //check against array of win conditions to see if won 
    const gameWon = function(){
        for(id in winConditions){
            if( board[winConditions[id][0]] == board[winConditions[id][1]] && 
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
    const boardRenderEvent = (event) => playGame(event.target); //used to set gameboard to be able to play

    //cache DOM
    const gameboardHTML = document.querySelector('.gameBoard'); //gameboard
    const startBoxButtons = document.querySelectorAll('button'); //buttons

    //menus
    const scoreBoxHTML = document.querySelector('#scoreBox'); 
    const playerSelectMenuHTML = document.querySelector('#playerSelect');
    const playerNameMenuHTML = document.querySelector('#playerNames');
    const nameInputHTML = playerNameMenuHTML.querySelectorAll('input');
    const p1ScoreHTML = document.querySelector('#playerOneScore');
    const p2ScoreHTML = document.querySelector('#playerTwoScore');
    const p1NameHTML = document.querySelector('#playerOneName');
    const p2NameHTML = document.querySelector('#playerTwoName');
    const winMsgHTML = document.querySelector('#winMessage');

    //bind buttons       
    startBoxButtons.forEach(button => button.addEventListener('click', (event) => buttonPress(event.target)));

    const playGame = function (target){
        if(!(gameboard.getBoardIndex(target.id)) && target.id){ //check to make sure square isn't filled and not a row div       
            console.log(target.id);
            gameboard.changeState(player[turn].symbol, target.id);
            if((gameboard.gameWon())){
                winMsgHTML.innerText = `${player[turn].name} wins!`;
                player[turn].score++;
                renderScore();
                setBoardListener(true);                     
            }
            else{   
                turn = (turn == 0)? 1: 0;
            }        
            renderBoard(target);      
        }
    };

    //draw symbol to clicked square
    const renderBoard = function (targetHTML) {
        targetHTML.innerText = gameboard.getBoardIndex(targetHTML.id);
        }     
            
    function setBoardListener(gameover){
        if(gameover){
            gameboardHTML.removeEventListener('click', boardRenderEvent);   
        }
        else{
            gameboardHTML.addEventListener('click', boardRenderEvent);
        }
    };

    function renderScore(){
        p1NameHTML.innerText = (player[0].name);
        p1ScoreHTML.innerText = (player[0].score);
        p2NameHTML.innerText = (player[1].name);
        p2ScoreHTML.innerText = (player[1].score);
    }
    
    function resetBoard(){
        for(let i = 0; i <=8; i++){
            document.getElementById(i).innerText = "";
        }
    }
    
    function buttonPress(target){
        switch(target.id){
            case "vsAI":
                playerType = "AI";
                toggleHidden(playerSelectMenuHTML);
                toggleHidden(playerNameMenuHTML);
                break;
            case "vsPlayer":
                playerType = "human";
                toggleHidden(playerSelectMenuHTML);
                toggleHidden(playerNameMenuHTML);
                break;
            case "play":               
                player[0] = createPlayer(nameInputHTML[0].value, 'X');
                player[1] = createPlayer(nameInputHTML[1].value, 'O');
                toggleHidden(playerNameMenuHTML);
                renderScore();
                toggleHidden(scoreBoxHTML);
                //bind board
                setBoardListener(false);
                break;
            case "reset":
                gameboard.reset();
                resetBoard();
                setBoardListener(false);
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
