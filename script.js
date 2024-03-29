document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid')
    const done = document.querySelector('#game-finished')
    const heading = document.querySelector('.heading')
    let continuePlay = false
    const size = 4
    const celebration = document.querySelector('.confetti')
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

        if(currentScore > highScore){
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

    function renderBoard() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                const prevValue = cell.dataset.value;
                const currentValue = board[i][j];
                if (currentValue !== 0) {
                    cell.dataset.value = currentValue;
                    cell.textContent = currentValue;
                    // Animation handling
                    if (currentValue !== parseInt(prevValue) && !cell.classList.contains('new-tile')) {
                        cell.classList.add('merged-tile');
                    }
                } else {
                    cell.textContent = '';
                    delete cell.dataset.value;
                    cell.classList.remove('merged-tile', 'new-tile');
                }
            }
        }


        setTimeout(()=>{
            const cells = document.querySelectorAll('.grid-cell')
            cells.forEach(cell=>{
                cell.classList.remove('merged-tile', 'new-tile')
            })
        }, 300)
    }

    function placeRandom() {
        const available = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    available.push({ x: i, y: j });
                }
            }
        }

        if (available.length > 0) {
            const randomCell = available[Math.floor(Math.random() * available.length)];
            board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
            const cell = document.querySelector(`[data-row="${randomCell.x}"][data-col="${randomCell.y}"]`);
            cell.classList.add('new-tile'); // Animation for new tiles
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
            checkWin()
        }
    }

    function checkWin(){
        for(let i = 0; i<size; i++){
            for(let j = 0; j<size; j++){
                if(board[i][j] == 2048 && !continuePlay){
                    celebration.style.display = 'flex'
                    done.style.display = 'flex'
                }
            }
        }
    }

    function transform(line, moveTowardsStart) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                updateScore(newLine[i]); // Update score when tiles merged
                newLine.splice(i + 1, 1);
            }
        }
        while (newLine.length < size) {
            newLine.push(0);
        }
        if (!moveTowardsStart) {
            newLine.reverse();
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
        if(['ArrowUp' ,'ArrowDown' ,'ArrowLeft' ,'ArrowRight'].includes(event.key)){
            move(event.key)
        }
    })
    function restartAfterWin(){
            done.style.display = 'none';
            celebration.style.display = 'none'
            restart()
    }
    document.getElementById('restart-btn').addEventListener('click', restart)
    document.querySelector('.restart-btn').addEventListener('click', restartAfterWin)

    document.querySelector('#continue-btn').addEventListener('click', ()=>{
            done.style.display = 'none';
            celebration.style.display = 'none'
            continuePlay = true
    })
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    document.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        const swipeThreshold = 50; // You can adjust this threshold based on your needs

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    // Swipe right
                    move('ArrowRight');
                } else {
                    // Swipe left
                    move('ArrowLeft');
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > swipeThreshold) {
                if (deltaY > 0) {
                    // Swipe down
                    move('ArrowDown');
                } else {
                    // Swipe up
                    move('ArrowUp');
                }
            }
        }
    });

    document.getElementById('restart-btn').addEventListener('click', restart);

    document.querySelector('.restart-btn').addEventListener('click', restartAfterWin);

    document.querySelector('#continue-btn').addEventListener('click', () => {
        done.style.display = 'none';
        celebration.style.display = 'none';
        continuePlay = true;
    });
    initializeGame()
})