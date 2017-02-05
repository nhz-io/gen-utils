function* astNodes(start, parent) {
    if (!start || typeof start !== 'object') {
        return
    }
    
    parent = parent || start._parent
 
    start._scope = start._scope || []
    
    if (start && start.type && start.range && start.range.length) {
        start._uid = Math.random().toString(36).slice(2)
        
        if (parent && parent._scope) {
            parent._scope.push(start._uid)
        }
        
        start._scope.push(start._uid)
        parent = start
        
        yield start
    }
    
    for (const value of values(start)) {
        if (value !== start._scope && value !== start._parent && value !== start.range) {
            value._scope = start._scope.slice()
            value._parent = parent
        
            yield* astNodes(value)
        }
    }    
}
