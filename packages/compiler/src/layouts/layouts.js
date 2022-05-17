import defaultLayout from './defaultLayout.js';

export const layouts = {
  default: defaultLayout,
};

export default function layout() {
  return (tree, file) => {
    layouts[file.data?.matter?.layout || 'default'](tree, file);
  };
}
