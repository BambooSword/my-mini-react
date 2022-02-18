import { renderWithHooks } from './hooks'
import { createFiber } from './ReactFiber'
import { isArray, isStringOrNumber, updateNode, Update } from './utils'

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    // 更新属性
    updateNode(wip.stateNode, {}, wip.props)
  }
  // 遍历子节点
  reconcileChildren(wip, wip.props.children)
}

// 更新函数组件
export function updateFunctionComponent(wip) {
  renderWithHooks(wip)
  const { type, props } = wip
  const children = type(props)
  reconcileChildren(wip, children)
}

export function updateText(wip) {
  wip.stateNode = document.createTextNode(wip.props.children)
}
export function updateFragmentComponent(wip) {
  reconcileChildren(wip, wip.props.children)
}

export function updateClassComponent(wip) {
  const { type, props } = wip
  const instance = new type(props)
  const children = instance.render()
  reconcileChildren(wip, children)
}

function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions
  if (deletions) {
    returnFiber.deletions.push(childToDelete)
  } else {
    returnFiber.deletions = [childToDelete]
  }
}

function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return
  }
  const newChildren = isArray(children) ? children : [children]
  let previousNewFiber = null // 记录上一次的fiber
  let oldFiber = wip.alternate?.child
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    const newFiber = createFiber(newChild, wip)

    const same = sameNode(newFiber, oldFiber)
    if (same) {
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update,
      })
    }
    if (!same && oldFiber) {
      // 删除节点
      deleteChild(wip, oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (i === 0) {
      wip.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }

    previousNewFiber = newFiber
  }
}

function sameNode(a, b) {
  // 1. 同一层级 ：下面这里没判断
  // 2. 相同类型
  // 3. 相同的key
  return a && b && a.type === b.type && a.key === b.key
}
