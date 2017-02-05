/** Generator */

function* regen(gen, list) {
    for (const item of list) {
        yield* gen.call(this, item)
    }
}

function* regenR(list, gen) {
    yield* regen.call(this, gen, list)
}

function* repeat(...list) {
    let n = list.pop()
    const buffer = []
    
    for (const items of list) {
        for (const item of items) {
            buffer.push(item)
            yield item
        }
    }
    while (--n > 0) {
        yield* buffer
    }
}

function* repeatR(n, ...list) {
    return yield* repeat(...list, n)
}

function* buffer(...list) {
    const buff = list.pop()
    
    for (const items of list) {
        for (const item of items) {
            buff.push(item)
            yield item
        }
    }
}

function* bufferR(buff, ...list) {
    return yield* buffer(...list, buff)
}
    

function* fork(...list) {
    const buff = []
    let iterable = buffer(list.pop(), buff)
    const gen = list.shift()
    
    yield* gen(iterable)
    
    for (const gen of list) {
        yield* gen(buff)
    }
}

function* forkR(iterable, ...list) {
    return yield* fork(...list, iterable)
}

/** Iterable */

function* filter(list, fn) {
    let i = 0

    for (const item of list) {
        if (fn.call(this, item, i, list)) {
            yield item
        }
    }
}

function* filterR(fn, list) {
    yield* filter(list, fn)
}

function* find(list, fn) {
    let i = 0

    for (const item of list) {
        if (fn.call(this, item, i, list)) {
            return yield item
        }
    }
}

function* findR(fn, list) {
    yield* find(list, fn)
}

function* flatten(...list) {
    for (const arr of list) {
        if (!arr || 
            typeof arr === 'string' || 
            typeof arr[Symbol.iterator] !== 'function'
        ) {
            yield arr
        }
        else {
            for (const item of arr) {
                if (!item || 
                    typeof item === 'string' || 
                    typeof item[Symbol.iterator] !== 'function'
                ) {
                    yield item
                }
                else {
                    yield* flatten(item)
                }
            }
        }
    }
}

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

function* map(list, fn) {
    let i = 0

    for (const item of list) {
        yield fn.call(this, item, i, list)
    }
}

function* mapR(fn, list) {
    yield* map(list, fn)
}

function* reject(list, fn) {
    let i = 0

    for (const item of list) {
        if (!fn.call(this, item, i, list)) {
            yield item
        }
    }
}

function* rejectR(fn, list) {
    yield* reject(list, fn)
}

function* take(list, n) {
    for(const item of list) {
        if (n-- > 0) {
            yield item
        }
        else {
            return
        }
    }
}

function* takeR(n, list) {
    yield* take(list, n)
}

function* uniq(...list) {
    const seen = []
    
    for (const items of list) {
        for (const item of items) {
            if (seen.indexOf(item) === -1) {
                seen.push(item)
                
                yield(item)
            }
        }
    }
}

function* uniqBy(...list) {
    const seen = []    
    const diff = list.pop()
    
    if (typeof diff === 'function') {
        for (const items of list) {
            for (const item of items) {
                if (diff.call(this, item, seen)) {
                    yield item
                }
            }
        }
    }
    else {
        for (const items of list) {
            for (const item of items) {
                const key = item[diff]
                
                if (seen.indexOf(key) === -1) {
                    seen.push(key)
                    
                    yield item
                }
            }
        }
    }
}

function* uniqByR(diff, ...list) {
    return yield* uniqBy(...list, diff)
}

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

function* recurring(...list) {
    const seen = []
    const yielded = []
    
    for (const items of list) {
        for (const item of items) {
            if (seen.indexOf(item) > -1) {
                if (yielded.indexOf(item) < 0) {
                    yielded.push(item)
                    
                    yield item
                }
            }
            else {
                seen.push(item)
            }
        }
    }
}

/** AST */

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
