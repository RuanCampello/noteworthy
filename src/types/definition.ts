export type Definition = {
  word: string;
  phonetic: string;
  phonetics: {
    text: string;
    audio: string;
    sourceUrl: string;
  }[];
  meanings: Meaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
};

export type Meaning = {
  partOfSpeech: string;
  definitions: {
    definition: string;
    synonyms: string[];
    antonyms: string[];
    example: string;
  }[];
};
