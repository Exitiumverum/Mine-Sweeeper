'use strict'

//Global variables
var gBoard = []
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    markedMinesCount: 0,
    secsPassefd: 0,
    minesCount: 0
}


function onInit() {
    gGame.isOn = true
    gBoard = []
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
    // !!!change this loop according to the game level!!!
    for (let i = 0; i < 2; i++) {
        var cell = gBoard[+getRandomInt(0, +gLevel.SIZE)][+getRandomInt(0, +gLevel.SIZE)]
        console.log(cell)
        cell.isMine = true
        gGame.minesCount++
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
    console.log(iIndex, jIndex)

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
    console.log(mineNgCount)
    gBoard[iIndex][jIndex].mineNgs = mineNgCount
    return mineNgCount
}

function revealNgCells(elCell) {
    console.log(elCell)
    let iIndex = +elCell.dataset.i
    let jIndex = +elCell.dataset.j

    for (let i = iIndex - 1; i <= iIndex + 1; i++) {
        for (let j = jIndex - 1; j <= jIndex + 1; j++) {
            if (i < 0 || i > gLevel.SIZE - 1) continue
            if (j < 0 || j > gLevel.SIZE - 1) continue
            // if (i === iIndex && j === jIndex) continue
            let cell = gBoard[i][j]

            if (cell.isMine) continue

            console.log(i, j)
            cell.mineNgs = countNgMines(i, j)
            cell.isHidden = false
            elCell.classList.remove('hidden')
        }
    }
}


function clickCell(elCell) {
    // console.log(elCell)
    if (!gGame.isOn) return


    if (elCell.classList.contains('mine')) {
        elCell.classList.remove('hidden')
        gBoard[elCell.dataset.i][elCell.dataset.j].isHidden = false
        console.log('game over')
        gameLose()
        renderBoard()
        return
    }
    if (elCell.classList.contains('hidden')) {
        revealNgCells(elCell)
        renderBoard()
        console.log(elCell)
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
}

function handleRightClick(event) {
    if(!gGame.isOn) return
    checkGameOver()

    event.preventDefault()
    console.log('hy')

    let iCellIndex = event.target.dataset.i
    let jCellIndex = event.target.dataset.j
    let cell = gBoard[iCellIndex][jCellIndex]

    if (cell.isMine) gGame.markedMinesCount++

    console.log(gGame.markedMinesCount)

        gBoard[iCellIndex][jCellIndex].isMarked = true
    renderBoard()
    checkGameOver()
    // console.log(gBoard)
}

function checkGameOver() {
    if(gGame.markedMinesCount === gGame.minesCount){
        gGame.isOn = false
        console.log('victoryyyy')
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}