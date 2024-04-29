document.addEventListener('DOMContentLoaded', () => {

    const gameSequence = ['a-2', 'a-3', 'a-4', 'b-1', 'b-2', 'b-3', 'b-4']
    let gameComplete = false

    /* --- Sliding Puzzle --- */
    const tiles = Array.from(document.querySelectorAll('.tiles .tile'))
    let gridAreas = tiles.map(el => el.dataset.area)
    let gridOptions = ['a-1', 'a-2', 'a-3', 'a-4', 'b-1', 'b-2', 'b-3', 'b-4']
    let emptyCell = gridOptions.find((el) => !gridAreas.includes(el))
    updateAnimations(emptyCell)

    tiles.forEach( elem => {
        elem.addEventListener('click', e => {

            if (gameComplete) {
                return 
            }

            let [dragRow, dragCol] = e.currentTarget.dataset.area.split('-')
            let [emptyRow, emptyCol] = emptyCell.split('-')
            dragCol = parseInt(dragCol)
            emptyCol = parseInt(emptyCol)

            // these conditions determine if the dragged
            // tile can be moved into the empty space
            let sameRow = (dragRow == emptyRow)
            let sameCol = (dragCol == emptyCol)
            let adjacentCol = (dragCol == (emptyCol - 1) || dragCol == (emptyCol + 1))

            // if so, reassign the tile to the empty space
            if ((sameRow && adjacentCol) || sameCol) {

                elem.classList.add('animating')
                elem.addEventListener('transitionend', e => {
                    
                    elem.classList.remove('animating')
                    elem.dataset.area = [emptyRow, emptyCol].join('-')
                    emptyCell = [dragRow, dragCol].join('-')
                    updateAnimations(emptyCell)
                    compareToSequence()
                })
            }
        })
    })
    function updateAnimations(emptyCell) {

        tiles.forEach(el => el.removeAttribute('data-animation'))

        let [emptyRow, emptyCol] = emptyCell.split('-')
        emptyCol = parseInt(emptyCol)

        let prevCol = (emptyCol - 1)
        let nextCol = (emptyCol + 1)
        let prevRow = String.fromCharCode(emptyRow.charCodeAt() - 1)
        let nextRow = String.fromCharCode(emptyRow.charCodeAt() + 1)

        prevCol = [emptyRow, prevCol].join('-')
        nextCol = [emptyRow, nextCol].join('-')
        prevRow = [prevRow, emptyCol].join('-')
        nextRow = [nextRow, emptyCol].join('-')

        prevCol = document.querySelector(`.tile[data-area="${prevCol}"]`)
        nextCol = document.querySelector(`.tile[data-area="${nextCol}"]`)
        prevRow = document.querySelector(`.tile[data-area="${prevRow}"]`)
        nextRow = document.querySelector(`.tile[data-area="${nextRow}"]`)

        if (prevCol) prevCol.dataset.animation = 'animate-tile-right'
        if (nextCol) nextCol.dataset.animation = 'animate-tile-left'
        if (prevRow) prevRow.dataset.animation = 'animate-tile-down'
        if (nextRow) nextRow.dataset.animation = 'animate-tile-up'
    }
    function compareToSequence() {
        let gridAreas = tiles.map(el => el.dataset.area)

        if (gridAreas.join(' ') == gameSequence.join(' ')) {

            if (!gameComplete) {
                document.querySelector('.emoji .hidden').classList.remove('hidden')
                gameComplete = true
            }
        }
    }
})