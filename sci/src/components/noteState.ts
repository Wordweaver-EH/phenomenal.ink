// Global state for currently highlighted note and visibility
let currentHighlightedId: string | null = null;
let sidenotesVisible = true;

const highlightSubscribers = new Set<(id: string | null) => void>();
const visibilitySubscribers = new Set<(visible: boolean) => void>();

export const subscribeToHighlight = (callback: (id: string | null) => void): () => void => {
  highlightSubscribers.add(callback);
  if (currentHighlightedId !== null) {
    callback(currentHighlightedId);
  }
  return () => {
    highlightSubscribers.delete(callback);
  };
};

export const setHighlightedNote = (id: string | null): void => {
  currentHighlightedId = id;
  highlightSubscribers.forEach(callback => callback(id));
};

export const subscribeToVisibility = (callback: (visible: boolean) => void): () => void => {
  visibilitySubscribers.add(callback);
  callback(sidenotesVisible);
  return () => {
    visibilitySubscribers.delete(callback);
  };
};

export const toggleSidenotes = (): void => {
  sidenotesVisible = !sidenotesVisible;
  visibilitySubscribers.forEach(callback => callback(sidenotesVisible));
}; 