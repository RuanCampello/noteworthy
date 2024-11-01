export type DialogState = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (dropdownOpen: boolean) => void;
};

export type State = 'open' | 'closed';
