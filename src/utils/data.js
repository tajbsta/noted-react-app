export function dedupeByKey(arr, key) {
  const temp = arr.map((el) => el[key]);
  return arr.filter((el, i) => temp.indexOf(el[key]) === i);
}

export const truncateString = (str, num = 50) => {
  if (str && str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};
