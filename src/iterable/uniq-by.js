function* uniqBy(...list) {
    const seen = []    
    const diff = list.pop()
    
    if (typeof diff === 'function') {
        for (const items of list) {
            for (const item of items) {
                if (diff.call(this, item, seen)) {
                    yield item
                }
            }
        }
    }
    else {
        for (const items of list) {
            for (const item of items) {
                const key = item[diff]
                
                if (seen.indexOf(key) === -1) {
                    seen.push(key)
                    
                    yield item
                }
            }
        }
    }
}

function* uniqByR(diff, ...list) {
    return yield* uniqBy(...list, diff)
}
