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
