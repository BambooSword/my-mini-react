import { isFn, isStr, Placement, Update, updateNode } from './utils'
import {
  ClassComponent,
  FunctionComponent,
  HostComponent,
  HostText,
  Fragment,
} from './ReactWorkTags'

import {
  updateHostComponent,
  updateFunctionComponent,
  updateClassComponent,
  updateText,
  updateFragmentComponent,
} from './ReactFiberReconciler'

import { scheduleCallback } from './scheduler'
// work in progress
let wip = null
let wipRoot = null

export function scheduleUpdateOnFiber(fiber) {
  wip = fiber
  wipRoot = fiber
  scheduleCallback(workLoop)
}

// 1. 执行当前wip任务
// 2. 更新wip
function performUnitOfWork() {
  const { tag } = wip
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip)
      break
    case FunctionComponent:
      updateFunctionComponent(wip)
      break
    case ClassComponent:
      updateClassComponent(wip)
      break
    case HostText:
      updateText(wip)
    case Fragment:
      updateFragmentComponent(wip)

    default:
      break
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
function workLoop() {
  while (wip) {
    performUnitOfWork()
  }
  if (!wip && wipRoot) {
    commitRoot()
  }
}

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

  if (flags & Placement && stateNode) {
    parentNode.appendChild(stateNode)
  }
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate.props, wip.props)
  }
  //
  if (wip.deletions) {
    commitDeletion(wip.deletions, stateNode || parentNode)
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

/**
 * delete the oldChildrenNode from parentNode
 * @param {fiber[]} deletions
 * @param {node} parentNode
 */

function commitDeletion(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    const deletion = deletions[i]
    parentNode.removeChild(getStateNode(deletion))
  }
}

/**
 * find the stateNode of the fiber or the fiber's child
 * @param {fiber} fiber 
 * @returns 
 */
function getStateNode(fiber) {
  let tem = fiber
  while (!tem.stateNode) {
    tem = tem.child
  }

  return tem.stateNode
}
