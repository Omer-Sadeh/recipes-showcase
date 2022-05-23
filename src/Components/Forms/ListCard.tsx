import React, { useState } from 'react';
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import DraggableList from './DraggableList';

function ListCard({list, listName, subListType, subListIdx, handleSpecificChange, RemoveFromList, addToList, handleListDrag, removeSubList}:{list: string[], listName: string, subListType: string, subListIdx: number, handleSpecificChange: any, RemoveFromList:any, addToList: any, handleListDrag: any, removeSubList: any}) {

    const [ItemToAdd, setItemToAdd] = useState("");

    const HandlePress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
			HandleSubmit();
		}
	}

    const HandleSubmit = () => {
        addToList(listName, ItemToAdd, subListType, subListIdx);
        setItemToAdd("");
    }

  return ( 
    <Card className="Form-item">
        <Card.Header>
          <InputGroup className="mb-3">
            <FormControl placeholder={"Add to " + listName} className="Form-item" value={ItemToAdd} dir="auto"
              onChange={(event) => setItemToAdd(event.target.value)} onKeyPress={(event) => HandlePress(event)}/>
            <Button variant="outline-secondary" onClick={HandleSubmit}>+</Button>
            {subListType !== "" ? <Button variant="outline-danger" onClick={() => removeSubList(subListType, subListIdx)}>DEL</Button> : null}
          </InputGroup>
        </Card.Header>
        <Card.Body>
          <DraggableList list={list} listName={listName} subListType={subListType} subListIdx={subListIdx} handleListDrag={handleListDrag} handleSpecificChange={handleSpecificChange} RemoveFromList={RemoveFromList}/>
        </Card.Body>
      </Card>
  );
}
export default ListCard;