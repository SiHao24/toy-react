const RENDER_TO_DOM = Symbol("render to dom")
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    // [\s\S]+ 表示所有字符
    if (name.match(/^on([\s\S]+)$/)) {
      // RegExp.$1
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLocaleLowerCase()), value)
    } else {
      if (name === 'className') {
        this.root.setAttribute('class', value)
      } else {
        this.root.setAttribute(name, value)
      }
    }
  }
  appendChild(component) {
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
    // this.root.appendChild(component.root)
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(conetnt) {
    this.root = document.createTextNode(conetnt)
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
    this._range = null
  }

  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }

  // get root() {
  //   if (!this._root) {
  //     this._root = this.render().root
  //   }

  //   return this._root
  // }

  // DOM Range API

  // _renderToDOM(range) {
  //   this.render()._renderToDOM(range)
  // }

  [RENDER_TO_DOM](range) {
    this._range = range
    this.render()[RENDER_TO_DOM](range)
  }

  // 重新绘制
  rerender() {
    // 保存老得range
    let oldRange = this._range
    // 创建新的range 把它设成老得range的start
    let range = document.createRange()
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset)
    // 完成插入
    this[RENDER_TO_DOM](range)

    // 老range的start挪到插入的内容之后
    oldRange.setStart(range.endContainer, range.endOffset)
    // 删除
    oldRange.deleteContents()
  }

  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState
      this.rerender()

      return
    }
    let merge = (oldState, newState) => {
      for(let p in newState) {
        if (oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p]
        } else {
          merge(oldState[p], newState[p])
        }
      }
    }

    merge(this.state, newState)
    this.rerender()
  }
}

export function createElement(type, attributes, ...children) {
  let e
  if (typeof type === 'string') {
    e = new ElementWrapper(type)
  } else {
    e = new type
  }
  // attributes is Object
  for (let p in attributes) {
    e.setAttribute(p, attributes[p])
  }

  // children is Array
  let insertChild = children => {
    for(let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }

      if (child === null) { continue }
  
      if (typeof child === 'object' && (child instanceof Array)) {
        insertChild(child)
      } else {
        e.appendChild(child)
      }
    }
    
  }
  insertChild(children)
  return e
}

export function render(component, parentElement) {
  let range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[RENDER_TO_DOM](range)
}