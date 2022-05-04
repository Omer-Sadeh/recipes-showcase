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
  instructions: string[]
}