export interface Item {
  id: number;
  name: string;
  checked?: boolean;
}

export interface Textbook extends Item {}

export interface Chapter extends Item {
  textbookId: number;
}

export interface SubChapter extends Item {
  chapterId: number;
  _count: {
    subtopics: number;
  };
}

export interface SubTopic extends Item {
  subchapterId: number;
}

export interface Progress {
  selectedTextbookIds: number[];
  chapterProgress: number[];
  subchapterProgress: number[];
  subtopicProgress: number[];
}

export interface ProgressDto extends Progress {
  id: number;
  userId: number;
}
