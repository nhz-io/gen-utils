function* flatten(...list) {
    for (const arr of list) {
        if (!arr || 
            typeof arr === 'string' || 
            typeof arr[Symbol.iterator] !== 'function'
        ) {
            yield arr
        }
        else {
            for (const item of arr) {
                if (!item || 
                    typeof item === 'string' || 
                    typeof item[Symbol.iterator] !== 'function'
                ) {
                    yield item
                }
                else {
                    yield* flatten(item)
                }
            }
        }
    }
}
