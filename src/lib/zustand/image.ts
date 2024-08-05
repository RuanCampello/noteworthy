import { create } from 'zustand';

interface Image {
  age: Date;
  updateAge: () => void;
}

export const useImageAge = create<Image>((set) => ({
  age: new Date(),

  updateAge: () =>
    set(() => {
      const newAge = new Date(new Date().getTime() + 60 * 60 * 1000);
      return { age: newAge };
    }),
}));
