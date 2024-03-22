import { Link } from '@tiptap/extension-link';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { getAttributes } from '@tiptap/react';

export const DoubleClickLink = Link.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnDoubleClick: true,
      openOnClick: false,
    };
  },
  addProseMirrorPlugins() {
    const plugins: Plugin[] = this.parent?.() || [];

    const doubleClickHandler = new Plugin({
      key: new PluginKey('handleDoubleClick'),
      props: {
        handleDOMEvents: {
          dblclick(view, event) {
            const attrs = getAttributes(view.state, 'link');
            const link = (event.target as HTMLElement)?.closest('a');

            if (link && attrs.href) {
              window.open(attrs.href, attrs.target);
              return true;
            }

            return false;
          },
        },
      },
    });

    plugins.push(doubleClickHandler);

    return plugins;
  },
});
