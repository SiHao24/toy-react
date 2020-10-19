import { createElement, Component, render } from './toy-react'
for(let i of [1, 2, 3]) {
  console.log('i: ', i)
}

class CustomComponent extends Component {
  render() {
    return <div>
      <h1>toy React</h1>
      {this.children}
    </div>
  }
}

render(<CustomComponent id='a' className='b'>
  <div className='child-a' />
  <div className='child-b' />
  <duv>sasasaassa</duv>
</CustomComponent>, document.body)