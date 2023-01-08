import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown, FormControl, InputGroup, Row } from 'react-bootstrap';
import CategoryData from '../../DatabaseTools/category.type';

function RecipesFilter({Categories, setMainFilter, setSecondFilter, setAuthorFilter}:{Categories: Array<CategoryData>, setMainFilter: any, setSecondFilter: any, setAuthorFilter: any}) {

    const [CurrentMain, setCurrentMain] = useState("");
    const [CurrentSecond, setCurrentSecond] = useState("");
    const [CurrentSeconds, setCurrentSeconds] = useState(new Array<string>());
    const [CurrentAuthor, setCurrentAuthor] = useState("");
    const [AuthorEditMode, setAuthorEditMode] = useState(false);

    useEffect(() => {
        var index = -1;
        Categories.forEach((category, categoryIndex) => {if (category.category === CurrentMain) index = categoryIndex;});
        if (index !== -1 && Categories[index].hasSubCategory) setCurrentSeconds(Categories[index].subcategory);
        else setCurrentSeconds(new Array<string>());
      }, [CurrentMain, Categories]);

    const handleMainChoose = (value: string) => {
        setCurrentMain(value);
        setMainFilter(value);
        setCurrentSecond("");
        setSecondFilter("");
    }

    const handleSecondChoose = (value: string) => {
        setCurrentSecond(value);
        setSecondFilter(value);
    }

    const handleAuthorChange = (event : any) => {
        setCurrentAuthor(event.target.value);
    }

    const handleAuthorChoose = () => {
        setAuthorFilter(CurrentAuthor);
        setAuthorEditMode(false);
    }

    const ResetFilter = () => {
        setCurrentMain("");
        setCurrentSecond("");
        setMainFilter("");
        setSecondFilter("");
        setCurrentAuthor("");
        setAuthorFilter("");
    }

    if (AuthorEditMode) return(
        <div className="Filter-container">
            <InputGroup className="Filter-container2">
                <FormControl placeholder="Author's recipes to show" value={CurrentAuthor} onChange={(event) => handleAuthorChange(event)} />
                <Button variant="outline-danger" onClick={() => setAuthorEditMode(false)} className="filter-btn">✗</Button>
                <Button variant="outline-success" onClick={handleAuthorChoose} className="filter-drop">✔</Button>
            </InputGroup>
        </div>
    );
  else return (
    <div className="Filter-container">
        <Dropdown className="d-inline">
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="outline-secondary" className="filter-drop">
                {CurrentMain !== "" ? CurrentMain : 'Main...'}
            </Dropdown.Toggle>
            <Dropdown.Menu>{Categories.map((Category) => <Dropdown.Item onClick={() => handleMainChoose(Category.category)}>{Category.category}</Dropdown.Item>)}</Dropdown.Menu>
        </Dropdown>
        <Dropdown className="d-inline">
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="outline-secondary" className="filter-drop" disabled={CurrentSeconds.length == 0}>
            {CurrentSecond !== "" ? CurrentSecond : 'Second...'}
            </Dropdown.Toggle>
            <Dropdown.Menu>{CurrentSeconds.map((Category) => <Dropdown.Item onClick={() => handleSecondChoose(Category)}>{Category}</Dropdown.Item>)}</Dropdown.Menu>
        </Dropdown>
        <Button variant="outline-secondary" onClick={() => setAuthorEditMode(true)} className="filter-drop">🙂</Button>
        <Button variant="outline-danger" onClick={ResetFilter} className="filter-btn">✗</Button><br />
    </div>
  );
}

export default RecipesFilter;