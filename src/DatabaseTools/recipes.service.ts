import firebase from "../firebase";
import RecipeData from "./recipe.type"

const db = firebase.database().ref("/recipes");

class RecipesDataService {
  getAll() {
    return db;
  }

  create(recipe: RecipeData) {
    return db.push(recipe);
  }

  update(key: string, value: any) {
    return db.child(key).update(value);
  }

  delete(key: string) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new RecipesDataService();
