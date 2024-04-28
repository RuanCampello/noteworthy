/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Image, { StaticImageData } from 'next/image';
import { Lora } from 'next/font/google';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';
import LogoImage from '@assets/logo.svg';

const lora = Lora({ subsets: ['latin'] });

const defaultAnimation = {
  hidden: {
    opacity: 0.15,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export default function FormHeader() {
  const control = useAnimation();
  const ref = useRef(null);
  const word = 'Noteworthy';

  useEffect(() => {
    control.start('visible');
  }, []);

  return (
    <div className='flex gap-1 items-center pb-16'>
      <Image alt='noteworthy logo' src={LogoImage} width={48} height={52} />
      <motion.h1
        className={`${lora.className} text-4xl font-bold block`}
        ref={ref}
        initial='hidden'
        animate={control}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
          hidden: {},
        }}
        aria-hidden
      >
        {word.split('').map((c, i) => (
          <motion.span
            key={i}
            className='inline-block'
            variants={defaultAnimation}
          >
            {c}
          </motion.span>
        ))}
      </motion.h1>
    </div>
  );
}
