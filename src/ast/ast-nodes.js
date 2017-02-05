function* astNodes(start) {
    start.scope = start.scope || []
    
    if (start && start.type && start.range && start.range.length) {
        start._uid = Math.random().toString(36).slice(2)
        start.scope.push(start)
        
        yield start
    }
    
    if (!start || typeof start !== 'object') {
        return
    }
    
    for (const value of values(start)) {
        if (value !== start.scope && value !== start.range) {
            value.scope = start.scope.slice()
        
            yield* astNodes(value)
        }
    }    
}
