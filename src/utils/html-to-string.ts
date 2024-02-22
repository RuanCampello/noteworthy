export function stripHTMLTags(htmlString: string): string {
  return htmlString.replace(/(<([^>]+)>)/gi, '');
}
