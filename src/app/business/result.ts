export class Result<T> {
  constructor(public readonly data: T, public readonly success = true) {}
}
