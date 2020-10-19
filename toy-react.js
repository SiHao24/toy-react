export function createElement(type, attributes, ...children) {
  let e
  if (typeof type === 'string') {
    e = document.createElement(type)
  } else {
    e = new type
  }
  // attributes is Object
  for (let p in attributes) {
    e.setAttribute(p, attributes[p])
  }

  // children is Array
  for(let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child)
    }
    e.appendChild(child)
  }

  return e
}