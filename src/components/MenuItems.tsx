import { useCurrentEditor } from '@tiptap/react';
import {
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Superscript,
  Subscript,
  AlignLeft,
  BookA,
} from 'lucide-react';
import { Fragment } from 'react';
import MenuTooltip from '@/components/Tooltip';
import { Separator } from '@/ui/separator';
import { useRouter, useSearchParams } from 'next/navigation';

type MenuItem = {
  tooltipContent: string;
  action: () => void;
  isActive: boolean;
  icon: JSX.Element;
};

export default function MenuItems() {
  const { editor } = useCurrentEditor();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDictionaryActive = searchParams.has('dfn-open');
  if (!editor) return;

  function handleSuperscript() {
    if (!editor) return;
    if (editor.isActive('subscript')) {
      editor.chain().focus().unsetSubscript().run();
      editor.chain().focus().toggleSuperscript().run();
    } else {
      editor.chain().focus().toggleSuperscript().run();
    }
  }
  function handleSubscript() {
    if (!editor) return;
    if (editor.isActive('superscript')) {
      editor.chain().focus().unsetSuperscript().run();
      editor.chain().focus().toggleSubscript().run();
    } else {
      editor.chain().focus().toggleSubscript().run();
    }
  }

  function handleDefine() {
    if (!editor) return;

    const { view, state } = editor;
    const { from, to } = view.state.selection;
    const text = state.doc.textBetween(from, to);
    const isSingleWord = /^\w+$/.test(text);
    if (isSingleWord) {
      const params = new URLSearchParams(searchParams);
      params.set('dfn-open', 'true');
      params.set('dfn-word', text);

      router.push(`?${params}`);
      router.refresh();
    }
  }

  const menuItems: MenuItem[] = [
    {
      tooltipContent: 'Align left (Ctrl+Shift+L)',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      icon: <AlignLeft size={20} />,
    },
    {
      tooltipContent: 'Align center (Ctrl+Shift+E)',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      icon: <AlignCenter size={20} />,
    },
    {
      tooltipContent: 'Align right (Ctrl+Shift+R)',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      icon: <AlignRight size={20} />,
    },
    {
      tooltipContent: 'Justify (Ctrl+Shift+J)',
      action: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
      icon: <AlignJustify size={20} />,
    },
    {
      tooltipContent: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      icon: <Bold size={20} />,
    },
    {
      tooltipContent: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      icon: <Italic size={20} />,
    },
    {
      tooltipContent: 'Underline (Ctrl+U)',
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
      icon: <Underline size={20} />,
    },
    {
      tooltipContent: 'Strike (Ctrl+Shift+S)',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      icon: <Strikethrough size={20} />,
    },
    {
      tooltipContent: 'Highlight (Ctrl+Shift+H)',
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive('highlight'),
      icon: <Highlighter size={20} />,
    },
    {
      tooltipContent: 'Superscript',
      action: handleSuperscript,
      isActive: editor.isActive('superscript'),
      icon: <Superscript size={20} />,
    },
    {
      tooltipContent: 'Subscript',
      action: handleSubscript,
      isActive: editor.isActive('subscript'),
      icon: <Subscript size={20} />,
    },
    {
      tooltipContent: 'Define word',
      action: handleDefine,
      isActive: isDictionaryActive,
      icon: <BookA size={20} />,
    },
  ];
  return (
    <>
      {menuItems.map((item, i) => (
        <Fragment key={i}>
          <MenuTooltip content={item.tooltipContent}>
            <button
              onClick={item.action}
              className={`p-2 rounded-md hover:bg-neutral-100 hover:text-night/80 transition-colors duration-150 ${
                item.isActive ? 'bg-neutral-100 text-black' : ''
              }`}
            >
              {item.icon}
            </button>
          </MenuTooltip>
          {(i === 3 || i === 8 || i === 10) && (
            <Separator orientation="vertical" />
          )}
        </Fragment>
      ))}
    </>
  );
}
