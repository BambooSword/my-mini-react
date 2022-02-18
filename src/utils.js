// ! flags
export const NoFlags = /*                      */ 0b00000000000000000000

export const Placement = /*                    */ 0b0000000000000000000010 // 2
export const Update = /*                       */ 0b0000000000000000000100 // 4
export const Deletion = /*                     */ 0b0000000000000000001000 // 8

export function isStr(s) {
  return typeof s === 'string'
}

export function isStringOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number'
}

export function isFn(fn) {
  return typeof fn === 'function'
}

export function isUndefined(s) {
  return s === undefined
}

export function isArray(arr) {
  return Array.isArray(arr)
}

// old: {className:'red'}
// new: {id:'_id'}

export function updateNode(node, preVal, nextVal) {
  Object.keys(preVal).forEach(k => {
    if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase()
      node.removeEventListener(eventName, preVal[k])
    }
  })

  Object.keys(nextVal).forEach(k => {
    if (k === 'children') {
      // 有可能是文本
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + ''
      }
    } else if (k.slice(0, 2) === 'on') {
      const eventName = k.slice(2).toLocaleLowerCase()
      node.addEventListener(eventName, nextVal[k])
    } else {
      node[k] = nextVal[k]
    }
  })
}
