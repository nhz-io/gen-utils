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
