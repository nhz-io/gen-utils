function* regen(gen, list) {
    for (const item of list) {
        yield* gen.call(this, item)
    }
}

function* regenR(list, gen) {
    yield* regen.call(this, gen, list)
}
