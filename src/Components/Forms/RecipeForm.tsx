import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, FloatingLabel, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import RecipesDataService from '../../DatabaseTools/recipes.service';
import CategoriesDataService from "../../DatabaseTools/categories.service";
import CategoryData from '../../DatabaseTools/category.type';
import firebase from 'firebase';
import ListCard from './ListCard';
import ListAdder from './ListAdder';

function RecipeForm({currentRecipe, switchMode, goBack, Categories, EditMode, Account}:{currentRecipe: any, switchMode: any, goBack: any, Categories: Array<CategoryData>, EditMode: boolean, Account: string[]}) {

  // Global Constants
  const [validated, setValidated] = useState(false);
  const [AddMainCategory, setAddMainCategory] = useState(false);
  const [AddSecondCategory, setAddSecondCategory] = useState(false);

  // Form Constants
  const inputRef = useRef<HTMLInputElement>(null);
  const [Seconds, setSeconds] = useState(new Array<string>());
  const [NewCategory, setNewCategory] = useState("");
  const [Image , setImage] = useState(null);
  var InitialRecipe;
  if (EditMode) {
    InitialRecipe = currentRecipe;
    if (!InitialRecipe.instructions) InitialRecipe.instructions = [];
    if (!InitialRecipe.ingredients) InitialRecipe.ingredients = [];
    if (!InitialRecipe.subIngredientsNames) InitialRecipe.subIngredientsNames = [];
    if (!InitialRecipe.subIngredientsValues) InitialRecipe.subIngredientsValues = [];
    if (!InitialRecipe.subInstructionsNames) InitialRecipe.subInstructionsNames = [];
    if (!InitialRecipe.subInstructionsValues) InitialRecipe.subInstructionsValues = [];
  }
  else InitialRecipe = {
    id: new Date().getTime(),
    name: "",
    description: "",
    mainCategory: "",
    secondaryCategory:"",
    link: "",
    author: Account[0],
    ingredients: [],
    subIngredientsNames: [],
    subIngredientsValues: [],
    instructions: [],
    subInstructionsNames: [],
    subInstructionsValues: []
  }
  const [RecipeToAdd, setRecipeToAdd] = useState(InitialRecipe);

  // Keep categories shown updated
  useEffect(() => {
    var index = -1;
    Categories.forEach((category, categoryIndex) => {if (category.category === RecipeToAdd.mainCategory) index = categoryIndex;});
    if (index !== -1) setSeconds(Categories[index].subcategory)
  }, [RecipeToAdd, Categories]);

  // Handle From Submission
  const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity()) {
      if (Image !== null) firebase.storage().ref('/images/' + RecipeToAdd.id).put(Image);

      // remove empty sub-lists
      var empties: number[] = []
      RecipeToAdd.subInstructionsValues.map((val: string[], idx: number) => {if (val.length < 1) empties.push(idx);});
      for (let idx of empties.sort().reverse()) removeSubList("instructions", idx);
      empties = [];
      RecipeToAdd.subIngredientsValues.map((val: string[], idx: number) => {if (val.length < 1) empties.push(idx);});
      for (let idx of empties.sort().reverse()) removeSubList("ingredients", idx);


      if (EditMode) RecipesDataService.update(currentRecipe.key, RecipeToAdd);
      else RecipesDataService.create(RecipeToAdd);
      goBack();
    }
    else event.stopPropagation();
    setValidated(true);
  };

  const DeleteRecipe = () => {
    RecipesDataService.delete(currentRecipe.key);
    goBack();
  }

  // Handle Form Inputs
  const handleChange = (event: any, key: string) => {
    var TempRecipe = {...RecipeToAdd};
    if (key === "mainCategory") {
      if (event.target.value === "ADD") setAddMainCategory(true);
      else if (event.target.value === "null") {
        TempRecipe[key] = "";
        setRecipeToAdd(TempRecipe);
      }
      else { 
        TempRecipe["mainCategory"] = event.target.value;
        setRecipeToAdd(TempRecipe);
      }
    }
    else if (key === "SECOND") {
      if (event.target.value === "ADD") setAddSecondCategory(true);
      else if (event.target.value === "null") {
        TempRecipe["secondaryCategory"] = "";
        setRecipeToAdd(TempRecipe);
      }
      else { 
        TempRecipe["secondaryCategory"] = event.target.value;
        setRecipeToAdd(TempRecipe);
      }
    }
    else if (key === "img") setImage(event.target.files[0]);
    else setRecipeToAdd({...RecipeToAdd, [key]: event.target.value});
  }

  // Handle new category adding
  const handleCategoryAddChange = (event: { target: { value: any; }; }) => { setNewCategory(event.target.value); }
  const HandleCategoryAddSubmit = (input: string) => {
    if (input === "MAIN") {
      CategoriesDataService.create({ category: NewCategory, subcategory: []});
    }
    if (input === "SECOND") {
      var index = -1;
      Categories.forEach((category, categoryIndex) => {if (category.category === RecipeToAdd["mainCategory"]) index = categoryIndex;});
      if (Categories[index].subcategory === undefined) {
        CategoriesDataService.update(Categories[index].key + "", { subcategory: [NewCategory]});
      }
      else CategoriesDataService.update(Categories[index].key + "", { subcategory: [...Categories[index].subcategory, NewCategory]});
    }
    setNewCategory("");
    setAddMainCategory(false);
    setAddSecondCategory(false);
  }

  // Handle Ingredients & Instructions Lists
  const addToList = (list: string, value: string, type: string, idx: number) => {
    var TempRecipe = {...RecipeToAdd};
    if (value !== "") {
      if (list === "ingredients" || list === "instructions") TempRecipe[list] = [...TempRecipe[list], value];
      else {
        type === "ingredients" ? TempRecipe.subIngredientsValues[idx] = [...TempRecipe.subIngredientsValues[idx], value] :
                                TempRecipe.subInstructionsValues[idx] = [...TempRecipe.subInstructionsValues[idx], value];
      }
      setRecipeToAdd(TempRecipe);
    }
  }

  const RemoveFromList = (list: string, item: string, type: string, idx: number) => {
    var TempRecipe = {...RecipeToAdd};
    if (list === "ingredients" || list === "instructions") TempRecipe[list].splice(TempRecipe[list].indexOf(item), 1);
    else {
      if (type === "ingredients") {
        TempRecipe.subIngredientsValues[idx].splice(TempRecipe.subIngredientsValues[idx].indexOf(item), 1);
      }
      else TempRecipe.subInstructionsValues[idx].splice(TempRecipe.subInstructionsValues[idx].indexOf(item), 1);
    }
    setRecipeToAdd(TempRecipe);
  }

  const handleSpecificChange = (event: any, index: number, list: string, type: string, listIdx: number) => {
    var TempRecipe = {...RecipeToAdd};
    if (list === "ingredients" || list === "instructions") TempRecipe[list][index] = event.target.value;
    else {
      if (type === "ingredients") TempRecipe.subIngredientsValues[listIdx][index] = event.target.value;
      else TempRecipe.subInstructionsValues[listIdx][index] = event.target.value;
    }
    setRecipeToAdd(TempRecipe);
  }

  const handleItemDrag = (droppedItem: any, list: string, type: string, idx: number) => {
		if (!droppedItem.destination) return;
    var TempRecipe = {...RecipeToAdd};
    var [reorderedItem] = [""];

    if (list === "ingredients" || list === "instructions") {
      [reorderedItem] = TempRecipe[list].splice(droppedItem.source.index, 1);
      TempRecipe[list].splice(droppedItem.destination.index, 0, reorderedItem);
    }
    else {
      if (type === "ingredients") {
        [reorderedItem] = TempRecipe.subIngredientsValues[idx].splice(droppedItem.source.index, 1);
        TempRecipe.subIngredientsValues[idx].splice(droppedItem.destination.index, 0, reorderedItem);
      }
      else {
        [reorderedItem] = TempRecipe.subInstructionsValues[idx].splice(droppedItem.source.index, 1);
        TempRecipe.subInstructionsValues[idx].splice(droppedItem.destination.index, 0, reorderedItem);
      }
    }

		setRecipeToAdd(TempRecipe);
	};

  const renderList = (list: string, type: string = "", idx: number = 0) => {
    if (list === "ingredients" || list === "instructions") return (
      <ListCard
        list={RecipeToAdd[list]}
        listName={list}
        subListType={""}
        subListIdx={idx}
        handleSpecificChange={handleSpecificChange}
        RemoveFromList={RemoveFromList}
        addToList={addToList}
        handleListDrag={(droppedItem: any) => handleItemDrag(droppedItem, list, type, idx)}
        removeSubList={removeSubList}
      />
    );
    else return (
      <ListCard
        list={type === "ingredients" ? RecipeToAdd.subIngredientsValues[idx] : RecipeToAdd.subInstructionsValues[idx]}
        listName={list}
        subListType={type}
        subListIdx={idx}
        handleSpecificChange={handleSpecificChange}
        RemoveFromList={RemoveFromList}
        addToList={addToList}
        handleListDrag={(droppedItem: any) => handleItemDrag(droppedItem, list, type, idx)}
        removeSubList={removeSubList}
      />
    );
  }

  const addSubList = (list: string, name: string) => {
    var TempRecipe = {...RecipeToAdd};
    if (list === "ingredients") {
      TempRecipe.subIngredientsNames = [...TempRecipe.subIngredientsNames, name];
      TempRecipe.subIngredientsValues = [...TempRecipe.subIngredientsValues, []];
    }
    if (list === "instructions") {
      TempRecipe.subInstructionsNames = [...TempRecipe.subInstructionsNames, name];
      TempRecipe.subInstructionsValues = [...TempRecipe.subInstructionsValues, []];
    }
    setRecipeToAdd(TempRecipe);
  }

  const removeSubList = (subListType: string, subListIdx: number) => {
    var TempRecipe = {...RecipeToAdd};
    if (subListType === "ingredients") {
      TempRecipe.subIngredientsNames.splice(subListIdx, 1);
      TempRecipe.subIngredientsValues.splice(subListIdx, 1);
    }
    else {
      TempRecipe.subInstructionsNames.splice(subListIdx, 1);
      TempRecipe.subInstructionsValues.splice(subListIdx, 1);
    }
    setRecipeToAdd(TempRecipe);
  }

  return (
      <div className="Form-content">
        <p className="Form-title">{EditMode ? 'Edit Recipe!' : 'Add Recipe!'}</p>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>

          <Row className="align-items-center Form-Row">

            <Col>
              <Form.Group  className="mb-3" controlId="formTitle">
                <FloatingLabel label="Recipe's Title" className="RecipeLabel">
                  <Form.Control type="text" placeholder="Recipe's Title" value={RecipeToAdd.name} onChange={(event) => handleChange(event ,"name")} className="Form-item" required/>
                </FloatingLabel>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3" controlId="formMCategory">
                {AddMainCategory ? <InputGroup><FormControl placeholder="New Main Category" onChange={handleCategoryAddChange}/>
                  <Button variant="outline-success" onClick={() => HandleCategoryAddSubmit("MAIN")}>✔</Button>
                  <Button variant="outline-danger" onClick={() => HandleCategoryAddSubmit("CANCEL")}>✘</Button></InputGroup> : 
                  <FloatingLabel label="Main Category" className="RecipeLabel">
                    <Form.Select onChange={(event) => handleChange(event ,"mainCategory")} value={RecipeToAdd.mainCategory}>
                      <option value="null">Choose:</option>
                      {Categories.map((Category) => <option value={Category.category}>{Category.category}</option>)}
                      <option value="ADD">Add category...</option>
                    </Form.Select>
                  </FloatingLabel>}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3" controlId="formSCategory">
                {AddSecondCategory ? <InputGroup><FormControl placeholder="New Second Category" onChange={handleCategoryAddChange}/>
                  <Button variant="outline-success" onClick={() => HandleCategoryAddSubmit("SECOND")}>✔</Button>
                  <Button variant="outline-danger" onClick={() => HandleCategoryAddSubmit("CANCEL")}>✘</Button></InputGroup> : 
                  <FloatingLabel label="Second Category" className="RecipeLabel">
                    <Form.Select onChange={(event) => handleChange(event ,"SECOND")} value={RecipeToAdd.secondaryCategory} disabled={RecipeToAdd["mainCategory"] === ""}>
                      <option value="null">Choose:</option>
                      {Seconds !== undefined ? Seconds.map((second) => <option value={second}>{second}</option>) : null}
                      <option value="ADD">Add category...</option>
                    </Form.Select>
                  </FloatingLabel>}
              </Form.Group>
            </Col>

          </Row>

          <Row className="align-items-center Form-Row">

            <Col>
              <Form.Group className="mb-3" controlId="formDescription">
                <FloatingLabel label="Short Description" className="RecipeLabel">
                  <Form.Control type="text" value={RecipeToAdd.description} placeholder="Short Description" onChange={(event) => handleChange(event ,"description")} className="Form-item"/>
                </FloatingLabel>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3" controlId="formLinkAdd">
                <FloatingLabel label="Link (include http://)" className="RecipeLabel">
                  <Form.Control type="url" value={RecipeToAdd.link} placeholder="Link" onChange={(event) => handleChange(event ,"link")} pattern="https?://.+" className="Form-item"/>
                </FloatingLabel>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3" controlId="formLink">
                <Button variant="light" className="upload-btn" title="UPLOAD" onClick={() => inputRef.current?.click()}>Upload Recipe Image</Button>
                <input type="file" className="d-none" id="fileupload" ref={inputRef} multiple={false} accept="image/*" onChange={(event) => handleChange(event ,"img")} />
              </Form.Group>
            </Col>

          </Row>

          <Row className="align-items-center Form-Row">

          <Col>
            {renderList("ingredients")}
            {RecipeToAdd.subIngredientsNames.map((name: string, idx: number) => renderList(name, "ingredients", idx))}
            <ListAdder list={"ingredients"} addFunc={addSubList} />
          </Col>

          <Col>
            {renderList("instructions")}
            {RecipeToAdd.subInstructionsNames.map((name: string, idx: number) => renderList(name, "instructions", idx))}
            <ListAdder list={"instructions"} addFunc={addSubList} />
          </Col>

          </Row>

          <Row className="align-items-center Form-Row">
            {EditMode ? 
              <Col><br /><Button className="form-btn" type="submit">Save Edit</Button>
              {' '}
              <Button className="form-btn" onClick={DeleteRecipe}>Delete Recipe</Button>
              {' '}
              <Button className="form-btn" onClick={switchMode}>Cancel Edit</Button></Col> :
              <Col><br /><Button className="form-btn" type="submit">Add</Button>
              {' '}
              <Button onClick={switchMode} className="form-btn">Go Back</Button></Col>
            }
          </Row>
        </Form>
      </div>
  );
}

export default RecipeForm;