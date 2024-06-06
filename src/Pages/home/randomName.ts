export const readTxtFileWithComma = async (fileURL: string) => {
  const file = await fetch(fileURL);
  const text = await file.text();
  const wordList: string[] = text.split(", ");

  return wordList;
};
export const readTxtFileWithLine = async (fileURL: string) => {
  const file = await fetch(fileURL);
  const text = await file.text();
  const wordList: string[] = text.split("\n");

  return wordList;
};
export const createRandomName = async () => {
  const secondWord = await readTxtFileWithLine("/s.txt");
  const rand_sec = Math.floor(Math.random() * secondWord.length);
  return secondWord[rand_sec].replace(/\r/g, "");
};
export const createPartyName = async (): Promise<any> => {
  const firstWord = await readTxtFileWithLine("/f.txt");
  const secondWord = await readTxtFileWithLine("/s.txt");

  let partyName = "";

  const rand_fst = Math.floor(Math.random() * firstWord.length);
  const rand_sec = Math.floor(Math.random() * secondWord.length);

  partyName =
    firstWord[rand_fst].replace(/\r/g, "") +
    " " +
    secondWord[rand_sec].replace(/\r/g, "");

  return partyName;
};
