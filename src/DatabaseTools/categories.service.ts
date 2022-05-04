import firebase from "../firebase";
import CategoryData from "./category.type"

const db = firebase.database().ref("/categories");

class CategoriesDataService {
  getAll() {
    return db;
  }

  create(category: CategoryData) {
    return db.push(category);
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

export default new CategoriesDataService();