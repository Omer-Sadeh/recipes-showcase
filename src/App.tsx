import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import firebase from "./firebase";
import CategoryData from './DatabaseTools/category.type';
import CategoriesDataService from "./DatabaseTools/categories.service";
import Landing from './Pages/Landing';
import Main from './Pages/Main';
import AdminToolBar from './Components/Admin/AdminToolBar';
import AuthService from "./DatabaseTools/authen.service";
import { useScrollBlock } from './Assets/useScrollBlock';
import Hidden from '@material-ui/core/Hidden';
import LoginPage from './Pages/LoginPage';
import UserPanel from './Components/Admin/UserPanel';

function App() {

  const [Categories, setCategories] = useState(new Array<CategoryData>());
  const [LoggedIn, setLoggedIn] = useState(true);
  const [NoGuestLogged, setNoGuestLogged] = useState(true);
  const [OnMain, setOnMain] = useState(false);
  const [blockScroll, allowScroll] = useScrollBlock();
  const REF = useRef<HTMLInputElement>(null);

  const switchMain = () => setOnMain(!OnMain)

  useEffect(() => {
    blockScroll();
    CategoriesDataService.getAll().on("value", onDataChange);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        allowScroll();
      }
      else {
        setLoggedIn(false);
        blockScroll();
      }
    });
  }, []);

  const onDataChange = (items: any) => {
    let categories = new Array<CategoryData>();
    items.forEach((item: any) => {
      let key = item.key;
      let data = item.val();
      categories.push({
        key: key,
        category: data.category,
        hasSubCategory: data.hasSubCategory,
        subcategory: data.subcategory
      });
    });
    setCategories(categories);
  }

  const loginGuest = () => {
    setNoGuestLogged(false);
    allowScroll();
  }

  const logOut = () => {
    AuthService.signout();
    setNoGuestLogged(true);
    blockScroll();
  }

  return (
    <div className="App">
      {!LoggedIn && NoGuestLogged ? <LoginPage procceed={allowScroll} setGuest={loginGuest}/> : null}
      {AuthService.user()?.displayName === "Administrator" ? <AdminToolBar logout={logOut} /> : null}
      {LoggedIn && AuthService.user()?.displayName !== "Administrator" ? <UserPanel logout={logOut} /> : null}

      {/* <Hidden smDown>
        <Landing Categories={Categories} Ref={REF} setOnMain={setOnMain} NoGuestLogged={NoGuestLogged}/>
        <Main Categories={Categories} Ref={REF} setOnMain={switchMain} OnMain={OnMain}/>
      </Hidden> */}

      {/* <Hidden mdUp> */}
        <Landing Categories={Categories} Ref={REF} setOnMain={switchMain} NoGuestLogged={NoGuestLogged}/>
        {OnMain ? <Main Categories={Categories} Ref={REF} setOnMain={switchMain} OnMain={OnMain} /> : null}
      {/* </Hidden> */}
    </div>
  );
}

export default App;
