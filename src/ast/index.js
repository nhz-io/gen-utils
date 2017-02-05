const scopedTypes = [
    'Program',
    'FunctionDeclaration',
    'FunctionExpression',
    'BlockStatement',
]

const rejectedKeys = [
    'scope',
    'parent',
    'range',
]

function* astNodes(start, parent) {
    if (!start || typeof start !== 'object') {
        return
    }

    parent = parent || start.parent || {}

    if (start.type && start.range && start.range.length) {
        start.parent = parent
        
        if (!start.hasOwnProperty('scope')) {
            if (scopedTypes.indexOf(start.type) !== -1) {
                let _scope = [start]

                Object.defineProperty(start, 'scope', {
                    get: () => {
                        const scope = Array.from(
                            uniq((start.parent.scope || []).concat(_scope))
                        )

                        scope.push = (...args) => {
                            _scope.push(...args)
                            _scope = Array.from(uniq(_scope))

                            return _scope.length
                        }

                        return scope
                    },
                })
            }
            else {
                Object.defineProperty(start, 'scope', {
                    get: () => start.parent.scope || [],
                })
            }

            if (start.parent.scope) {
                start.parent.scope.push(start)
            }
        }

        yield start

        parent = start
    }

    const ks = reject(keys(start), k => rejectedKeys.indexOf(k) !== -1 )

    for (const k of ks) {
        const v = start[k]

        yield* astNodes(v, parent)
    }
}

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
