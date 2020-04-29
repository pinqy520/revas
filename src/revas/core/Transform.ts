export type TransformMatrix = [number, number, number, number, number, number];

export class Transform {
  _matrix: TransformMatrix = [1, 0, 0, 1, 0, 0]; // initialize with the identity matrix
  _stack: TransformMatrix[] = [];

  getMatrix() {
    return this._matrix;
  }

  setMatrix(m: TransformMatrix) {
    this._matrix = this.cloneMatrix(m);
  }

  cloneMatrix(m = this._matrix): TransformMatrix {
    return [m[0], m[1], m[2], m[3], m[4], m[5]];
  }

  save() {
    this._stack.push(this.cloneMatrix());
  }

  restore() {
    if (this._stack.length > 0) {
      this._matrix = this._stack.pop()!;
    }
  }

  apply(context: CanvasRenderingContext2D) {
    context.setTransform(...this._matrix);
  }

  translate(x: number, y: number) {
    this._matrix[4] += this._matrix[0] * x + this._matrix[2] * y;
    this._matrix[5] += this._matrix[1] * x + this._matrix[3] * y;
  }

  rotate(rad: number) {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const m11 = this._matrix[0] * c + this._matrix[2] * s;
    const m12 = this._matrix[1] * c + this._matrix[3] * s;
    const m21 = this._matrix[0] * -s + this._matrix[2] * c;
    const m22 = this._matrix[1] * -s + this._matrix[3] * c;
    this._matrix[0] = m11;
    this._matrix[1] = m12;
    this._matrix[2] = m21;
    this._matrix[3] = m22;
  }

  scale(sx: number, sy: number) {
    this._matrix[0] *= sx;
    this._matrix[1] *= sx;
    this._matrix[2] *= sy;
    this._matrix[3] *= sy;
  }

  multiply(m: TransformMatrix) {
    const m11 = this._matrix[0] * m[0] + this._matrix[2] * m[1];
    const m12 = this._matrix[1] * m[0] + this._matrix[3] * m[1];

    const m21 = this._matrix[0] * m[2] + this._matrix[2] * m[3];
    const m22 = this._matrix[1] * m[2] + this._matrix[3] * m[3];

    const dx = this._matrix[0] * m[4] + this._matrix[2] * m[5] + this._matrix[4];
    const dy = this._matrix[1] * m[4] + this._matrix[3] * m[5] + this._matrix[5];

    this._matrix[0] = m11;
    this._matrix[1] = m12;
    this._matrix[2] = m21;
    this._matrix[3] = m22;
    this._matrix[4] = dx;
    this._matrix[5] = dy;
  }
}
