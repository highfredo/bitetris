export function matrix(h, w) {
    return Array.from({
        length: h
    }, () => new Array(w).fill(0))
}