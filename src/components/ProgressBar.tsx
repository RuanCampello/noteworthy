import NextTopLoader from 'nextjs-toploader';

export default function ProgressBar() {
  return (
    <NextTopLoader
      color='#9672EA'
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      showSpinner={false}
      speed={200}
    />
  );
}
