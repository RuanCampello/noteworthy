export function formatSearchParams(searchParams: string): string {
  return searchParams.replace(/\+/g, ' ').replace(/^name=/, '');
}
