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

function* keys(target) {
    if (typeof target === 'undefined') {
        return yield* []
    }
    
    if (typeof target !== 'object') {
        return yield* []
    }
        
    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            yield key
        }
    }
}

function* map(list, fn) {
    let i = 0

    for (const item of list) {
        yield fn.call(this, item, i, list)
    }
}

function* mapR(fn, list) {
    yield* map(list, fn)
}

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

function* take(list, n) {
    for(const item of list) {
        if (n-- > 0) {
            yield item
        }
        else {
            return
        }
    }
}

function* takeR(n, list) {
    yield* take(list, n)
}

function* uniq(...list) {
    const seen = []
    
    for (const items of list) {
        for (const item of items) {
            if (seen.indexOf(item) === -1) {
                seen.push(item)
                
                yield(item)
            }
        }
    }
}

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

function* values(target) {
    if (typeof target === 'undefined') {
        return yield* []
    }
    
    if (typeof target !== 'object') {
        return yield* [target]
    }
    
    if (Array.isArray(target)) {
        return yield* target
    }
    
    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            yield target[key]
        }
    }
}

function* recurring(...list) {
    const seen = []
    const yielded = []
    
    for (const items of list) {
        for (const item of items) {
            if (seen.indexOf(item) > -1) {
                if (yielded.indexOf(item) < 0) {
                    yielded.push(item)
                    
                    yield item
                }
            }
            else {
                seen.push(item)
            }
        }
    }
}
            
