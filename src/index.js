import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const SIZE = 49;
const ROW_LENGTH = 7;
const ROW_NUM = SIZE / ROW_LENGTH;
var HALL_OF_CHADS = []

function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(SIZE).fill(null),
      xNext: true,
      currentPiece: null,
      pieceIndex: null,
    };
    this.makeBoard(ROW_LENGTH, SIZE)
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    var valid = false;
    var capture = false;
    var opponent = (this.state.xNext) ? 'O' : 'X';
    var end = (this.state.xNext) ? 1 : ROW_NUM;
    var side = (this.state.xNext) ? 1 : -1;
    var alphaMode = false;
    if (calculateWinner(squares)) {return;}

    if(squares[i] && !this.state.currentPiece){
      if((this.state.xNext && squares[i] === 'X') || (!this.state.xNext && squares[i] === 'O')) {
        this.setState({
          currentPiece: squares[i],
          pieceIndex: i,
        })
      }
    }

    alphaMode = HALL_OF_CHADS.includes(this.state.pieceIndex)

    if(!squares[i] && this.state.currentPiece) {
      if(i === (this.state.pieceIndex + side * (ROW_LENGTH + 1)) || i === (this.state.pieceIndex + side * (ROW_LENGTH - 1))) {
        valid = true
      }
      if(i === (this.state.pieceIndex + side * 2 * (ROW_LENGTH + 1)) || i === (this.state.pieceIndex + side * 2 * (ROW_LENGTH - 1))) {
        if(squares[(this.state.pieceIndex + i) / 2] === opponent) {
          capture = true;
        }
      }

      if(alphaMode) {
        if(i === (this.state.pieceIndex + (ROW_LENGTH + 1)) || i === (this.state.pieceIndex + (ROW_LENGTH - 1)) || i === (this.state.pieceIndex - (ROW_LENGTH + 1)) || i === (this.state.pieceIndex - (ROW_LENGTH - 1)) ) {
          valid = true
        }
        if(i === (this.state.pieceIndex + 2 * (ROW_LENGTH + 1)) || i === (this.state.pieceIndex + 2 * (ROW_LENGTH - 1)) || i === (this.state.pieceIndex - 2 * (ROW_LENGTH + 1)) || i === (this.state.pieceIndex - 2 * (ROW_LENGTH - 1))) {
          if(squares[(this.state.pieceIndex + i) / 2] === opponent) {
            capture = true;
          }
        }
      }

      if(capture) {
        squares[(this.state.pieceIndex + i) / 2] = null
        if(HALL_OF_CHADS.includes((this.state.pieceIndex + i) / 2)) {
          HALL_OF_CHADS.splice(HALL_OF_CHADS.indexOf((this.state.pieceIndex + i) / 2), 1)
        }
      }
      if(capture || valid) {
        if(alphaMode) {
          HALL_OF_CHADS[HALL_OF_CHADS.indexOf(this.state.pieceIndex)] = i
        }
        else if((i / ROW_LENGTH) < (ROW_NUM / end) && (ROW_NUM / end) - 1 < (i / ROW_LENGTH)) {
          HALL_OF_CHADS.push(i)
        }
        squares[i] = this.state.currentPiece
        squares[this.state.pieceIndex] = null
        this.setState({
          currentPiece: null,
          xNext: !this.state.xNext,
          squares: squares,
        })
      }
    }
  }

  renderSquare(i) {
    return (<Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
    />);
  }

  rowMaker() {
    var happySquares = []
    var happyBoard = []
    for(var j = 0; j < SIZE / ROW_LENGTH; j++) {
      for(var i = 0; i < ROW_LENGTH; i++) {
        happySquares.push(this.renderSquare(j * ROW_LENGTH + i))
      }
      happyBoard.push(<div className="board-row">{happySquares}</div>)
      happySquares = []
    }
    return (
      <>
        {happyBoard}
      </>
    )
  }

  makeBoard() {
    var rows = SIZE / ROW_LENGTH;
    for(var j = 0; j < rows; j++) {
      for(var i = 0; i < ROW_LENGTH; i++) {
        if(j === 0 || j === 1) {
          this.state.squares[i + j * ROW_LENGTH] = ((i + j) % 2 === 0) ? 'X' : null;
        }
        else if(j === rows - 1 || j === rows - 2) {
          this.state.squares[i + j * ROW_LENGTH] = ((i + j) % 2 === 0) ? 'O' : null;
        }
      }
    }
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="status">{status}</div>
        {this.rowMaker()}
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{}</div>
          <ol>{}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  var xCount = 0;
  var oCount = 0;
  for (var i = 0; i < SIZE; i++) {
    if(squares[i] === 'X') {
      xCount = xCount + 1;
    }
    if(squares[i] === 'O') {
      oCount = oCount + 1;
    }
  }
  if(xCount === 0) {
    return 'O'
  }
  if(oCount === 0) {
    return 'X'
  }
  return null;
}
