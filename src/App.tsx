import React, { useEffect, useState } from 'react';
import './App.scss';
import CategoryData from './DatabaseTools/category.type';
import CategoriesDataService from "./DatabaseTools/categories.service";
import Landing from './Pages/Landing';
import Main from './Pages/Main';
import AdminToolBar from './Components/Admin/AdminToolBar';
import Footer from './Components/Admin/Footer';
import { SpinnerInfinity } from 'spinners-react';
import { useScrollBlock } from './Assets/useScrollBlock';

function App() {

  const [Categories, setCategories] = useState(new Array<CategoryData>());
  const [Account, setAccount] = useState(['guest', 'guest']);
  const [loading, setLoading] = useState(true);
  const [blockScroll, allowScroll] = useScrollBlock();


  useEffect(() => {
    blockScroll();
    CategoriesDataService.getAll().on("value", onDataChange);
    setTimeout(() => {
      setLoading(false);
      allowScroll();
    }, 3000);
  }, []);

  const onDataChange = (items: any) => {
    let categories = new Array<CategoryData>();
    items.forEach((item: any) => {
      let key = item.key;
      let data = item.val();        categories.push({
        key: key,
        category: data.category,
        subcategory: data.subcategory
      });
    });
    setCategories(categories);
  }

  return (
    <div className="App">
      {loading ? <div className="LoadingPage"><SpinnerInfinity size={300} thickness={180} speed={110} color="rgba(57, 69, 172, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" /></div> : null}
      {Account[0] === "Admin" ? <AdminToolBar /> : null}
      <Footer />
      <Landing Categories={Categories} Account={Account} setAccount={setAccount}/>
      <Main Categories={Categories} Account={Account}/>
    </div>
  );
}

export default App;
