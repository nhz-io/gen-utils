function* providedIdentifiers(...list) {
    if (list.length != 1) {
        return yield* regen.call(this, providedIdentifiers, list)
    }
    
    const [nodes] = list
    
    for (const node of nodes) {
        if (node.type !== 'Identifier') {
            continue
        }
        
        const parent = node.parent
        
        switch(parent.type) {
            case 'AssignmentExpression':
                if (parent.left === node) {
                    yield node
                }
                
                break
                
            case 'VariableDeclarator':
                if (parent.id === node) {
                    yield node
                }
                
                break
            
            default:
                console.log(
                    `>> Unhandled provided identifier parent type: ${parent.type}`
                )
                
                break
        }
    }
}
