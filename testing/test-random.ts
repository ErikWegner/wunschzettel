export class TestRandom {
  static randomString(length: number): string {
    let r = '';
    for (let i = 0; i < length; i++) {
      r += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    return r;
  }
  static r(max: number, min = 0) {
    return min + (Math.floor(Math.random() * (max - min)));
}
}
