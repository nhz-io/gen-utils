function* consumedIdentifiers(...list) {
    if (list.length != 1) {
        return yield* regen(consumedIdentifiers, list)
    }
    
    const [nodes] = list
    
    for (const node of nodes) {
        if (node.type !== 'Identifier') {
            continue
        }
        
        const parent = node.parent
        
        switch(parent.type) {
            case 'VariableDeclarator':
                if (parent.init === node) {
                    yield node
                }
                
                break

            case 'MemberExpression': 
                if (parent.object === node) {
                    yield node
                }
                
                break
            
            case 'CallExpression':
                if (parent.arguments.includes(node)) {
                    yield node
                }
                
                break
            
            case 'AssignmentExpression':
                if (parent.right === node) {
                    yield node
                }
                
                break
            
            case 'LogicalExpression':
                if (parent.right === node) {
                    yield node
                }
                
                break
                
            default:
                console.log(
                    `>> Unhandled consumed identifier parent type: ${parent.type}`
                )
                
                break
        }
    }
}
