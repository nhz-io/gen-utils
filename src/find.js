function* find(list, fn) {
  let i = 0
  
  for (const item of list) {
    if (fn.call(this, item, i, list)) {
      return yield item
    }
  }
}

function* findR(fn, list) {
  yield* find(list, fn)
}
