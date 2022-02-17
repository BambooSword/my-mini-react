import {
  ClassComponent,
  FunctionComponent,
  HostComponent,
  HostText,
  Fragment
} from './ReactWorkTags'
import { isUndefined, Placement, isStr, isFn } from './utils'
export function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type, // 类型
    key: vnode.key, // id
    props: vnode.props, //
    stateNode: null, // 原生标签 - DOM、class组件 - 实例
    child: null, // 第一个子fiber
    sibling: null, // 下一个兄弟fiber
    return: returnFiber, // father fiber
    flags: Placement, // 标记fiber任务类型，节点插入、更新、删除
    index: null,

    alternate: null, // older fiber
  }

  const { type } = vnode
  if (isStr(type)) {
    fiber.tag = HostComponent
  } else if (isFn(type)) {
    // 函数组件
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent
  } else if (isUndefined(type)) {
    fiber.tag = HostText
    fiber.props = { children: vnode }
  } else {
    console.log(vnode,'=====vnode======')
    fiber.tag = Fragment
  }

  return fiber
}
