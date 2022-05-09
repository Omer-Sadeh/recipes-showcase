import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, FloatingLabel, Form, FormControl, InputGroup, Row } from 'react-bootstrap';
import RecipesDataService from '../../DatabaseTools/recipes.service';
import CategoriesDataService from "../../DatabaseTools/categories.service";
import CategoryData from '../../DatabaseTools/category.type';
import firebase from 'firebase';

function RecipeForm({currentRecipe, switchMode, goBack, Categories, EditMode, Account}:{currentRecipe: any, switchMode: any, goBack: any, Categories: Array<CategoryData>, EditMode: boolean, Account: string[]}) {

  // Global Constants
  const [validated, setValidated] = useState(false);
  const [AddMainCategory, setAddMainCategory] = useState(false);
  const [AddSecondCategory, setAddSecondCategory] = useState(false);

  // Form Constants
  const inputRef = useRef<HTMLInputElement>(null);
  const [Seconds, setSeconds] = useState(new Array<string>());
  const [CurrentIngredient, setCurrentIngredient] = useState("");
  const [CurrentInstruction, setCurrentInstruction] = useState("");
  const [NewCategory, setNewCategory] = useState("");
  const [Image , setImage] = useState(null);
  var InitialRecipe;
  if (EditMode) {
    InitialRecipe = currentRecipe;
    if (!InitialRecipe.instructions) InitialRecipe.instructions = []
    if (!InitialRecipe.ingredients) InitialRecipe.ingredients = []
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
    instructions: []
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
  const handleChange = (event: any, key: any) => {
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
    else if (key === "ingredient") setCurrentIngredient(event.target.value);
    else if (key === "instruction") setCurrentInstruction(event.target.value);
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
  const addToList = (list: string) => {
    var TempRecipe = {...RecipeToAdd};
    if (list === "Ingredients" && CurrentIngredient !== "") {
      TempRecipe["ingredients"] = [...TempRecipe["ingredients"], CurrentIngredient];
      setRecipeToAdd(TempRecipe);
      setCurrentIngredient("");
    }
    if (list === "Instructions" && CurrentInstruction !== "") {
      TempRecipe["instructions"] = [...TempRecipe["instructions"], CurrentInstruction];
      setRecipeToAdd(TempRecipe);
      setCurrentInstruction("");
    }
  }
  const HandlePress = (event: any, list: string) => {
		if (event.key === 'Enter') {
      event.preventDefault();
			addToList(list);
		}
	}
  const RemoveFromList = (list: string, item: string) => {
    var tempList;
    var TempRecipe = {...RecipeToAdd};
    list === "Ingredients" ? tempList = TempRecipe["ingredients"].concat() : tempList = TempRecipe["instructions"].concat();
    tempList.splice(tempList.indexOf(item), 1);
    list === "Ingredients" ? TempRecipe["ingredients"] = tempList : TempRecipe["instructions"] = tempList;
    setRecipeToAdd(TempRecipe);
  }

  const handleSpecificChange = (event: any, index: number, list: string) => {
    var TempRecipe = {...RecipeToAdd};
    if (list === "ingredients") TempRecipe.ingredients[index] = event.target.value;
    else TempRecipe.instructions[index] = event.target.value;
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
              <Card className="Form-item">
                <Card.Header>
                  <InputGroup className="mb-3">
                    <FormControl placeholder="Add Ingredient" className="Form-item" value={CurrentIngredient} dir="auto"
                               onChange={(event) => handleChange(event ,"ingredient")} onKeyPress={(event) => HandlePress(event, "Ingredients")}/>
                    <Button variant="outline-secondary"  onClick={() => addToList("Ingredients")}>+</Button>
                  </InputGroup>
                </Card.Header>
                <Card.Body>
                  {RecipeToAdd["ingredients"].map((ingredient: string, index: number) => 
                    <InputGroup className="mb-3">
                      <FormControl value={ingredient} className="Form-item" onChange={(event) => handleSpecificChange(event, index, "ingredients")} dir="auto"/>
                      <Button variant="outline-secondary"  onClick={() => RemoveFromList("Ingredients", ingredient)}>-</Button>
                    </InputGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="Form-item">
                <Card.Header>
                  <InputGroup className="mb-3">
                    <FormControl placeholder="Add Instruction" className="Form-item" value={CurrentInstruction} dir="auto"
                                onChange={(event) => handleChange(event ,"instruction")} onKeyPress={(event) => HandlePress(event, "Instructions")}/>
                    <Button variant="outline-success"  onClick={() => addToList("Instructions")}>+</Button>
                  </InputGroup>
                </Card.Header>
                <Card.Body>
                  {RecipeToAdd["instructions"].map((instruction: string, index: number) => 
                    <InputGroup className="mb-3">
                      <FormControl value={instruction} className="Form-item" onChange={(event) => handleSpecificChange(event, index, "instructions")} dir="auto"/>
                      <Button variant="outline-danger" onClick={() => RemoveFromList("Instructions", instruction)}>-</Button>
                    </InputGroup>
                  )}
                </Card.Body>
              </Card>
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