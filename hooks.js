let currentlyRenderingFiber = null
let workInProgressHook = null

export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  currentlyRenderingFiber.memorizedState = null
  workInProgressHook = null
}

// 获取当前hook
function updateWorkInProgress() {
  let hook
  const current = currentlyRenderingFiber.alternate
  if (current) {
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next
    } else {
      workInProgressHook = hook = workInProgressHook.next
    }
  } else {
    hook = {
      memorizedState: null,
      next: null,
    }
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook
    } else {
      workInProgressHook = workInProgressHook.next = hook
    }
  }
	return hook;
}
