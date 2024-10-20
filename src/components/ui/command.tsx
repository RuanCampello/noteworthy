import { generateNote } from '@/actions';
import NotFound from '@/assets/svg/oooscillate.svg';
import { CommandItem } from '@/components/Search/Item';
import { cn } from '@/lib/utils';
import { type Action, useSearch } from '@/lib/zustand/search';
import { useFilter } from '@/lib/zustand/search-filter';
import { useSettingsStore } from '@/lib/zustand/settings';
import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import { DialogOverlay, DialogPortal } from '@/ui/dialog';
import type { InputProps } from '@/ui/input';
import { Input } from '@/ui/input';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  FilePlus2,
  Loader,
  NotebookText,
  NotepadTextDashed,
  Package,
  Search,
  Settings,
  Sparkle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

function RenderInputIcon() {
  const baseIcon =
    'mr-2 h-4 w-4 shrink-0 opacity-50 group-data-[loading=true]/dialog:hidden hidden';

  return (
    <>
      <Loader
        className={cn(
          baseIcon,
          'animate-spin group-data-[loading=true]/dialog:inline',
        )}
      />
      <Package
        className={cn(
          baseIcon,
          'text-cambridge animate-in duration-200 fade-in-40 opacity-70 zoom-in-[.3] group-data-[filter=Archived]/dialog:inline',
        )}
      />
      <Sparkle
        className={cn(
          baseIcon,
          'text-sunset text-opacity-70 transition-colors fade-in-50 opacity-100 animate-in spin-in-45 duration-200 group-data-[filter=Favourites]/dialog:inline',
        )}
      />
      <Search
        className={cn(
          baseIcon,
          'group-[[data-filter=None]:not([data-loading=true])]/dialog:inline',
        )}
      />
    </>
  );
}

const CommandInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const t = useTranslations('Search');
    const placeholder = useFilter((s) => s.placeholder);
    const query = useSearch((s) => s.query);

    return (
      <div className='flex items-center border-b px-3 z-10 bg-transparent'>
        <RenderInputIcon />
        <Input
          ref={ref}
          defaultValue={query}
          placeholder={t(placeholder)}
          className={cn(
            'flex h-11 w-full rounded-md bg-transparent py-3 px-0 text-sm outline-none focus-visible:ring-0 border-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 selection:bg-slate selection:text-white',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
CommandInput.displayName = 'CommandInput';

const CommandDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const filter = useFilter((s) => s.filter);
  const toggleFilter = useFilter((s) => s.toggleFilter);

  const decreaseIndex = useSearch((s) => s.decreaseIndex);
  const increaseIndex = useSearch((s) => s.increaseIndex);
  const setOpen = useSearch((s) => s.setOpen);
  const loading = useSearch((s) => s.loading);
  const searchResults = useSearch((s) => s.searchResults);
  const actions = useSearch((s) => s.actions);
  const activeIndex = useSearch((s) => s.activeIndex);

  const router = useRouter();

  function handleKeyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Tab') toggleFilter();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      increaseIndex();
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      decreaseIndex();
    }
    if (event.key === 'Enter') {
      const selectedItem = searchResults[activeIndex];
      const selectedAction = actions[activeIndex - searchResults.length];

      if (selectedItem) {
        setOpen(false);
        router.replace(`/notes/${selectedItem.id}`);
      } else if (selectedAction) {
        selectedAction.onSelect();
      }
    }
  }

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        aria-describedby={'search modal content'}
        data-loading={loading}
        data-filter={filter}
        onKeyDown={handleKeyPressed}
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg bg-black/40 backdrop-blur dark focus:outline-none overflow-hidden group/dialog',
          className,
        )}
        {...props}
      >
        <VisuallyHidden>
          <DialogPrimitive.Title>Search Dialog Content</DialogPrimitive.Title>
        </VisuallyHidden>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
CommandDialogContent.displayName = DialogPrimitive.Content.displayName;

type CommandListProps = React.HTMLAttributes<HTMLDivElement>;

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => {
    const selectItem = useSearch((s) => s.selectItem);
    const searchResults = useSearch((s) => s.searchResults);
    const activeIndex = useSearch((s) => s.activeIndex);
    const loading = useSearch((s) => s.loading);
    const query = useSearch((s) => s.query);

    const t = useTranslations('Search');

    let content;

    const shouldRender =
      Array.isArray(searchResults) && searchResults.length > 0;
    const notFound = query.length > 2 && !shouldRender;

    if (loading) {
      content = LoadingFallback();
    } else if (notFound) {
      content = <NotFoundFallback query={query} />;
    } else if (shouldRender) {
      content = searchResults.map((item, i) => (
        <CommandItem
          key={item.id}
          aria-selected={i === activeIndex}
          content={item.highlightedContent || item.content}
          title={item.title}
          href={item.id}
          tabIndex={0}
          icon={<NotebookText />}
          onMouseEnter={() => selectItem(i)}
        />
      ));
    }

    return (
      <div
        ref={ref}
        className={cn(
          'max-h-[300px] overflow-y-auto overflow-x-hidden flex flex-col m-1 mb-0',
          className,
        )}
        {...props}
      >
        {shouldRender && <CommandSeparator heading={t('search_res')} />}
        {content}
      </div>
    );
  },
);

CommandList.displayName = 'CommandList';

function CommandActions() {
  const setSettingsDialogOpen = useSettingsDialogStore((s) => s.setOpen);
  const setSettingsOpen = useSettingsStore((state) => state.setOpen);

  const setOpen = useSearch((s) => s.setOpen);
  const setActions = useSearch((s) => s.setActions);
  const selectItem = useSearch((s) => s.selectItem);
  const activeIndex = useSearch((s) => s.activeIndex);
  const searchResults = useSearch((s) => s.searchResults);

  const router = useRouter();
  const t = useTranslations('Search');

  const actions: Action[] = [
    {
      displayName: t('new_note'),
      onSelect: async () => {
        const id = await generateNote();
        router.replace(`/notes/${id}`);
      },
      icon: FilePlus2,
    },
    {
      displayName: t('open_settings'),
      onSelect: () => {
        setSettingsOpen(true);
        setSettingsDialogOpen(true);
        setOpen(false);
      },
      icon: Settings,
    },
  ];

  React.useEffect(() => {
    setActions(actions);
  }, []);

  return (
    <div className='flex flex-col m-1 select-none'>
      <CommandSeparator heading={t('quick_act')} />
      {actions.map((action, i) => {
        const actualI = i + searchResults.length;

        return (
          <CommandItem
            aria-selected={actualI === activeIndex}
            key={actualI}
            onMouseEnter={() => selectItem(actualI)}
            icon={<action.icon />}
            onSelect={action.onSelect}
            title={action.displayName}
          />
        );
      })}
    </div>
  );
}

CommandActions.displayName = 'CommandActions';

function CommandSeparator({ heading }: { heading: string }) {
  return (
    <div className='px-3 py-1 text-xs select-none text-muted-foreground'>
      {heading}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className='bg-transparent h-12 px-2 rounded-sm flex items-center gap-2'>
      <div className='w-7 h-7 bg-midnight animate-pulse rounded-sm shrink-0' />
      <div className='flex gap-2 w-full items-center'>
        <div className='flex flex-col h-fit w-full gap-1'>
          <div className='w-full bg-midnight h-4 rounded-sm animate-pulse' />
          <div className='w-full bg-midnight h-2 rounded-sm animate-pulse' />
        </div>
        <div className='w-5 shrink-0 h-5 bg-midnight rounded-sm animate-pulse' />
      </div>
    </div>
  );
}

function NotFoundFallback({ query }: { query: string }) {
  const t = useTranslations('Search');
  return (
    <div className='w-full flex justify-center py-2 select-none'>
      <div className='items-center flex flex-col'>
        <NotepadTextDashed className='w-6 h-6' />
        <h2 className='font-semibold text-base my-1.5'> {t('not_found_t')} </h2>
        <div className='text-neutral-300 text-center text-sm'>
          <p> {`"${query}" ${t('not_found')}`} </p>
          <p>{t('try_again')}</p>
        </div>
      </div>
      <Image
        src={NotFound}
        className='absolute -z-10 -translate-y-14 brightness-50'
        alt={t('not_found_t')}
      />
    </div>
  );
}

export const Command = {
  Input: CommandInput,
  Content: CommandDialogContent,
  List: CommandList,
  Actions: CommandActions,
};
