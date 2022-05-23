export default interface RecipeData {
  key?: string | null,
  id: number,
  name: string,
  description: string,
  mainCategory: string,
  secondaryCategory: string,
  link: string,
  author: string,
  ingredients: string[],
  subIngredientsNames: string[],
  subIngredientsValues: string[][],
  instructions: string[],
  subInstructionsNames: string[],
  subInstructionsValues: string[][]
}