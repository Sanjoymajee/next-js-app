"use client";
import { useState } from 'react'
import { toast, ToastOptions } from 'react-toastify'

interface BoardProps {
  player1: string
  player2: string
  rowInput: number
  colInput: number
  rangeInput: number
}

const Board = ({
  player1,
  player2,
  rowInput,
  colInput,
  rangeInput,
}: BoardProps) => {
  const createBoard = (rows: number, cols: number) => {
    const board: Array<Array<string>> = new Array(rows).fill(
      new Array(cols).fill(''),
    )
    return board
  }

  const findWinner = (matrix: string[][], ranges: number) => {
    const rows = matrix.length
    const cols = matrix[0].length
    const checkRange = (arr: string[]) => {
      let count = 1
      let prev = arr[0]
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] === prev && prev !== '') {
          count++
          if (count === ranges) {
            return prev
          }
        } else {
          count = 1
          prev = arr[i]
        }
      }
      return ''
    }
    for (let i = 0; i < rows; i++) {
      const row = matrix[i]
      const winner = checkRange(row)
      if (winner !== '') {
        return winner
      }
      for (let j = 0; j < cols; j++) {
        if (i + ranges <= rows) {
          const subMatrix = matrix.slice(i, i + ranges).map(r => r[j])
          const winner = checkRange(subMatrix)
          if (winner !== '') {
            return winner
          }
          if (j + ranges <= cols) {
            const diagonal = matrix.slice(i, i + ranges).map((r, k) => r[j + k])
            const winner = checkRange(diagonal)
            if (winner !== '') {
              return winner
            }
          }
          if (j - ranges >= -1) {
            const diagonal = matrix.slice(i, i + ranges).map((r, k) => r[j - k])
            const winner = checkRange(diagonal)
            if (winner !== '') {
              return winner
            }
          }
        }
      }
    }
    return ''
  }

  const resetBoard = (rows: number, cols: number, ranges: number) => {
    setRow(rows)
    setCol(cols)
    setRange(ranges)
    const newBoard = createBoard(rows, cols)
    setGameBoard(newBoard)
    setWinner('')
    setClickCount(0)
  }

  const isDraw = (matrix: string[][]) => {
    const rows = matrix.length
    for (let i = 0; i < rows; i++) {
      if (matrix[i].includes('')) return false
    }
    return true
  }

  const updateBoard = (
    rowIndex: number,
    colIndex: number,
    matrix: string[][],
    player: string,
  ) => {
    if (winner !== '') return null
    if (matrix[rowIndex][colIndex] !== '') return null
    setClickCount(clickCount + 1)
    const newBoard = matrix.map((row, rIndex) => {
      if (rowIndex !== rIndex) return row
      return row.map((col, cIndex) => {
        if (colIndex !== cIndex) return col
        return player
      })
    })
    setGameBoard(newBoard)
    return newBoard
  }

  const onMouseUpHandler = (rowIndex: number, colIndex: number) => {
    const newBoard = updateBoard(
      rowIndex,
      colIndex,
      gameBoard,
      clickCount % 2 ? player1 : player2,
    )
    if (!newBoard) return null
    const finalWinner = findWinner(newBoard, range)
    if (finalWinner !== '') {
      toastNotification(`${finalWinner} wins!`)
      setWinner(finalWinner)
    } else if (isDraw(newBoard)) {
      toastNotification('No one wins!')
      setWinner('No one')
    }
  }

  const invalidInput = (rows: number, cols: number, ranges: number) => {
    if (rows < 3 || cols < 3) {
      toastNotification('Rows and Columns must be greater than 3')
      return true
    }
    if (ranges > rows || ranges > cols) {
        toastNotification('Range must be less than or equal to rows and columns')
        return true
    }
    return false
  }

  const setChanges = (rows: number, cols: number, ranges: number) => {
    if(invalidInput(rows,cols,ranges)) return null
    setRow(rows)
    setCol(cols)
    setRange(ranges)
    resetBoard(rows, cols, ranges)
  }
  const [row, setRow] = useState(rowInput)
  const [col, setCol] = useState(colInput)
  const [range, setRange] = useState(rangeInput)
  const board = createBoard(row, col)
  const [clickCount, setClickCount] = useState(0)
  const [gameBoard, setGameBoard] = useState(board)
  const [winner, setWinner] = useState('')

  return (
    <>
      <div className='board'>
        <div className='board__title'>Tic-Tac-Toa</div>
        <div className='board__options'>
          <div className='input-options'>
            <label htmlFor='row-input'>Rows</label>
            <input
              type='number'
              id='row-input'
              value={row}
              min={3}
              inputMode='numeric'
              onChange={e => setChanges(parseInt(e.target.value), col, range)}
            />
          </div>
          <div className='input-options'>
            <label htmlFor='col-input'>Columns</label>
            <input
              type='number'
              id='col-input'
              value={col}
              min={3}
              inputMode='numeric'
              onChange={e => setChanges(row, parseInt(e.target.value), range)}
            />
          </div>
          <div className='input-options'>
            <label htmlFor='range-input'>Range</label>
            <input
              type='number'
              id='range-input'
              value={range}
              min={3}
              inputMode='numeric'
              onChange={e => setChanges(row, col, parseInt(e.target.value))}
            />
          </div>
        </div>
        {gameBoard.map((row, rowIndex) => (
          <div key={`r-${rowIndex}`} className='row'>
            {row.map((col, colIndex) => (
              <div
                key={`c-${colIndex}`}
                className={
                  col === player1
                    ? 'col p1-mark'
                    : col === player2
                    ? 'col p2-mark'
                    : 'col'
                }
                onMouseUp={() => onMouseUpHandler(rowIndex, colIndex)}
              >
                <p>{col}</p>
              </div>
            ))}
          </div>
        ))}
        <div
          className={
            winner === player1
              ? 'board__winner p1-mark'
              : winner === player2
              ? 'board__winner p2-mark'
              : 'board__winner'
          }
        >
          <h2>{winner ? winner.toUpperCase() + ' wins!' : ''}</h2>
        </div>
        <div className='board__reset'>
          <button
            onClick={() => {
              resetBoard(row, col, range)
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  )
}

const toastOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  draggable: true,
}

const toastNotification = (winner: string) => {
  toast.success(`${winner.toUpperCase()}`, { ...toastOptions })
}

export default Board