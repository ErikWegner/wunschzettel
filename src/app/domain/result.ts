export class Result<T> {
    constructor(public data: T, public success = true) { }
}
