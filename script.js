
//gameboard array
const gameboard = (() => {
    let board = ["","","","","","","","",""];
    
    const changeState = function(player, index){
        board[index] = player;
    };

    const getState = function (index) {
        return board[index];
    }
    return {changeState, getState};
})();

//factory function creates the players and keeps their score
const player = (name, symbol) => {
    let turn;
    const setTurn = () => {
        turn = !turn || true;
    }
    const isTurn = () => {
        return{turn}
    };
    return{name, symbol, setTurn, isTurn};
};


//module handle game logic
const game = (() => {
    //cache DOM
    const square = document.querySelectorAll('.square');    
    //bind event   
    
    square.forEach(square => square.addEventListener('click', () => playGame(square.id)));

    function playGame(target){      
                
        gameboard.changeState("X", target);       
        render();
    };
       
    //redraw DOM
    function render() {
    
        for(let id in square)
        {
            square[id].innerText = gameboard.getState(id);
        }
    }
})();