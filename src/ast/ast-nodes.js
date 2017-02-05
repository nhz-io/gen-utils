function* astNodes(start) {
    start._scope = start._scope || []
    
    if (start && start.type && start.range && start.range.length) {
        start._uid = Math.random().toString(36).slice(2)
        
        if (start._parent && start._parent._scope) {
            start._parent._scope.push(start._uid)
        }
        
        start._scope.push(start._uid)
        
        yield start
    }
    
    if (!start || typeof start !== 'object') {
        return
    }
    
    for (const value of values(start)) {
        if (value !== start._scope && value !== start.range) {
            value._scope = start._scope.slice()
            value._parent = start
        
            yield* astNodes(value)
        }
    }    
}
