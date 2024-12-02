type Listener = (highlightedId: string | null) => void;
const listeners: Listener[] = [];
let currentHighlightedId: string | null = null;

export const subscribeToHighlight = (listener: Listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

export const setHighlightedNote = (id: string | null) => {
  currentHighlightedId = id;
  listeners.forEach(listener => listener(id));
}; 