import firebase from "../firebase";
import UserData from "./user.type";

const db = firebase.database().ref("/users");

class UsersDataService {
  getAll() {
    return db;
  }

  create(user: UserData) {
    return db.push(user);
  }
}

export default new UsersDataService();
