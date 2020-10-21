// import { createElement, Component, render } from './toy-react'
// for(let i of [1, 2, 3]) {
//   console.log('i: ', i)
// }

// class CustomComponent extends Component {
//   constructor() {
//     super()
//     this.state = {
//       a: 1,
//       b: 2
//     }
//   }

//   render() {
//     return <div>
//       <h1>toy React</h1>
//       <button onclick={() => { this.setState({ a: this.state.a + 1 }) }}>add</button>
//       <p>{this.state.a.toString()}</p>
//       <p>{this.state.b.toString()}</p>
//     </div>
//   }
// }

// render(<CustomComponent id='a' className='b'>
//   <div>asss</div>
//   <div></div>
//   <div></div>
// </CustomComponent>, document.body)

import { createElement, Component, render } from './toy-react'
// class Square extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       value: null
//     }
//   }

//   render() {
//     return <button className='square' onclick={() => this.setState({ value: 'X' })}>{this.state.value}</button>
//   }
// }

// class Board extends Component {
//   renderSquare(i) {
//     return <Square />
//   }

//   render() {
//     const status = 'Next player: X'

//     return <div>
//       <div className='status'>{status}</div>
//       <div className='border-row'>
//         {this.renderSquare(0)}
//         {this.renderSquare(1)}
//         {this.renderSquare(2)}
//       </div>
//       <div className='border-row'>
//         {this.renderSquare(3)}
//         {this.renderSquare(4)}
//         {this.renderSquare(5)}
//       </div>
//       <div className='border-row'>
//         {this.renderSquare(6)}
//         {this.renderSquare(7)}
//         {this.renderSquare(8)}
//       </div>
//     </div>
//   }
// }

// class Game extends Component {
//   render() {
//     return <div className='game'>
//       <div className='game-board'>
//         <Board />
//       </div>
//       <div className='game-info'>
//         <div>{/* status */}</div>
//         <ol>{/* TODO */}</ol>
//       </div>
//     </div>
//   }
// }

// render(<Game />, document.getElementById('root'))

class Square extends Component {
  render() {
    return <button className='square' onClick={this.props.onClick}>
      {this.props.value}
    </button>
  }
}

class Board extends Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />
  }

  render() {
    return <div>
      <div className='board-row'>
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className='board-row'>
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className='board-row'>
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>
  }
}

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        { squares }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const movues = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'

      return<li key={move}>
        <button onClick={() => this.jumTo(move)}>{desc}</button>
      </li>
    })


    let status
    if (winner) {
      status = "Winner: " + winner
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O')
    }

    return <div className='game'>
      <div className='game-board'>
        <Board squares={current.squares} onClick={i => this.handleClick(i)} />
      </div>
      <div className='game-info'>
        <div>{status}</div>
        <div>{movues}</div>
      </div>
    </div>
  }
}

render(<Game />, document.getElementById('root'))

// let game = <Game />
// console.log(game.vdom)

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}
