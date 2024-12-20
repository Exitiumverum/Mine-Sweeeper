'use strict'

//Global variables
var gBoard = []
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    markedMinesCount: 0,
    minesCount: 0,
    firstClick: true
}
var gRevealedCells = []
// var gMinesCount = 0
function resetGame() {
    gBoard = []
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.markedMinesCount = 0
    gGame.firstClick = true

    document.querySelector('.marked-count').innerText = `marked:`

    resetTimer()
}

function onInit() {
    resetGame()
    buildBoard()
    renderBoard()
    // console.log(gBoard)
}

function createCell() {

    var cell = {
        // minesAroundCount: 0,
        isHidden: true,
        isMine: false,
        isMarked: false,
        mineNgs: 0
    }
    return cell
}

function buildBoard() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (let j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = createCell()
        }
    }
    // console.log(gBoard)

}

function generateMines(elCell) {
    for (let i = 0; i < gLevel.MINES; i++) {
        // console.log('elCell: ', elCell.dataset.i)
        // console.log('elCell: ', elCell.dataset.j)
        // // console.log('elCell: ', elCell)

        let iIndex = +getRandomInt(0, gLevel.SIZE - 1)
        let jIndex = +getRandomInt(0, gLevel.SIZE - 1)
        console.log('i j Index', iIndex, jIndex)

        while (iIndex === +elCell.dataset.i && jIndex === +elCell.dataset.j) {
            // console.log('i j Index', iIndex, jIndex)
            iIndex = +getRandomInt(0, gLevel.SIZE - 1)
            jIndex = +getRandomInt(0, gLevel.SIZE - 1)
        }

        var cell = gBoard[iIndex][jIndex]
        // console.log(cell)
        cell.isMine = true
        gGame.minesCount++
        // console.log(' mines: ', gGame.minesCount)
    }
    renderBoard()
}

function destroyMines() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].isMine = false
        }
    }
}

function renderCell(iIndex, jIndex) {
    var htmlStr = ''
    var cell = gBoard[iIndex][jIndex]

    htmlStr += `<td data-i="${iIndex}" data-j="${jIndex}" oncontextmenu="handleRightClick(event)" onclick="clickCell(this)" class="cell`
    if (cell.isHidden) htmlStr += ` hidden`

    if (cell.isMarked) htmlStr += `marked`

    if (cell.isMine) htmlStr += ` mine`

    var innerText = ''

    if (cell.isMarked) innerText = '🇨🇱'
    else if (cell.isHidden) innerText = ' '
    else if (cell.isMine) innerText = '💥'
    else innerText = cell.mineNgs

    htmlStr += `">${innerText}</td>\n`

    return htmlStr
}

function renderBoard() {
    var elTable = document.querySelector('.table .game-board')
    var htmlStr = ''

    for (let i = 0; i < gLevel.SIZE; i++) {
        htmlStr += `<tr>\n`
        for (let j = 0; j < gLevel.SIZE; j++) {
            var cell = renderCell(i, j)
            htmlStr += cell
        }
        htmlStr += `</tr>\n`
    }
    // console.log(htmlStr)
    elTable.innerHTML = htmlStr
}

function countNgMines(iIndex, jIndex) {
    let mineNgCount = 0
    // console.log(iIndex, jIndex)

    for (let i = iIndex - 1; i <= iIndex + 1; i++) {
        for (let j = jIndex - 1; j <= jIndex + 1; j++) {
            if (i < 0 || i > gLevel.SIZE - 1) continue
            if (j < 0 || j > gLevel.SIZE - 1) continue
            if (i === iIndex && j === jIndex) continue

            let cell = gBoard[i][j]
            // console.log(i, j, cell)

            if (cell.isMine) mineNgCount++
        }
    }
    // console.log(mineNgCount)
    gBoard[iIndex][jIndex].mineNgs = mineNgCount
    return mineNgCount
}

function revealCell(elCell, i, j) {
    let cell = gBoard[i][j]
    if (i < 0 || i > gLevel.SIZE - 1) return
    if (j < 0 || j > gLevel.SIZE - 1) return

    if (cell.isMine) return
    if (cell.isMarked) return

    // console.log(i, j)
    cell.mineNgs = countNgMines(i, j)
    cell.isHidden = false
    elCell.classList.remove('hidden')
    gRevealedCells.push([i, j])
}

function revealNgCells(elCell, iIndex, jIndex) {
    let lastRowIndex = gBoard.length - 1
    let lastColIndex = gBoard[lastRowIndex].length - 1
    let lastCell = gBoard[lastRowIndex][lastColIndex]

    //reveal all upper cells
    for (let i = iIndex; i >= 0; i--) {
        for (let j = jIndex; j >= 0; j--) {
            if (gBoard[i][j].isMine) {
                j = 0
                console.log(j)
                continue
                // i--
            }
            // if (i === iIndex && j === jIndex) continue
            revealCell(elCell, i, j)
            console.log(i, j)
        }
        for (let j = jIndex; j <= lastColIndex; j++) {
            if (gBoard[i][j].isMine) {
                j = lastColIndex
                console.log(j)
                continue
                // i--
            }
            // if (i === iIndex && j === jIndex) continue
            revealCell(elCell, i, j)
            console.log(i, j)
        }
        if (gBoard[i][jIndex].isMine) return
    }
    //reveal all lower cells
    for (let i = iIndex; i <= lastRowIndex; i++) {
        for (let j = jIndex; j >= 0; j--) {
            if (gBoard[i][j].isMine) {
                j = 0
                console.log(j)
                continue
                // i--
            }
            // if (i === iIndex && j === jIndex) continue
            revealCell(elCell, i, j)
            console.log(i, j)
        }
        for (let j = jIndex; j <= lastColIndex; j++) {
            if (gBoard[i][j].isMine) {
                j = lastColIndex
                console.log(j)
                continue
                // i--
            }
            // if (i === iIndex && j === jIndex) continue
            revealCell(elCell, i, j)
            console.log(i, j)
        }
        if (gBoard[i][jIndex].isMine) return
    }

}



function clickCell(elCell) {
    // console.log(elCell)
    if (!gGame.isOn) return



    if (gGame.firstClick) {
        destroyMines()
        startTimer()
        generateMines(elCell)
        // console.log ('mines:' , gGame.minesCount)
        // gGame.markedMinesCount = gLevel.MINES
        gGame.firstClick = false
        // gMinesCount = gGame.minesCount
    }

    if (elCell.classList.contains('mine')) {
        elCell.classList.remove('hidden')
        gBoard[elCell.dataset.i][elCell.dataset.j].isHidden = false
        console.log('game over')
        gameLose()
        renderBoard()
        return
    }
    if (elCell.classList.contains('hidden')) {
        let iIndex = +elCell.dataset.i
        let jIndex = +elCell.dataset.j
        revealNgCells(elCell, iIndex, jIndex)
        renderBoard()
        // console.log(elCell)
    }
}

function gameLose() {
    gGame.isOn = false
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            var cell = gBoard[i][j]
            var tableCell = document.querySelectorAll('.cell')
            // console.log(tableCell)
            if (cell.isMine) {
                cell.isHidden = false
                tableCell.forEach(cell => {
                    if (cell.classList.contains('mine'))
                        cell.classList.remove('hidden')
                })
            }
        }
    }
    clearInterval(gGame.timerInterval)
    openModal('Lose')
    onInit()
}

function handleRightClick(event) {
    event.preventDefault()

    if (!gGame.isOn) return
    if (gGame.firstClick) return


    gGame.markedCount++
    document.querySelector('.marked-count').innerText = `marked: ${gGame.markedCount}`
    checkGameOver()

    console.log('hy')

    let iCellIndex = event.target.dataset.i
    let jCellIndex = event.target.dataset.j
    let cell = gBoard[iCellIndex][jCellIndex]
    if (!cell.isHidden) return


    if (cell.isMine) {
        gGame.markedMinesCount++
        console.log('mine count: ', gGame.markedMinesCount, 'mines:', gLevel.MINES)
    }
    // console.log(gGame.markedMinesCount)

    gBoard[iCellIndex][jCellIndex].isMarked = true
    renderBoard()
    checkGameOver()
    // console.log(gBoard)
}

function checkGameOver() {
    if (gGame.markedMinesCount === gLevel.MINES) {
        clearInterval(gGame.timerInterval)
        openModal('VICTORY')
        console.log('victoryyyy')
        onInit()
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function openModal(innerText) {
    let modal = document.querySelector('.modal')

    document.querySelector('.modal p').innerText = innerText
    modal.style.display = 'block'
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none'
    onInit()
}

function startTimer() {
    gGame.startTime = new Date()
    gGame.timerInterval = setInterval(() => {
        const elapsedTime = new Date() - gGame.startTime
        const seconds = Math.floor(elapsedTime / 1000)
        const milliseconds = elapsedTime % 1000
        // Format milliseconds to always have 3 digits
        const formattedMilliseconds = milliseconds.toString().padStart(3, '0')
        document.querySelector('.timer').innerText = `Time: ${seconds}.${formattedMilliseconds}`
    }, 37)
}

function resetTimer() {
    clearInterval(gGame.timerInterval)
    document.querySelector('.timer').innerText = 'Time: '
}


function difficulityBtns(elBtn) {
    // console.log(elBtn)
    if (elBtn.classList.contains('hardcore-btn')) {
        gLevel.SIZE = 12
        gLevel.MINES = 32
        console.log('hardcore')
    }
    if (elBtn.classList.contains('tough-btn')) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
        console.log('tough')
    }
    if (elBtn.classList.contains('easy-btn')) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
        console.log('easy')
    }
    console.log(gLevel)

    gGame.firstClick = true
    onInit()
}