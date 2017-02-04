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

function* uniq(list) {
    const seen = []

    for (const item of list) {
        if (seen.indexOf(item) === -1) {
            seen.push(item)
            
            yield item
        }
    }
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
