function* reject(list, fn) {
  let i = 0
  
  for (const item of list) {
    if (!fn.call(this, item, i, list)) {
      yield item
    }
  }
}

function* rejectR(fn, list) {
  yield* reject(list, fn)
}
