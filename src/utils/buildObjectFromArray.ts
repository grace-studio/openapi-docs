export type InputObject = {
  key: string;
  value: string;
};

export const buildObjectFromArray = (inputArray: InputObject[]): object =>
  inputArray.reduce<any>((result, item) => {
    const keys = item.key.split('.');

    const _ = keys.reduce(
      (resultObject, current, index, array) =>
        (resultObject[current] =
          index === array.length - 1
            ? item.value
            : resultObject[current] ?? {}),
      result,
    );

    return result;
  }, {});
