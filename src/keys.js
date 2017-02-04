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
