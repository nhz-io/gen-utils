function* filter(list, fn) {
    let i = 0

    for (const item of list) {
        if (fn.call(this, item, i, list)) {
            yield item
        }
    }
}

function* filterR(fn, list) {
    yield* filter(list, fn)
}
