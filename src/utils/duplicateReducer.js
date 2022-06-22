export const DuplicateReducer = (arr) => {
  let checkDuplicatesArr = arr.reduce((acc, value) => {
    return {
      ...acc,
      [value.name]: {
        ...value,
        quantity: (acc[value.name]?.quantity | 0) + 1,
      },
    };
  }, {});

  const productsArr = Object.keys(checkDuplicatesArr).map((key) => {
    const item = {
      ...checkDuplicatesArr[key],
      name:
        checkDuplicatesArr[key].quantity === 1
          ? `${checkDuplicatesArr[key].name}`
          : `${checkDuplicatesArr[key].name} (${checkDuplicatesArr[key].quantity})`,
    };

    const { ...rest } = item;

    return rest;
  });

  return productsArr;
};
