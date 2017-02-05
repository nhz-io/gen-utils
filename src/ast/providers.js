function* providers(...list) {
    for (const node of providedIdentifiers(...list)) {
        const parent = node.parent
        
        switch(parent.type) {
            case 'AssignmentExpression':
                if (parent.parent.type === 'ExpressionStatement') {
                    yield parent.parent
                }
                
                break
            
            case 'VariableDeclarator':
                if (parent.parent.type === 'VariableDeclaration') {
                    yield parent.parent
                }
                
                break
            
            default:
                console.log(
                    `>> Unhandled provider type: ${parent.type}`
                )
                
                break
        }
    }
}
