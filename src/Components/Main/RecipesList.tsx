import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import CategoryData from '../../DatabaseTools/category.type';
import RecipeItem from './RecipeItem';
import RecipesFilter from './RecipesFilter';

function RecipesList({Recipes, Categories, ShowRecipe, imgs}:{Recipes: any[], Categories: Array<CategoryData>, ShowRecipe: any, imgs: any}) {

  const [RecipesToShow, setRecipesToShow] = useState(Recipes);
  const [MainFilter, setMainFilter] = useState("");
  const [SecondFilter, setSecondFilter] = useState("");

  useEffect(() => { // Update shown recipes according to filters
    var tempRecipesToShow = Recipes.concat();
    if (MainFilter !== "") tempRecipesToShow = tempRecipesToShow.filter((recipe) => recipe.mainCategory === MainFilter);
    if (SecondFilter !== "") tempRecipesToShow = tempRecipesToShow.filter((recipe) => recipe.secondaryCategory === SecondFilter);
    setRecipesToShow(tempRecipesToShow)
  }, [Recipes, MainFilter, SecondFilter]);

  const handleMainChange = (value: string) => {
    setMainFilter(value);
    setSecondFilter("");
  }
  const handleSecondaryChange = (value: string) => {setSecondFilter(value)}

  return (
    <div className="List-wrapper">
        <div className="Menu-title"><p>Menu</p></div>
        <RecipesFilter Categories={Categories} setMainFilter={handleMainChange} setSecondFilter={handleSecondaryChange} />
        {RecipesToShow.length === 0 ? <><br />No Recipes To Show</> :
          <Container className="List-container">
              {RecipesToShow.map((recipe) => (
                <RecipeItem recipe={recipe} img={imgs[recipe.id]} ShowRecipe={() => ShowRecipe(recipe)}/>
              ))}
          </Container>}
      </div>
  );
}

export default RecipesList;