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
