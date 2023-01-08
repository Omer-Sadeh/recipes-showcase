import React, { useState } from 'react';
import RecipeForm from '../Components/Forms/RecipeForm';
import MainMenu from '../Components/Landing/MainMenu';
import CategoryData from '../DatabaseTools/category.type';

function Landing({Categories, Ref, setOnMain, NoGuestLogged}:{Categories: Array<CategoryData>, Ref: any, setOnMain: any, NoGuestLogged: boolean}) {

  const [AddSwitch, setAddSwitch] = useState(false);

  const ToggleAddState = () => {setAddSwitch(!AddSwitch);}

  return (
    <div className="Landing-wrapper">
      {AddSwitch ? <RecipeForm currentRecipe={null} switchMode={ToggleAddState} goBack={ToggleAddState} Categories={Categories} EditMode={false}/> :
        <MainMenu switchAdd={ToggleAddState} Ref={Ref} setOnMain={setOnMain} NoGuestLogged={NoGuestLogged}/>}
    </div>
  );
}

export default Landing;
