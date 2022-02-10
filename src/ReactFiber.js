import { Placement } from "./utils"
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
  }

  return fiber
}
