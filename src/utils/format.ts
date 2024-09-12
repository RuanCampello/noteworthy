export function stripHTMLTags(htmlString: string): string {
  if (htmlString) {
    return htmlString.replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ');
  }
  return '';
}
export function formatSearchParams(searchParams: string): string {
  return searchParams.replace(/\+/g, ' ').replace(/^name=/, '');
}
