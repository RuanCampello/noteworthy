export function stripHTMLTags(htmlString: string): string {
  return htmlString.replace(/(<([^>]+)>)/gi, '');
}
export function formatSearchParams(searchParams: string): string {
  return searchParams.replace(/\+/g, ' ').replace(/^name=/, '');
}
