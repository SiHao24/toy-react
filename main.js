import { createElement} from 'toy-react'
for(let i of [1, 2, 3]) {
  console.log('i: ', i)
}

class CustomComponent {}

document.body.appendChild(<CustomComponent id='a' className='b'>
  <div className='child-a' />
  <div className='child-b' />
  <duv>sasasaassa</duv>
</CustomComponent>)