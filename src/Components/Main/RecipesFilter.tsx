import React, { useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import CategoryData from '../../DatabaseTools/category.type';

function RecipesFilter({Categories, setMainFilter, setSecondFilter}:{Categories: Array<CategoryData>, setMainFilter: any, setSecondFilter: any}) {

    const [CurrentMain, setCurrentMain] = useState("");
    const [CurrentSecond, setCurrentSecond] = useState("");
    const [CurrentSeconds, setCurrentSeconds] = useState(new Array<string>());

    useEffect(() => {
        var index = -1;
        Categories.forEach((category, categoryIndex) => {if (category.category === CurrentMain) index = categoryIndex;});
        if (index !== -1) setCurrentSeconds(Categories[index].subcategory);
        else setCurrentSeconds([]);
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

    const ResetFilter = () => {
        setCurrentMain("");
        setCurrentSecond("");
        setMainFilter("");
        setSecondFilter("");
    }

  return (
    <div className="Filter-container">
        <Dropdown className="d-inline">
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="outline-secondary" className="filter-drop">
                {CurrentMain !== "" ? CurrentMain : 'Main...'}
            </Dropdown.Toggle>
            <Dropdown.Menu>{Categories.map((Category) => <Dropdown.Item onClick={() => handleMainChoose(Category.category)}>{Category.category}</Dropdown.Item>)}</Dropdown.Menu>
        </Dropdown>
        <Dropdown className="d-inline">
            <Dropdown.Toggle id="dropdown-autoclose-true" variant="outline-secondary" className="filter-drop">
            {CurrentSecond !== "" ? CurrentSecond : 'Second...'}
            </Dropdown.Toggle>
            <Dropdown.Menu>{CurrentSeconds.map((Category) => <Dropdown.Item onClick={() => handleSecondChoose(Category)}>{Category}</Dropdown.Item>)}</Dropdown.Menu>
        </Dropdown>
        <Button variant="outline-danger" onClick={ResetFilter} className="filter-btn">✗</Button><br />
    </div>
  );
}

export default RecipesFilter;