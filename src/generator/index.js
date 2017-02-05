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
