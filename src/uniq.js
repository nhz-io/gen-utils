function* uniq(list) {
    const seen = []

    for (const item of list) {
        if (seen.indexOf(item) === -1) {
            seen.push(item)
            
            yield item
        }
    }
}
