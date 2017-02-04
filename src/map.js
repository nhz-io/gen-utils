function* map(list, fn) {
  let i = 0
  
  for (const item of list) {
    yield fn.call(this, item, i, list)
  }
}

function* mapR(fn, list) {
  yield* map(list, fn)
}
