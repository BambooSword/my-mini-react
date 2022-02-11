import { isFn, isStr, Placement } from './utils'
import {
  updateHostComponent,
  updateFunctionComponent,
  updateClassComponent,
} from './ReactFiberReconciler'
// work in progress
let wip = null
let wipRoot = null

export function scheduleUpdateOnFiber(fiber) {
  wip = fiber
  wipRoot = fiber
}

// 1. 执行当前wip任务
// 2. 更新wip
function performUnitOfWork() {
  const { type } = wip
  if (isStr(type)) {
    updateHostComponent(wip) // 1
  } else if (isFn(type)) {
    // 函数组件
    type.prototype.isReactComponent
      ? updateClassComponent(wip)
      : updateFunctionComponent(wip)
  }
  // 2
  // 深度优先遍历
  if (wip.child) {
    wip = wip.child
    return
  }

  let next = wip

  while (next) {
    if (next.sibling) {
      wip = next.sibling
      return
    }
    next = next.return
  }
  wip = null
}

function workLoop(IdleDeadline) {
  while (wip && IdleDeadline.timeRemaining() > 0) {
    performUnitOfWork()
  }
  if (!wip && wipRoot) {
    commitRoot()
  }
}

requestIdleCallback(workLoop)

function commitRoot() {
  commitWorker(wipRoot)
  wipRoot = null // 执行完置空，否则会死循环
}

function commitWorker(wip) {
  if (!wip) return
  // 1. 更新自己
  const { flags, stateNode } = wip
  // 由于函数组件不是真实节点，所以wip.return.stateNode可能为null，我们要写一个函数来获取真正的dom意义上的父节点
  let parentNode = getParentNode(wip.return) // wip.return.stateNode

  console.log('flags & Placement', flags)
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode)
  }
  // 2. 更新子节点
  commitWorker(wip.child)
  // 3.更新兄弟节点
  commitWorker(wip.sibling)
}

function getParentNode(wip) {
  let tem = wip
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode
    }
    tem = tem.return
  }
}
