export type Definition = {
  word: string;
  phonetic: string;
  phonetics: {
    text: string;
    audio: string;
    sourceUrl: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      synonyms: string[];
      antonyms: string[];
      example: string;
    }[];
  }[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
};
