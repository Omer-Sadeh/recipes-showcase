import firebase from "../firebase";
import emailjs from 'emailjs-com';

const db = firebase.database();

class AuthService {
  login(email: string, password: string, successFunc: any) {
    firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
              var isVerfied = false;
              db.ref('users/' + firebase.auth().currentUser?.uid).once('value', (snapshot) => {
                if (snapshot.child('verified').val() === true) isVerfied = true;
              }).then(() => {
                if (isVerfied) successFunc();
                else {
                  this.signout();
                  alert("Please wait for the administrator to verify your account.");
                }
              }).catch(this.errorHandler);
            }).catch(this.errorHandler);
  }

  register(email: string, password: string, password2: string, DisplayName: string, eventTarget: any) {
    const date = new Date();
    if (password !== password2) {
      alert("Passwords don't match!");
      return;
    }
    if (DisplayName === "") {
      alert("Must choose a display name!");
      return;
    }
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser?.updateProfile({displayName : DisplayName}).then(()=>{
            db.ref('users/' + firebase.auth().currentUser?.uid)
            .set({
                name: DisplayName,
                email: email,
                CreationDate: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
                verified: "false"
            }).then(() => {
              this.signout();
              emailjs.sendForm('gmail', 'template_sa640lh', eventTarget, 'bJIII5c9E__nohJhJ');
              alert("Signup request sent. Wait for the administrator to verify your account.");
            })
          }).catch(this.errorHandler);
      }).catch(this.errorHandler);
  }

  user() {
      return firebase.auth().currentUser;
  }

  signout() {
    firebase.auth().signOut()
      .then(() => {
        console.log("logout success");
    }).catch(this.errorHandler);
  }

  errorHandler(error: any) {
    console.log(error.code);
    alert(error.message);
  }
}

export default new AuthService();