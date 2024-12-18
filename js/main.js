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
    secsPassefd: 0
}


function onInit() {
    buildBoard()
    // console.log(gBoard)
    renderBoard()
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: true,
        isMarked: false
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
}

function renderCell(iIndex, jIndex) {
    var htmlStr = ''
    var cell = gBoard[iIndex][jIndex]

    htmlStr += `<td data-i="${iIndex}" data-j="${jIndex}" onclick="clickCell(this)" class="cell `
    if (cell.isShown) htmlStr += `class="shown `

    if (cell.isMarked) htmlStr += `marked `
    
    if (cell.isMine) htmlStr += `mine`

    var innerText = (cell.isMine) ? '💥' : ' '
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
    console.log(htmlStr)
    elTable.innerHTML = htmlStr
}

function countNgMines() {

}

function clickCell(elCell){
    console.log(elCell)
    if(elCell.classList.contains('mine')){
        console.log('game over')
    }
    
}