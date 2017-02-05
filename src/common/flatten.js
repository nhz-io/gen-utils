function* flatten(...list) {
    for (const item of list) {
        if (item && typeof item[Symbol.iterator] === 'function') {
            const list = item
            
            for (const item of list) {
                if (item && typeof item [Symbol.iterator] === 'function') {
                    yield* flatten(item)
                }
                else {
                    yield item
                }
            }
        }
        else {
            yield item
        }
    }
}
