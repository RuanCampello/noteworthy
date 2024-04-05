export function stripHTMLTags(htmlString: string): string {
  if (htmlString) {
    return htmlString.replace(/(<([^>]+)>|&nbsp;)/gi, '');
  }
  return '';
}
export function formatSearchParams(searchParams: string): string {
  return searchParams.replace(/\+/g, ' ').replace(/^name=/, '');
}
