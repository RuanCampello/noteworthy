export function secondsToLocaleDateLong(seconds: number): string {
  const localeDateString = new Date(seconds * 1000).toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }
  );
  return localeDateString;
}

export function secondsToLocaleDate(seconds: number): string {
  const localeDateString = new Date(seconds * 1000).toLocaleDateString('en-GB');
  return localeDateString;
}
