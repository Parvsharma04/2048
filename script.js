document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const size = 4
    let board = []
    let currentScore = 0
    const currentScoreEle = document.getElementById('current-score')
    let highScore = localStorage.getItem('2048-highscore') || 0
    const highScoreEle = document.getElementById('high-score')
    highScoreEle.textContent = highScore

    const gameOverEle = document.getElementById('game-over')

    function updateScore(value){
        currentScore+=value
        currentScoreEle.textContent = currentScore

        if(currentScore > highscore){
            highScore = currentScore
            highScoreEle.textContent = highScore
            localStorage.setItem('2048-highscore', highScore)
        }
    }

    function restart(){
        currentScore = 0
        currentScoreEle.textContent = '0'
        gameOverEle.style.display = 'none'

        initializeGame()
    }

    function initializeGame(){
        board = [...Array(size)].map(e=> Array(size).fill(0))
        placeRandom()
        placeRandom()
        renderBoard()
    }

    function renderBoard(){
        for(let i = 0; i<size;  i++){
            for(let j = 0; j<size; j++)
        }
    }
})