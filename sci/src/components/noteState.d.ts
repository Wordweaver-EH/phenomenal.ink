export declare const subscribeToHighlight: (callback: (id: string | null) => void) => () => void;
export declare const setHighlightedNote: (id: string | null) => void;
export declare const subscribeToVisibility: (callback: (visible: boolean) => void) => () => void;
export declare const toggleSidenotes: () => void; 