import Note from './Note';
import SectionTitle from './SectionTitle';

export default function Notes() {
  return (
    <div>
      <SectionTitle title='Notes' />
      <div className='flex flex-col gap-2'>
        <Note
          id={123}
          colour='mindaro'
          name='Reflection on the Month of June'
          text='Its hard to believe that June is already over! Looking back on the month, there were a few highlights that stand out to me. One of the best things that happened was getting promoted at work. Ive been working really hard and its great to see that effort recognized. Its also exciting to have more responsibility and the opportunity to contribute to the company in a bigger way. Im looking forward to taking on new challenges and learning as much as I can in my new role.'
          date='21/06/2022'
        />
        <Note
          colour='sunset'
          name='Reflection on the Month of June'
          text='Its hard to believe that June is already over! Looking back on the month, there were a few highlights that stand out to me. One of the best things that happened was getting promoted at work. Ive been working really hard and its great to see that effort recognized. Its also exciting to have more responsibility and the opportunity to contribute to the company in a bigger way. Im looking forward to taking on new challenges and learning as much as I can in my new role.'
          date='21/06/2022'
        />
        <Note
          colour='tickle'
          name='Reflection on the Month of June'
          text='Its hard to believe that June is already over! Looking back on the month, there were a few highlights that stand out to me. One of the best things that happened was getting promoted at work. Ive been working really hard and its great to see that effort recognized. Its also exciting to have more responsibility and the opportunity to contribute to the company in a bigger way. Im looking forward to taking on new challenges and learning as much as I can in my new role.'
          date='21/06/2022'
        />
      </div>
    </div>
  );
}
