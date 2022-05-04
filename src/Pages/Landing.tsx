import React, { useState } from 'react';
import LoginForm from '../Components/Forms/LoginForm';
import RecipeForm from '../Components/Forms/RecipeForm';
import MainMenu from '../Components/Landing/MainMenu';
import CategoryData from '../DatabaseTools/category.type';

function Landing({Categories, Account, setAccount}:{Categories: Array<CategoryData>, Account: string[], setAccount: any}) {

  const [AddSwitch, setAddSwitch] = useState(false);
  const [LoginState, setLoginState] = useState(false);

  const ToggleAddState = () => {setAddSwitch(!AddSwitch);}

  if (LoginState) return (<div className="Landing-wrapper"><LoginForm setAccount={setAccount} goBack={() => setLoginState(!LoginState)} /></div>)
  else return (
    <div className="Landing-wrapper">
      {AddSwitch ? <RecipeForm currentRecipe={null} switchMode={ToggleAddState} goBack={ToggleAddState} Categories={Categories} EditMode={false} Account={Account}/> :
        <MainMenu switchAdd={ToggleAddState} Account={Account} changeAccount={() => setLoginState(!LoginState)} />}
    </div>
  );
}

export default Landing;
