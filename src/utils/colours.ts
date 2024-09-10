import type { Colour } from '../types/database-types';

export const Colours: { [key in Colour]: string } = {
  tiffany: '#80CBC4',
  cambridge: '#93CBAE',
  blue: '#80DEEA',
  mindaro: '#E6EE9B',
  mikado: '#FFCF32',
  sunset: '#FFCC80',
  melon: '#FAB099',
  tickle: '#F48FB1',
  wisteria: '#CF93D9',
  slate: '#7D56D8',
};

export function darkenColour(colour: string, percent: number) {
  const num = parseInt(colour.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    '#' +
    (
      0x1000000 +
      (R > 0 ? R : 0) * 0x10000 +
      (G > 0 ? G : 0) * 0x100 +
      (B > 0 ? B : 0)
    )
      .toString(16)
      .slice(1)
  );
}

interface ColourInfo {
  name: Colour;
  hex: string;
}

export function getRandomColour(): ColourInfo {
  const keys = Object.keys(Colours);
  const randomIndex = Math.floor(Math.random() * keys.length);
  const randomColourKey = keys[randomIndex] as Colour;
  return { name: randomColourKey, hex: Colours[randomColourKey] };
}
