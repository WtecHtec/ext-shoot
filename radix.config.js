import * as radix from '@radix-ui/colors';

const getColorMap = (
  /** @type {Array<keyof typeof radix>} */
  colorList
) =>
  colorList.reduce((acc, color) => {
    acc[color] = radix[color];
    acc[`${color}Dark`] = radix[`${color}Dark`];
    return acc;
  }, {});

export default getColorMap(['gray']);
