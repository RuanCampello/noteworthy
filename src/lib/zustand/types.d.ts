export type DialogState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

export type State = 'open' | 'closed';
