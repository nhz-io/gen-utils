function* buffer(...list) {
    const buff = list.pop()
    
    for (const items of list) {
        for (const item of items) {
            buff.push(item)
            yield item
        }
    }
}

function* bufferR(buff, ...list) {
    return yield* buffer(...list, buff)
}
