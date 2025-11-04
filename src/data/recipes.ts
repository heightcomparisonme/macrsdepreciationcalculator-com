/**
 * Recipe Database for LunaChef
 * Recipes are tagged with elements (fire/earth/air/water) and dietary preferences
 */

import { ElementType } from "@/lib/moon-elements";

export interface Recipe {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  element: ElementType;
  image: string;
  cookingTime: number;
  difficulty: "easy" | "medium" | "hard";
  servings: number;
  dietType: ("vegetarian" | "vegan" | "meat" | "fish")[];
  tags: string[];
  ingredients: { item: string; itemEn: string; amount: string; }[];
  instructions: string[];
  instructionsEn: string[];
  nutrition?: { calories: number; protein: number; carbs: number; fat: number; };
  lunaExplanation: string;
  lunaExplanationEn: string;
}

export const RECIPES: Recipe[] = [
  {
    id: "wurzel-eintopf",
    name: "Wurzelgemüse-Eintopf",
    nameEn: "Root Vegetable Stew",
    description: "Herzhafter Eintopf mit Karotten, Sellerie und Kartoffeln",
    descriptionEn: "Hearty stew with carrots, celery and potatoes",
    element: "earth",
    image: "/recipes/root-stew.jpg",
    cookingTime: 45,
    difficulty: "easy",
    servings: 4,
    dietType: ["vegetarian", "vegan"],
    tags: ["glutenfrei", "wurzel"],
    ingredients: [
      { item: "Karotten", itemEn: "Carrots", amount: "500g" },
      { item: "Sellerie", itemEn: "Celery", amount: "300g" },
      { item: "Kartoffeln", itemEn: "Potatoes", amount: "400g" },
      { item: "Zwiebeln", itemEn: "Onions", amount: "2" },
      { item: "Gemüsebrühe", itemEn: "Broth", amount: "1L" }
    ],
    instructions: ["Gemüse schälen und würfeln", "In Olivenöl anbraten", "Mit Brühe ablöschen", "30 Min köcheln"],
    instructionsEn: ["Peel and dice vegetables", "Sauté in olive oil", "Add broth", "Simmer 30 min"],
    nutrition: { calories: 220, protein: 5, carbs: 38, fat: 6 },
    lunaExplanation: "An Wurzeltagen werden Nährstoffe besonders gut über Wurzelgemüse aufgenommen.",
    lunaExplanationEn: "On root days, nutrients are particularly well absorbed through root vegetables."
  },
  {
    id: "tomaten-quiche",
    name: "Tomaten-Paprika Quiche",
    nameEn: "Tomato-Pepper Quiche",
    description: "Saftige Quiche mit Tomaten und Paprika",
    descriptionEn: "Juicy quiche with tomatoes and peppers",
    element: "fire",
    image: "/recipes/quiche.jpg",
    cookingTime: 50,
    difficulty: "medium",
    servings: 6,
    dietType: ["vegetarian"],
    tags: ["frucht"],
    ingredients: [
      { item: "Mürbeteig", itemEn: "Pastry", amount: "1" },
      { item: "Tomaten", itemEn: "Tomatoes", amount: "3" },
      { item: "Paprika", itemEn: "Peppers", amount: "2" },
      { item: "Eier", itemEn: "Eggs", amount: "3" },
      { item: "Sahne", itemEn: "Cream", amount: "200ml" }
    ],
    instructions: ["Teig vorbacken", "Gemüse verteilen", "Eiermischung gießen", "35 Min backen"],
    instructionsEn: ["Pre-bake pastry", "Distribute vegetables", "Pour egg mixture", "Bake 35 min"],
    nutrition: { calories: 320, protein: 12, carbs: 28, fat: 18 },
    lunaExplanation: "An Fruchttagen fördern Fruchtgemüse Vitalität und Vitaminaufnahme.",
    lunaExplanationEn: "On fruit days, fruit vegetables promote vitality and vitamin absorption."
  },
  {
    id: "buddha-bowl",
    name: "Grüne Buddha Bowl",
    nameEn: "Green Buddha Bowl",
    description: "Bowl mit Spinat, Avocado und Quinoa",
    descriptionEn: "Bowl with spinach, avocado and quinoa",
    element: "water",
    image: "/recipes/buddha-bowl.jpg",
    cookingTime: 25,
    difficulty: "easy",
    servings: 2,
    dietType: ["vegetarian", "vegan"],
    tags: ["blatt", "glutenfrei"],
    ingredients: [
      { item: "Spinat", itemEn: "Spinach", amount: "200g" },
      { item: "Quinoa", itemEn: "Quinoa", amount: "150g" },
      { item: "Avocado", itemEn: "Avocado", amount: "1" },
      { item: "Kichererbsen", itemEn: "Chickpeas", amount: "1 Dose" }
    ],
    instructions: ["Quinoa kochen", "Zutaten anrichten", "Mit Öl garnieren"],
    instructionsEn: ["Cook quinoa", "Arrange ingredients", "Garnish with oil"],
    nutrition: { calories: 450, protein: 16, carbs: 52, fat: 20 },
    lunaExplanation: "An Blatttagen fördert Blattgemüse Hydration und Mineralstoffaufnahme.",
    lunaExplanationEn: "On leaf days, leafy vegetables promote hydration and mineral absorption."
  },
  {
    id: "blumenkohl-curry",
    name: "Blumenkohl-Curry",
    nameEn: "Cauliflower Curry",
    description: "Curry mit Blumenkohl und Kokosmilch",
    descriptionEn: "Curry with cauliflower and coconut milk",
    element: "air",
    image: "/recipes/cauliflower-curry.jpg",
    cookingTime: 30,
    difficulty: "easy",
    servings: 4,
    dietType: ["vegetarian", "vegan"],
    tags: ["blüte", "glutenfrei"],
    ingredients: [
      { item: "Blumenkohl", itemEn: "Cauliflower", amount: "1" },
      { item: "Kokosmilch", itemEn: "Coconut milk", amount: "400ml" },
      { item: "Currypaste", itemEn: "Curry paste", amount: "2 EL" },
      { item: "Ingwer", itemEn: "Ginger", amount: "2cm" }
    ],
    instructions: ["Blumenkohl teilen", "Curry anbraten", "Mit Kokosmilch köcheln", "15 Min garen"],
    instructionsEn: ["Divide cauliflower", "Sauté curry", "Simmer with coconut milk", "Cook 15 min"],
    nutrition: { calories: 380, protein: 8, carbs: 48, fat: 18 },
    lunaExplanation: "An Blütentagen fördern Blütengemüse Leichtigkeit und Verdauung.",
    lunaExplanationEn: "On flower days, flower vegetables promote lightness and digestion."
  }
];

export function filterRecipes(
  element?: ElementType,
  dietType?: string[],
  maxTime?: number,
  difficulty?: string
): Recipe[] {
  let filtered = [...RECIPES];
  if (element) filtered = filtered.filter(r => r.element === element);
  if (dietType && dietType.length > 0) filtered = filtered.filter(r => dietType.some(dt => r.dietType.includes(dt as any)));
  if (maxTime) filtered = filtered.filter(r => r.cookingTime <= maxTime);
  if (difficulty && difficulty !== "any") filtered = filtered.filter(r => r.difficulty === difficulty);
  return filtered;
}

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find(r => r.id === id);
}
