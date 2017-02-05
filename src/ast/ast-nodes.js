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
        
        if (scopedTypes.indexOf(start.type) !== -1) {
            let _scope = []

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

        yield start

        parent = start
        
        if (start.parent.scope) {
            start.parent.scope.push(start)
        }

        start.scope.push(start)
    }

    const ks = reject(keys(start), k => rejectedKeys.indexOf(k) !== -1 )

    for (const k of ks) {
        const v = start[k]

        yield* astNodes(v, parent)
    }
}
