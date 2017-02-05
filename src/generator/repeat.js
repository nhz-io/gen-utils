function* repeat(...list) {
    let n = list.pop()
    const buffer = []
    
    for (const items of list) {
        for (const item of items) {
            buffer.push(item)
            yield item
        }
    }
    while (--n > 0) {
        yield* buffer
    }
}

function* repeatR(n, ...list) {
    return yield* repeat(...list, n)
}
