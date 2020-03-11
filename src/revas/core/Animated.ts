import bezier from 'bezier-easing'

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

export type TimingConfig = {
  to: number,
  duration: number,
  ease?: (t: number) => number
}

export class AnimatedTiming {
  private _startTime = 0
  private _startValue = 0
  private _onEnd?: Function
  private _next = 0

  constructor(
    private value: AnimatedValue<any>,
    private config: TimingConfig
  ) { }

  private get _ease() {
    return this.config.ease || Easing.linear
  }

  start(onEnd?: Function) {
    this._startTime = Date.now()
    this._startValue = this.value.getValue()
    this._onEnd = onEnd
    this._next = requestAnimationFrame(this._loop)
    return this
  }

  stop() {
    cancelAnimationFrame(this._next)
    return this
  }

  private _loop = () => {
    const duration = Date.now() - this._startTime
    if (duration < this.config.duration) {
      const percent = duration / this.config.duration
      const inc = this._ease(percent) * (this.config.to - this._startValue)
      this.value.setValue(this._startValue + inc)
      this._next = requestAnimationFrame(this._loop)
    } else {
      this.value.setValue(this.config.to)
      this._onEnd && this._onEnd()
    }
  }

}

export function timing(value: AnimatedValue<any>, config: TimingConfig) {
  return new AnimatedTiming(value, config)
}

let ease: (t: number) => number

function getEase() {
  if (!ease) {
    ease = bezier(0.42, 0, 1, 1);
  }
  return ease
}

export const Easing = {

  linear(t: number) {
    return t
  },

  ease(t: number): number {
    return getEase()(t);
  },
  /**
   * Runs an easing function forwards.
   */
  in(easing = getEase()): (t: number) => number {
    return easing;
  },

  /**
   * Runs an easing function backwards.
   */
  out(easing = getEase()): (t: number) => number {
    return t => 1 - easing(1 - t);
  },

  /**
   * Makes any easing function symmetrical. The easing function will run
   * forwards for half of the duration, then backwards for the rest of the
   * duration.
   */
  inOut(easing = getEase()): (t: number) => number {
    return t => {
      if (t < 0.5) {
        return easing(t * 2) / 2;
      }
      return 1 - easing((1 - t) * 2) / 2;
    };
  },
  bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }

    if (t < 2 / 2.75) {
      const t2 = t - 1.5 / 2.75;
      return 7.5625 * t2 * t2 + 0.75;
    }

    if (t < 2.5 / 2.75) {
      const t2 = t - 2.25 / 2.75;
      return 7.5625 * t2 * t2 + 0.9375;
    }

    const t2 = t - 2.625 / 2.75;
    return 7.5625 * t2 * t2 + 0.984375;
  },
  elastic(bounciness: number = 1): (t: number) => number {
    const p = bounciness * Math.PI;
    return t => 1 - Math.pow(Math.cos((t * Math.PI) / 2), 3) * Math.cos(t * p);
  },
}