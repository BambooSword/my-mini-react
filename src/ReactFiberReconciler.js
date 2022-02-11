import { createFiber } from './ReactFiber'
import { isArray, isStringOrNumber, updateNode } from './utils'

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    // 更新属性
    console.log('更新属性')
    updateNode(wip.stateNode, wip.props)
  }
  console.log('wip in updateHostComponent', wip)
  // 遍历子节点

  reconcileChildren(wip, wip.props.children)
}

// 更新函数组件
export function updateFunctionComponent(wip) {
  const { type, props } = wip
  const children = type(props)
  reconcileChildren(wip, children)
}

export function updateClassComponent(wip) {
  const { type, props } = wip
  const instance = new type(props)
  const children = instance.render()
  reconcileChildren(wip, children)
}

function reconcileChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return
  }
  const newChildren = isArray(children) ? children : [children]
  let previousNewFiber = null // 记录上一次的fiber
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    const newFiber = createFiber(newChild, wip)

    if (i === 0) {
      wip.child = newFiber
    } else {
      previousNewFiber.sibling = newFiber
    }

    previousNewFiber = newFiber
  }
}
