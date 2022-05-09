import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import CategoryData from '../../DatabaseTools/category.type';
import RecipeForm from '../Forms/RecipeForm';
import Hidden from '@material-ui/core/Hidden';

function RecipeShow({recipe, hide, Categories, Account}:{recipe: any, hide: any, Categories: Array<CategoryData>, Account: string[]}) {

  const [EditMode, setEditMode] = useState(false);
  const handleEditSwitch = () => {setEditMode(!EditMode)}

  const renderIngredients = () => {
    return(
      <>
        <p>Ingredients</p>
        <div className="Recipe-page-divider-sm" />
        {recipe.ingredients ? <>{recipe.ingredients.map((ingredient: string) => <p dir="auto">{ingredient}</p>)}</> : <p>No ingredients to show</p>}
      </>
    );
  }

  const renderInstructions = () => {
    return(
      <>
        <p>Instructions</p>
        <div className="Recipe-page-divider-sm" />
        {recipe.instructions ? <>{recipe.instructions.map((instruction: string) => <p dir="auto">{instruction}</p>)}</> : <p>No instructions to show</p>}
      </>
    );
  }

  if (EditMode) return (
    <RecipeForm currentRecipe={recipe} switchMode={handleEditSwitch} goBack={hide} Categories={Categories} EditMode={true} Account={Account}/>
  );

  else return (
    <div className="Recipe-page-wrapper">
      <p dir="auto" className="Recipe-page-header"><span className="Recipe-page-title">{recipe.name}</span><br/>
        <span className="Recipe-page-subtitle">by {recipe.author}</span></p>
      <div className="Recipe-page-divider-lg" />

      <Hidden smDown>
      <Row className="Recipe-page-body">
        <Col className="Recipe-page-section">{renderIngredients()}</Col>
        <Col className="Recipe-page-section">{renderInstructions()}</Col>
      </Row>
      </Hidden>

      <Hidden mdUp>
        <Col className="Recipe-page-section">
          {renderIngredients()}
          <div className="Recipe-page-divider-lg" />
          {renderInstructions()}
        </Col>
      </Hidden>

      <Row className="Recipe-page-btns">
        <Col>
          <Button onClick={hide} className="form-btn">Go Back</Button>
          {Account[0] === recipe.author || Account[0] === "Admin" ? <>{' '}<Button className="form-btn" onClick={handleEditSwitch}>Edit Recipe</Button></> : null}
        </Col>
      </Row>
    </div>
  );
}

export default RecipeShow;