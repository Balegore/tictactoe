
//gameboard array
const gameboard = (() => {
    let board = [];

    const changeState = function(player, index){
        board[index] = player;
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
    //cache DOM
    const squareDIV = document.querySelectorAll('.square'); 
    const gameboardDIV = document.querySelector('.gameBoard');   
    //bind event   
    bindSquares();

    function bindSquares(){
       
        if(gameWon == false){
            squareDIV.forEach(square => square.addEventListener('click', () => playGame(square.id)));
        }
        else if(gameWon == true){
            console.log('ran event remover');
            squareDIV.forEach(square => square.removeEventListener('click', () => playGame(square.id)));
        }
    }

    function playGame(target){            
        gameboard.changeState("X", target);
        gameState();       
        render();
    };

    function gameState(){
       for(id in winConditions){
       if(  gameboard.getState(winConditions[id][0]) == gameboard.getState(winConditions[id][1]) && 
            gameboard.getState(winConditions[id][0]) == gameboard.getState(winConditions[id][2]) && 
            gameboard.getState(winConditions[id][0]) != undefined){
                console.log("gameover");
                gameWon = true;
                bindSquares();
            }     
       }
    }

    //redraw DOM
    function render() {    
        for(let id in squareDIV)
        {
            let symbol = gameboard.getState(id);
            if(symbol === undefined) {
                squareDIV[id].innerText = "";
               
            }
            else{                
                squareDIV[id].innerText = symbol;
            }
        }
        if(gameWon == true)
        {          
            let HTML = document.createElement('div');
            HTML.className = 'winlose';
            HTML.innerText = 'game over';
            document.body.appendChild(HTML);
        }
    }
})();

const playerSelect = function(){

}();