export interface Clue {
    id: string;
    word: string;
    definition: string;
    wordIndex: number;
    clueTag: number;
    isSelected: boolean[];
    isCompleted: boolean[];
    isHovered: boolean;
  }
