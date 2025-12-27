export const calculateConversion = (
  baseUnitMeasurement: string,
  baseCalories: number,
  baseProtein: number,
  baseQty: number,
  chosenUnitMeasurement: string | undefined,
  quantityOfChosenUnit: number | undefined
) => {
  if (chosenUnitMeasurement === undefined || quantityOfChosenUnit === undefined)
    return { calories: 0, protein: 0 };

  let conversionMultiplier = 1;
  chosenUnitMeasurement = chosenUnitMeasurement.toLowerCase();
  switch (baseUnitMeasurement.toLowerCase()) {
    case "gallon":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 4;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 8;
      else if (chosenUnitMeasurement === "cup") conversionMultiplier = 16;
      else if (chosenUnitMeasurement === "liter") conversionMultiplier = 3.785;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 3.785 * 1000;
      else if (chosenUnitMeasurement === "teaspoon") conversionMultiplier = 768;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 256;
      else if (chosenUnitMeasurement === "gallon") conversionMultiplier = 1;
      break;
    case "quart":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 2;
      else if (chosenUnitMeasurement === "cup") conversionMultiplier = 3.94;
      else if (chosenUnitMeasurement === "liter") conversionMultiplier = 0.946;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 0.946 * 1000;
      else if (chosenUnitMeasurement === "teaspoon") conversionMultiplier = 192;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 64;
      else if (chosenUnitMeasurement === "gallon") conversionMultiplier = 1 / 4;
      break;
    case "pint":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 0.5;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 0.5;
      else if (chosenUnitMeasurement === "cup") conversionMultiplier = 1.972;
      else if (chosenUnitMeasurement === "liter") conversionMultiplier = 0.473;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 0.473 * 1000;
      else if (chosenUnitMeasurement === "teaspoon") conversionMultiplier = 96;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 32;
      else if (chosenUnitMeasurement === "gallon") conversionMultiplier = 0.125;
      break;
    case "cup":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 0.254;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 0.51;
      else if (chosenUnitMeasurement === "cup") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "liter") conversionMultiplier = 0.24;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 0.24 * 1000;
      else if (chosenUnitMeasurement === "teaspoon")
        conversionMultiplier = 48.69;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 16.23;
      else if (chosenUnitMeasurement === "gallon") conversionMultiplier = 0.063;
      break;
    case "liter":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 1.06;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 2.113;
      else if (chosenUnitMeasurement === "cup") conversionMultiplier = 4.167;
      else if (chosenUnitMeasurement === "liter") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 1000;
      else if (chosenUnitMeasurement === "teaspoon")
        conversionMultiplier = 202.9;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 67.628;
      else if (chosenUnitMeasurement === "gallon") conversionMultiplier = 0.26;
      break;
    case "milliliter":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 1 / 946.4;
      else if (chosenUnitMeasurement === "pint")
        conversionMultiplier = 1 / 473.2;
      else if (chosenUnitMeasurement === "cup") conversionMultiplier = 1 / 240;
      else if (chosenUnitMeasurement === "liter")
        conversionMultiplier = 1 / 1000;
      else if (chosenUnitMeasurement === "milliliter") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "teaspoon")
        conversionMultiplier = 1 / 4.929;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 1 / 14.787;
      else if (chosenUnitMeasurement === "gallon")
        conversionMultiplier = 1 / 3785;
      break;

    case "tablespoon":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 1 / 64;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 1 / 32;
      else if (chosenUnitMeasurement === "cup")
        conversionMultiplier = 1 / 16.231;
      else if (chosenUnitMeasurement === "liter")
        conversionMultiplier = 1 / 67.628;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 1000 / 67.628;
      else if (chosenUnitMeasurement === "teaspoon") conversionMultiplier = 3;
      else if (chosenUnitMeasurement === "tablespoon") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "gallon")
        conversionMultiplier = 0.0039;
      break;
    case "teaspoon":
      if (chosenUnitMeasurement === "quart") conversionMultiplier = 1 / 192;
      else if (chosenUnitMeasurement === "pint") conversionMultiplier = 1 / 96;
      else if (chosenUnitMeasurement === "cup")
        conversionMultiplier = 1 / 48.692;
      else if (chosenUnitMeasurement === "liter")
        conversionMultiplier = 1 / 202.9;
      else if (chosenUnitMeasurement === "milliliter")
        conversionMultiplier = 1000 / 202.9;
      else if (chosenUnitMeasurement === "teaspoon") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "tablespoon")
        conversionMultiplier = 1 / 3;
      else if (chosenUnitMeasurement === "gallon")
        conversionMultiplier = 1 / 768;
      break;
    case "pound":
      if (chosenUnitMeasurement === "ounce") conversionMultiplier = 16;
      else if (chosenUnitMeasurement === "gram") conversionMultiplier = 453.6;
      else if (chosenUnitMeasurement === "kilogram")
        conversionMultiplier = 1 / 2.205;
      else if (chosenUnitMeasurement === "pound") conversionMultiplier = 1;
      break;
    case "gram":
      if (chosenUnitMeasurement === "ounce") conversionMultiplier = 1 / 28.35;
      else if (chosenUnitMeasurement === "gram") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "kilogram")
        conversionMultiplier = 1 / 1000;
      else if (chosenUnitMeasurement === "pound") conversionMultiplier = 453.6;
      break;
    case "kilogram":
      if (chosenUnitMeasurement === "ounce") conversionMultiplier = 35.274;
      else if (chosenUnitMeasurement === "gram") conversionMultiplier = 1000;
      else if (chosenUnitMeasurement === "kilogram") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "pound") conversionMultiplier = 2.205;
      break;
    case "ounce":
      if (chosenUnitMeasurement === "ounce") conversionMultiplier = 1;
      else if (chosenUnitMeasurement === "gram") conversionMultiplier = 28.35;
      else if (chosenUnitMeasurement === "kilogram")
        conversionMultiplier = 1 / 35.274;
      else if (chosenUnitMeasurement === "pound") conversionMultiplier = 16;
      break;
  }

  return {
    calories:
      (baseCalories / baseQty) * conversionMultiplier * quantityOfChosenUnit,
    protein:
      (baseProtein / baseQty) * conversionMultiplier * quantityOfChosenUnit,
  };
};
