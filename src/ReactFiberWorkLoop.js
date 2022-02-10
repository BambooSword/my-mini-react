import { isStr, Placement } from './utils'
import { updateHostComponent } from './ReactFiberReconciler'
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
  let parentNode = wip.return.stateNode
	console.log('flags & Placement', flags)
  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode)
  }
  // 2. 更新子节点
  commitWorker(wip.child)
  // 3.更新兄弟节点
  commitWorker(wip.sibling)
}
