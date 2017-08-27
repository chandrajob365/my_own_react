/** @jsx h */

// Diff start //

function updateElement ($parent, newNode, oldNode, index = 0) {
  console.log('$parent = ', $parent, ' \n newNode = ', newNode, ' \n oldNode = ', oldNode, ' \n index = ', index)
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    )
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    )
  } else if (changed(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    )
  } else if (newNode.type) {
    updateProps(
      $parent.children[index],
      newNode.props,
      oldNode.props
    )
    let newNodeLength = newNode.children.length
    let oldNodeLength = oldNode.children.length
    console.log('newNodeLength = ', newNodeLength, ' ---- ', ' oldNodeLength = ', oldNodeLength)
    console.log('\n========================================\n')
    for (let i = 0; i < newNodeLength || i < oldNodeLength; i++) {
      updateElement(
        $parent.children[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}

function changed (node1, node2) {
  return typeof node1 !== typeof node2 ||
          typeof node1 === 'string' && node1 !== node2 ||
          node1.type !== node2.type
}
// Diff end //

// Props related start //

function setProp ($target, name, value) {
  if (isCustomProp(name)) {
    return
  }
  if (name === 'className') {
    return $target.setAttribute('class', value)
  }
  if (typeof value === 'boolean') {
    return setBooleanProp($target, name, value)
  } else {
    return $target.setAttribute(name, value)
  }
}

function setProps ($target, props) {
  Object.keys(props).forEach(name => {
    setProp($target, name, props[name])
  })
}

function setBooleanProp ($target, name, value) {
  console.log('value = ', value)
  if (value) {
    $target.setAttribute(name, value)
    $target[name] = true
  } else {
    $target[name] = false
  }
}

function removeBooleanProp ($target, name) {
  $target.removeAttribute(name)
  $target[name] = false
}

function removeProp ($target, name, value) {
  if (isCustomProp) {
    return
  }
  if (name === 'className') {
    return $target.removeAttribute('class')
  }
  if (typeof value === 'boolean') {
    return removeBooleanProp($target, name)
  } else {
    return $target.removeAttribute(name)
  }
}

function updateProp ($target, name, newVal, oldVal) {
  if (!newVal) {
    return removeProp($target, name, oldVal)
  }
  if (!oldVal || newVal !== oldVal) {
    return setProp($target, name, newVal)
  }
}

function updateProps ($target, newProps, oldProps = {}) {
  let props = Object.assign({}, newProps, oldProps)
  Object.keys(props).forEach(name => {
    updateProp($target, name, newProps[name], oldProps[name])
  })
}
// Props related end //

// Event Handler related start //
function isCustomProp (name) {
  return isEventProp(name)
}

function isEventProp (name) {
  return /^on/.test(name)
}

function extractEventName (name) {
  return name.slice(2).toLowerCase()
}

function addEventListeners ($target, props) {
  Object.keys(props).forEach(name => {
    if (isEventProp(name)) {
      $target.addEventListener(
        extractEventName(name),
        props[name]
      )
    }
  })
}

// Event Handler related end //

function h (type, props, ...children) {
  return {type, props: props || {}, children}
}

function createElement (node) {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  }
  let $el = document.createElement(node.type)
  setProps($el, node.props)
  addEventListeners($el, node.props)
  node.children
      .map(createElement)
      .forEach($el.appendChild.bind($el))
  return $el
}

// const a = (
//   <ul>
//     <li>item 1</li>
//     <li>item 2</li>
//   </ul>
// )
//
// const b = (
//   <ul>
//     <li>text 1</li>
//     <li>hello!</li>
//   </ul>
// )

// const f = (
//   <ul style='list-style: none;'>
//     <li className='item'>item 1</li>
//     <li className='item'>
//       <input type='checkbox' checked={true} />
//       <input type='text' disabled={false} />
//     </li>
//   </ul>
// )
//
// const g = (
//   <ul style='list-style: none;'>
//     <li className='item item2'>item 1</li>
//     <li style='background: red;'>
//       <input type='checkbox' checked={false} />
//       <input type='text' disabled={true} />
//     </li>
//   </ul>
// )

const f = (
  <ul style='list-style: none;'>
    <li className='item' onClick={() => alert('hi!')}>item 1</li>
    <li className='item'>
      <input type='checkbox' checked={true} />
      <input type='text' onInput={log} />
    </li>
  </ul>
)

const g = (
  <ul style='list-style: none;'>
    <li className='item item2' onClick={() => alert('hi!')}>item 1</li>
    <li style='background: red;'>
      <input type='checkbox' checked={false} />
      <input type='text' onInput={log} />
    </li>
  </ul>
)

function log (e) {
  console.log(e.target.value)
}

const $root = document.getElementById('root')
const $reload = document.getElementById('reload')

$root.appendChild(createElement(f))
$reload.addEventListener('click', () => {
  updateElement($root, g, f)
})
