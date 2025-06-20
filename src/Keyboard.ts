export class Keyboard {
  activeKeys = new Map()

  constructor(
    public repeatDelay = 400,
    public repeatInterval = 100,
  ) {
    this.keyDownHandler = this.keyDownHandler.bind(this)
    this.keyUpHandler = this.keyUpHandler.bind(this)

    document.addEventListener('keydown', this.keyDownHandler)
    document.addEventListener('keyup', this.keyUpHandler)
  }

  registerKey(key, callback) {
    this.activeKeys.set(key, {
      callback,
      timeoutId: null,
      intervalId: null,
      isPressed: false,
    })
  }

  keyDownHandler(e: KeyboardEvent) {
    const entry = this.activeKeys.get(e.key)
    if (!entry || entry.isPressed) return

    entry.isPressed = true
    entry.callback() // Acción inmediata

    entry.timeoutId = setTimeout(() => {
      entry.intervalId = setInterval(entry.callback, this.repeatInterval)
    }, this.repeatDelay)
  }

  keyUpHandler(e: KeyboardEvent) {
    const entry = this.activeKeys.get(e.key)
    if (!entry) return

    entry.isPressed = false
    clearTimeout(entry.timeoutId)
    clearInterval(entry.intervalId)
  }

  destroy() {
    document.removeEventListener('keydown', this.keyDownHandler)
    document.removeEventListener('keyup', this.keyUpHandler)
  }
}
