import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

let currentlyRenderingFiber = null
let workInProgressHook = null

export function renderWithHooks(wip) {
  console.log(currentlyRenderingFiber, wip, '❀🐯')
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memorizedState = null
  workInProgressHook = null
}

// 获取当前hook
function updateWorkInProgressHook() {
  let hook
  const current = currentlyRenderingFiber.alternate
  if (current) {
    currentlyRenderingFiber.memorizedState = current.memorizedState
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
    } else {
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState
    }
  } else {
    hook = {
      memorizedState: null,
      next: null,
    }
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook
    } else {
      workInProgressHook = currentlyRenderingFiber.memorizedState = hook
    }
  }
  return hook
}

export function useReducer(reducer, initialState) {
  const hook = updateWorkInProgressHook()
  console.log('hello reducer', currentlyRenderingFiber)
  if (!currentlyRenderingFiber.alternate) {
    // initial
    hook.memorizedState = initialState
  } else {
    // update
  }

  // const dispatch = () => {
  //   hook.memorizedState = reducer(hook.memorizedState)
  //   console.log('disPatch', currentlyRenderingFiber, hook.memorizedState)
  //   currentlyRenderingFiber.alternate = { ...currentlyRenderingFiber }
  //   scheduleUpdateOnFiber(currentlyRenderingFiber)
  // }
  const dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    hook,
    reducer
  )
  return [hook.memorizedState, dispatch]
}
export function useState(initialState) {
  const hook = updateWorkInProgressHook()
  console.log('hello reducer', currentlyRenderingFiber)
  if (!currentlyRenderingFiber.alternate) {
    // initial
    hook.memorizedState = initialState
  }
  const setState = runSetState.bind(null, currentlyRenderingFiber, hook)

  return [hook.memorizedState, setState]
}

function dispatchReducerAction(fiber, hook, reducer) {
  hook.memorizedState = reducer(hook.memorizedState)
  fiber.alternate = { ...fiber }
  fiber.sibling = null
  scheduleUpdateOnFiber(fiber)
  // fiber.sibling =
}
function runSetState(fiber, hook, val) {
  hook.memorizedState = val
  fiber.alternate = { ...fiber }
  fiber.sibling = null
  scheduleUpdateOnFiber(fiber)
  // fiber.sibling =
}
