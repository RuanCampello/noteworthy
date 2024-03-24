export function generateSequence(): number[] {
  const sequence: number[] = [];
  for (let i = 1; i < 10; i++) {
    const value = i * 6;
    if(i > 1) sequence.push(value);
  }
  return sequence;
}
