import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import CategoryData from '../../DatabaseTools/category.type';
import RecipeForm from '../Forms/RecipeForm';
import Hidden from '@material-ui/core/Hidden';
import DynamicItem from '../Lists/DynamicItem';

function RecipeShow({recipe, hide, Categories, Account}:{recipe: any, hide: any, Categories: Array<CategoryData>, Account: string[]}) {

  const [EditMode, setEditMode] = useState(false);

  const renderList = (type: string) => {
    var ListToShow: string[] = []
    var subListsNamesToShow: string[] = []
    var subListsValuesToShow: string[][] = []
    if (type === "Ingredients") {
      ListToShow = recipe.ingredients;
      subListsNamesToShow = recipe.subIngredientsNames;
      subListsValuesToShow = recipe.subIngredientsValues;
    }
    if (type === "Instructions") {
      ListToShow = recipe.instructions;
      subListsNamesToShow = recipe.subInstructionsNames;
      subListsValuesToShow = recipe.subInstructionsValues;
    }

    if (!subListsNamesToShow) return (
      <>
          <p dir="auto" className="Recipe-page-list-title">{type}</p>
          <div className="Recipe-page-divider-sm" />
          {ListToShow ? ListToShow.map((item: string) => <DynamicItem name={item} />) : <p>Nothing to show here...</p> }
      </>
    )
    return (
      <>
          <p dir="auto" className="Recipe-page-list-title">{type}</p>
          <div className="Recipe-page-divider-sm" />
          {ListToShow ? ListToShow.map((item: string) => <DynamicItem name={item} />) : null }
          {subListsNamesToShow ? subListsNamesToShow.map((name: string, idx: number) =>
            <>
              <div className="Recipe-page-divider-xs" />
              <div dir="auto" className="Recipe-page-list-subtitle">{name}</div>
              <div className="Recipe-page-divider-xs" />
              {subListsValuesToShow ? subListsValuesToShow[idx].map((item: string) => <DynamicItem name={item} />) : null}
            </>
          ) : null}
      </>
    )
  }

  if (EditMode) return (
    <RecipeForm currentRecipe={recipe} switchMode={() => setEditMode(!EditMode)} goBack={hide} Categories={Categories} EditMode={true} Account={Account}/>
  );
  else return (
    <div className="Recipe-page-wrapper">
      <p dir="auto" className="Recipe-page-header"><span className="Recipe-page-title">{recipe.name}</span><br/>
        <span className="Recipe-page-subtitle">by {recipe.author}</span></p>
      <div className="Recipe-page-divider-lg" />

      <Hidden smDown>
      <Row className="Recipe-page-body">
        <Col className="Recipe-page-section">{renderList("Ingredients")}</Col>
        <Col className="Recipe-page-section">{renderList("Instructions")}</Col>
      </Row>
      </Hidden>

      <Hidden mdUp>
        <Col className="Recipe-page-section">
          {renderList("Ingredients")}
          <div className="Recipe-page-divider-lg" />
          {renderList("Instructions")}
        </Col>
      </Hidden>

      <Row className="Recipe-page-btns">
        <Col>
          <Button onClick={hide} className="form-btn">Go Back</Button>
          {Account[0] === recipe.author || Account[0] === "Admin" ? <>{' '}<Button className="form-btn" onClick={() => setEditMode(!EditMode)}>Edit Recipe</Button></> : null}
        </Col>
      </Row>
    </div>
  );
}

export default RecipeShow;