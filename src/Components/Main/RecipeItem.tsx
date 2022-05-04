import React, { useState } from 'react';

function RecipeItem({recipe, img, ShowRecipe}:{recipe: any, img: any,ShowRecipe: any}) {

    const useFade = () => {
        const [ fade, setFade ] = useState(true);

        const onMouseEnter = () => setFade(false);
        const onMouseLeave = () => setFade(true);
      
        const fadeStyle = !fade ? { backgroundImage: img ? 'url("'+img+'")' : 'none' } :
            { backgroundImage: img ? 'linear-gradient(to right, rgba(255,255,255, 0.7) 0 100%), url("'+img+'")' : 'none' };
      
        return { fadeStyle, onMouseEnter, onMouseLeave };
      };
    const { fadeStyle, ...fadeProps } = useFade();

  return ( 
    <div onClick={ShowRecipe} className="Recipe-wrapper">
        <div dir="auto" className="recipe-header">
            <p><span className="recipe-title">{recipe.name}</span><br />
            <span className="recipe-subtitle">{recipe.mainCategory} - {recipe.secondaryCategory}</span></p>
        </div>
        <div className="recipe-body" style={{ ...fadeStyle, backgroundPosition: 'center', backgroundSize: 'cover'}} {...fadeProps}>
            <p className="recipe-desc">{recipe.description}</p>
        </div>
    </div>
  );
}
export default RecipeItem;