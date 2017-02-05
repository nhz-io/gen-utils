function* regen(gen, list) {
    for (const item of list) {
        yield* gen(item)
    }
}

function* regenR(list, gen) {
    yield* regen(gen, list)
}
