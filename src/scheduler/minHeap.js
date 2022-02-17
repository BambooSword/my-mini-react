export function peek(heap) {
  return heap.length === 0 ? null : heap[0]
}

export function push(heap, node) {
  const len = heap.length
  heap.push(node)
  bubbleUp(heap, node, len)
}

export function pop(heap) {
  if (heap.length === 0) {
    return null
  }
  const first = heap[0]
  const last = heap.pop()
  if (first !== last) {
    heap[0] = last
    bubbleDown(heap, 0)
  }
  return first
}

function bubbleDown(heap, i) {
  // console.log(heap)
  let index = i
  const len = heap.length
  while (index < len - 1) {
    const left = index * 2 + 1
    const right = left + 1
    let parentIndex = index

    if (left < len && compare(heap[parentIndex], heap[left]) > 0) {
      parentIndex = left
    }
    if (right < len && compare(heap[parentIndex], heap[right]) > 0) {
      parentIndex = right
    }
    if (parentIndex !== index) {
      const newParent = heap[parentIndex]
      heap[parentIndex] = heap[index]
      heap[index] = newParent
      index = parentIndex
    } else {
      break
    }
  }
}

function bubbleUp(heap, node, i) {
  let index = i
  while (index > 0) {
    const parentIndex = (index - 1) >> 1
    const parent = heap[parentIndex]
    if (compare(parent, node) > 0) {
      heap[parentIndex] = node
      heap[index] = parent
      index = parentIndex
    } else {
      break
    }
  }
}

function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex
  return diff !== 0 ? diff : a.id - b.id
  // return a - b
}

// function build(arr) {
//   if (arr.length < 2) return arr
//   for (let i = arr.length >> 1; i >= 0; i--) {
//     bubbleDown(arr, i)
//   }
// }
// const a = [9, 7, 4, 10, 12, 100, 6, 15, 1]
// build(a)
// while (1) {
//   if (a.length === 0) {
//     break
//   }
//   console.log('a', peek(a))
//   pop(a)
// }
