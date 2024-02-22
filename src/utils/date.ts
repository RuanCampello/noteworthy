export function secondsToLocaleDate(seconds: number): string {
  const localeDateString = new Date(seconds * 1000).toLocaleDateString(
    'en-GB'
  );
  return localeDateString;
}
