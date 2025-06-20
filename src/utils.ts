export function matrix(h: number, w: number) {
  return Array.from(
    {
      length: h,
    },
    () => new Array(w).fill(0),
  )
}
