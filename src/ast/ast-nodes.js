function* astNodes(start) {
    if (start && start.type && start.range && start.range.length) {
        yield start
    }
    
    if (!start || typeof start !== 'object') {
        return
    }
    
    for (const value of values(start)) {
        yield* astNodes(value)
    }    
}