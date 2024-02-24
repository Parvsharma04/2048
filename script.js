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
            for(let j = 0; j<size; j++){
                const cell = document.querySelector(`[data-row="${i}"] [data-column="${j}"]`)
                const preValue = cell.dataset.value
                const currentValue = board[i][j]

                if(cell.dataset.value !== 0){
                    cell.dataset.value = currentValue
                    cell.currentValue = currentValue

                    if(currentValue !== parseInt(preValue) && !cell.classList.contains('new-tile')){
                        cell.classList.add('merged-tile')
                    }
                }
                else{
                    cell.textContent = ''
                    delete cell.dataset.value
                    cell.classList.remove('merged-tile', 'new-tile')
                }
            }
        }

        setTimeout(()=>{
            const cells = document.querySelectorAll('grid-cell')
            cells.forEach(cell=>{
                cell.classList.remove('merged-tile', 'new-tile')
            })
        }, 300)
    }

    function placeRandom(){
        const available = []
        for (let i = 0; i < size; i++) {
            for(let j = 0; j<size; j++){
                if(board[i][j] === 0){
                    available.push({x: i, y: j})
                }
            }
        }
        if(available.length > 0 ){
            const randomCell = available[Math.floor(Math.random() * available.length)]
            board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4
            const cell = document.querySelector(`[data-row="${randomCell.x}"] [data-column="${randomCell.y}"]`)
            cell.classList.add('new-tile')
        }
    }

    function move(direction){
        let hasChanged = false
        if(direction === 'ArrowUp' || direction === 'ArrowDown'){
            for(let j = 0; j<size; j++){
                const column = [...Array(size)].map((_, i)=>board[i][j])
                const newColumn = transform(column, direction === 'ArrowUp')
                for (let i = 0; i < size; i++) {
                    if(board[i][j] !== newColumn[i]){
                        hasChanged = true
                        board[i][j] = newColumn[i]
                    }
                }
            }
        }
        else if(direction === 'ArrowLeft' || direction === 'ArrowRight'){
            for (let i = 0; i < size; i++) {
                const row = board[i]
                const newRow = transform(row, direction === 'ArrowLeft')
                if(row.join(',') !== newRow.join(',')){
                    hasChanged = true
                    board[i] = newRow
                }
            }
        }
        if(hasChanged){
            placeRandom()
            renderBoard()
            checkGameOver()
        }
    }

    function transform(line, moveTowardsStart){
        let newLine = line.filter(cell => cell !== 0)
        if(!moveTowardsStart){
            newLine.reverse()
        }
        for(let i = 0; i<newLine.length - 1; i++){
            if(newLine[i] === newLine[i+1]){
                newLine *= 2
                updateScore(newLine[i])
                newLine.splice(i + 1, 1)
            }
        }
        while(newLine.length < size){
            newLine.push(0)
        }
        if(!moveTowardsStart){
            newLine.reverse()
        }
        return newLine;
    }


    function checkGameOver(){
        for(let i = 0; i<size; i++){
            for(let j = 0; j<size; j++){
                if(board[i][j] === 0)
                    return
                if(j < size-1 && board[i][j] == board[i][j+1])
                    return
                if(i < size-1 && board[i][j] == board[i+1][j])
                return
            }
        }
        gameOverEle.style.display='flex'
    }

    document.addEventListener('keydown', event=>{
        if(['ArrowUp'], ['ArrowDown'], ['ArrowLeft'], ['ArrowRight'].includes(event.key)){
            move(event.key)
        }
    })

    document.getElementById('restart-btn').addEventListener('click', restart)

    initializeGame()
})