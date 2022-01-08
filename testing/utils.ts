export function randomString(length: number, prefix = ''): string {
  let r = prefix;
  for (let i = 0; i < length; i++) {
    r += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  return r;
}

export function randomNumber(max: number, min = 0): number {
  return Math.floor((max - min) * Math.random()) + min;
}

export function delayDuringTest(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
