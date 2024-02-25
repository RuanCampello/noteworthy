export function getNavigationInfo(pathname: string) {
  let href = '/';
  let text = 'page';
  let redirectTitle = 'Home';

  if (pathname) {
    if (pathname.includes('/favourites/')) {
      href = '/favourites';
      text = 'favourite note';
      redirectTitle = 'Favourites';
    } else if (pathname.includes('/notes/')) {
      text = 'note';
    }
  }

  return { href, text, redirectTitle };
}
