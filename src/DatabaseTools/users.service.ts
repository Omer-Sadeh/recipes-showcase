import firebase from "../firebase";

const db = firebase.database().ref("/users");

class UsersDataService {
  getAll() {
    return db;
  }

  verify(email: string) {
    var found = false;
    db.once('value', (snapshot) => {
      snapshot.forEach(function(user) {
        if (user.val().email === email) {
          alert(user.val().name + " verified!");
          found = true;
          if (user.key) db.child(user.key).update({verified: true});
        }
      });
    });
    if (!found) {alert("User Not Found!")}
  }
}

export default new UsersDataService();
