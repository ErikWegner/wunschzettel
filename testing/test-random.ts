export class TestRandom {
  private static counters: { [name: string]: number } = {};

  /**
   * Returns the next id for a particular entity.
   *
   * @param countername The entity id.
   */
  static id(countername: string): number {
    return (TestRandom.counters[countername] = (TestRandom.counters[countername] || 0) + 1);
  }

  /**
   * Generates a random string of the given length.
   *
   * @param length The length of the generated string.
   */
  static randomString(length: number): string {
    let r = '';
    for (let i = 0; i < length; i++) {
      r += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }

    return r;
  }

  /**
   * Generates a random number between min and max.
   *
   * @param max Upper limit (included).
   * @param min Lower limit (included).
   */
  static r(max: number, min = 0) {
    return min + (Math.floor(Math.random() * (max - min)));
  }
}
