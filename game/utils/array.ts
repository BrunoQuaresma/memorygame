/** From https://stackoverflow.com/a/2450976/3080472 */
export function shuffle(array: Array<any>) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/** From https://stackoverflow.com/a/58126944/3080472 */
export const takeRandom = (array: Array<any>, number: number) =>
  array.sort(() => Math.random() - Math.random()).slice(0, number);
