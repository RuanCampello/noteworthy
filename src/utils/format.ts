export function stripHTMLTags(htmlString: string): string {
  return htmlString.replace(/(<([^>]+)>|&nbsp;)/gi, '');
}
export function formatSearchParams(searchParams: string): string {
  return searchParams.replace(/\+/g, ' ').replace(/^name=/, '');
}
