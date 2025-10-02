import colorNames from "1500-color-names";

const lowerCaseColorNames = Object.keys(colorNames).reduce((acc, key) => {
  acc[key.toLowerCase()] = (colorNames as Record<string, string>)[key];
  return acc;
}, {} as Record<string, string>);

export const getColorHex = (colorName: string) => {
  try {
    const lowerCaseColorName = colorName.toLowerCase();
    const hex = lowerCaseColorNames[lowerCaseColorName];
    if (hex) {
      return hex;
    }
    return '#000000'; // Default to black if color name is not found
  } catch (e) {
    return '#000000'; // Default to black if color name is not found
  }
};
