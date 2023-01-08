import React, { useEffect, useState } from 'react';
import RecipesDataService from "../DatabaseTools/recipes.service";
import RecipesStorageService from "../DatabaseTools/storage.service";
import RecipeData from '../DatabaseTools/recipe.type';
import RecipesList from '../Components/Main/RecipesList';
import RecipeShow from '../Components/Main/RecipeShow';
import CategoryData from '../DatabaseTools/category.type';

function Main({Categories,Ref, setOnMain, OnMain}:{Categories: Array<CategoryData>, Ref: any, setOnMain: any, OnMain: boolean}) {

  const [Recipes, setRecipes] = useState(new Array<RecipeData>());
  const [Images, setImages] = useState({});
  const [RecipeShowToggle, setRecipeShowToggle] = useState(false);
  const [RecipeToShow, setRecipeToShow] = useState(null);

  useEffect(() => {
    // Fetch Recipes from firebse
    RecipesDataService.getAll().on("value", onDataChange);

    // Fetch images from firebase
    const fetchImages = async () => {
      let result = await RecipesStorageService.getStorage().listAll();
      let urlPromises = result.items.map((imageRef) => imageRef.getDownloadURL());
      return Promise.all(urlPromises);
    }
    const fetchNames = async () => {
      let result = await RecipesStorageService.getStorage().listAll();
      let urlPromises = result.items.map((imageRef) => imageRef.name);
      return Promise.all(urlPromises);
    }
    const loadImages = async () => {
      const urls = await fetchImages();
      const names = await fetchNames();
      var ImagesDict = {};
      for (var i = 0; i < urls.length; i++) ImagesDict = {...ImagesDict, [names[i]]: urls[i]};
      setImages(ImagesDict);
    }
    loadImages();
  }, []);

  const onDataChange = (items: any) => {
    let recipes = new Array<RecipeData>();
    items.forEach((item: any) => {
      let key = item.key;
      let data = item.val();
      recipes.push({
        key: key,
        id: data.id,
        name: data.name,
        description: data.description,
        mainCategory: data.mainCategory,
        secondaryCategory: data.secondaryCategory,
        link: data.link,
        author: data.author,
        ingredients: data.ingredients,
        subIngredientsNames: data.subIngredientsNames,
        subIngredientsValues: data.subIngredientsValues,
        instructions: data.instructions,
        subInstructionsNames: data.subInstructionsNames,
        subInstructionsValues: data.subInstructionsValues
      });
    });
    setRecipes(recipes);
  }

  const showRecipe = (id: any) => {
    setRecipeToShow(id);
    setRecipeShowToggle(true);

  }

  const HideRecipe = () => setRecipeShowToggle(false);

  return (
    <div className="Main-wrapper" ref={Ref}>
      {RecipeShowToggle ? <RecipeShow recipe={RecipeToShow} hide={HideRecipe} Categories={Categories}/> :
      <RecipesList Recipes={Recipes} Categories={Categories} ShowRecipe={showRecipe} imgs={Images} setOnMain={setOnMain} OnMain={OnMain} />}
    </div>
  );
}

export default Main;