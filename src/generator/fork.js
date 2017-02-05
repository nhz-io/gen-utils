function* fork(...list)) {
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
