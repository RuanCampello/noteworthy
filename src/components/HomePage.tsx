import Placeholder from './Placeholder';
import Resizable from './Resizable';

export default async function HomePage() {
  return (
    <Resizable>
      <Placeholder />
    </Resizable>
  );
}
