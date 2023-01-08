import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import CategoryData from '../../DatabaseTools/category.type';
import RecipeItem from './RecipeItem';
import RecipesFilter from './RecipesFilter';

function RecipesList({Recipes, Categories, ShowRecipe, imgs, setOnMain, OnMain}:{Recipes: any[], Categories: Array<CategoryData>, ShowRecipe: any, imgs: any, setOnMain: any, OnMain: boolean}) {

  const [RecipesToShow, setRecipesToShow] = useState(Recipes);
  const [MainFilter, setMainFilter] = useState("");
  const [SecondFilter, setSecondFilter] = useState("");
  const [AuthorFilter, setAuthorFilter] = useState("");

  useEffect(() => { // Update shown recipes according to filters
    var tempRecipesToShow = Recipes.concat();
    if (MainFilter !== "") tempRecipesToShow = tempRecipesToShow.filter((recipe) => recipe.mainCategory === MainFilter);
    if (SecondFilter !== "") tempRecipesToShow = tempRecipesToShow.filter((recipe) => recipe.secondaryCategory === SecondFilter);
    if (AuthorFilter !== "") tempRecipesToShow = tempRecipesToShow.filter((recipe) => recipe.author === AuthorFilter);
    setRecipesToShow(tempRecipesToShow)
  }, [Recipes, MainFilter, SecondFilter, AuthorFilter]);

  const handleMainChange = (value: string) => {
    setMainFilter(value);
    setSecondFilter("");
  }
  const handleSecondaryChange = (value: string) => {setSecondFilter(value)}
  const handleAuthorChange = (value: string) => {setAuthorFilter(value)}

  return (
    <div className="List-wrapper">
        <div className="Menu-title"><p>Menu</p></div>
        <RecipesFilter Categories={Categories} setMainFilter={handleMainChange} setSecondFilter={handleSecondaryChange} setAuthorFilter={handleAuthorChange} />
        {RecipesToShow.length === 0 ? <><br />No Recipes To Show<br /></> :
          <Container className="List-container">
              {RecipesToShow.map((recipe) => (
                <RecipeItem recipe={recipe} img={imgs[recipe.id]} ShowRecipe={() => ShowRecipe(recipe)}/>
              ))}
          </Container>}
        {OnMain ? <Button variant="outline-secondary" onClick={setOnMain} className="form-btn" >Go Back</Button> : null}
      </div>
  );
}

export default RecipesList;