

export class AnimatedValue<T> {
  // TODO: tempor
  private _observer?: Function

  constructor(
    private _value: T
  ) { }

  setValue(value: T) {
    this._value = value
    if (this._observer) {
      this._observer()
    }
  }

  getValue(observer?: Function) {
    if (observer)
      this._observer = observer
    return this._value
  }
}

export function observeAnimatedValue<T>(observer: Function, value: T | AnimatedValue<T>, defaultValue?: T): T {
  if (value instanceof AnimatedValue)
    return value.getValue(observer)
  if (value === undefined)
    return defaultValue!
  return value
}

export function getAnimatedValue<T>(value: T | AnimatedValue<T>, defaultValue?: T): T {
  if (value instanceof AnimatedValue)
    return value.getValue()
  if (value === undefined)
    return defaultValue!
  return value
}