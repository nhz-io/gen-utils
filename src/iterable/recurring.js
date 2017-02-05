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
            
