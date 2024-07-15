export type Shortcut = {
  action: string;
  commands: string[];
};

export const shortcuts: Shortcut[] = [
  {
    action: 'Align left',
    commands: ['Ctrl', 'Shift', 'L'],
  },
  {
    action: 'Align center',
    commands: ['Ctrl', 'Shift', 'E'],
  },
  {
    action: 'Align right',
    commands: ['Ctrl', 'Shift', 'R'],
  },
  {
    action: 'Justify',
    commands: ['Ctrl', 'Shift', 'J'],
  },
  {
    action: 'Bold',
    commands: ['Ctrl', 'B'],
  },
  {
    action: 'Italic',
    commands: ['Ctrl', 'I'],
  },
  {
    action: 'Underline',
    commands: ['Ctrl', 'U'],
  },
  {
    action: 'Strike',
    commands: ['Ctrl', 'Shift', 'S'],
  },
  {
    action: 'Highlight',
    commands: ['Ctrl', 'Shift', 'H'],
  },
];
