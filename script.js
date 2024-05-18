document.addEventListener('DOMContentLoaded', () => {

    let puzzleSolved = false
    const puzzleSolution = ['a-2', 'a-3', 'a-4', 'b-1', 'b-2', 'b-3', 'b-4']
    const spaces = ['a-1', 'a-2', 'a-3', 'a-4', 'b-1', 'b-2', 'b-3', 'b-4']

    const tiles = Array.from(document.querySelectorAll('.tile'))
    let filledSpaces = tiles.map(el => el.dataset.area)
    let emptyCell = spaces.find(el => !filledSpaces.includes(el))
    resetAnimations(emptyCell)

    tiles.forEach( elem => {
        elem.addEventListener('click', e => {

            if (puzzleSolved) {
                return 
            }

            let [row, col] = e.currentTarget.dataset.area.split('-')
            let [emptyRow, emptyCol] = emptyCell.split('-')
            col = parseInt(col)
            emptyCol = parseInt(emptyCol)

            // these conditions determine if the clicked
            // tile can be moved into the empty space
            let sameRow = (row == emptyRow)
            let sameCol = (col == emptyCol)
            let adjacentCol = (col == (emptyCol - 1) || col == (emptyCol + 1))

            // if so, reassign the tile to the empty space
            if ((sameRow && adjacentCol) || sameCol) {

                elem.classList.add('animating')
                elem.addEventListener('transitionend', e => {
                    
                    elem.classList.remove('animating')
                    elem.dataset.area = [emptyRow, emptyCol].join('-')
                    emptyCell = [row, col].join('-')
                    resetAnimations(emptyCell)
                    isPuzzleSolved()
                })
            }
        })
    })
    // comment
    function resetAnimations(emptyCell) {

        tiles.forEach(el => el.removeAttribute('data-animation'))

        // Exit early without setting animations if game is over
        if (puzzleSolved) return

        let [emptyRow, emptyCol] = emptyCell.split('-')
        emptyCol = parseInt(emptyCol)

        // Assembling all possible adjacent spaces
        let prevCol = (emptyCol - 1)
        let nextCol = (emptyCol + 1)
        let prevRow = String.fromCharCode(emptyRow.charCodeAt() - 1)
        let nextRow = String.fromCharCode(emptyRow.charCodeAt() + 1)

        prevCol = [emptyRow, prevCol].join('-')
        nextCol = [emptyRow, nextCol].join('-')
        prevRow = [prevRow, emptyCol].join('-')
        nextRow = [nextRow, emptyCol].join('-')

        // Adding relevant animations to adjacent tiles
        prevCol = document.querySelector(`.tile[data-area="${prevCol}"]`)
        nextCol = document.querySelector(`.tile[data-area="${nextCol}"]`)
        prevRow = document.querySelector(`.tile[data-area="${prevRow}"]`)
        nextRow = document.querySelector(`.tile[data-area="${nextRow}"]`)

        if (prevCol) prevCol.dataset.animation = 'animate-tile-right'
        if (nextCol) nextCol.dataset.animation = 'animate-tile-left'
        if (prevRow) prevRow.dataset.animation = 'animate-tile-down'
        if (nextRow) nextRow.dataset.animation = 'animate-tile-up'
    }
    // comment
    function isPuzzleSolved() {
        let tileOrder = tiles.map(el => el.dataset.area)

        if (tileOrder.join(' ') == puzzleSolution.join(' ')) {
            if (!puzzleSolved) {

                puzzleSolved = true
                document.querySelector('.emoji .hidden').classList.remove('hidden')

                let audio = new Audio('./audio/godfather.ogg')
                audio.play()
            }
        }
    }
})