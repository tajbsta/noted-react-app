export function dedupeByKey(arr, key) {
  const temp = arr.map((el) => el[key]);
  return arr.filter((el, i) => temp.indexOf(el[key]) === i);
}

// Truncate string if longer than 50 characters
export const truncateString = (str, num = 50) => {
  if (str && str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

// Convert string to title case
export const toTitleCase = (str) => {
  const replacedDash = str && str.replace('-', ' ');
  return replacedDash.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

