import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button, FormControl, InputGroup } from 'react-bootstrap';

function DraggableList({list, listName, subListType, subListIdx, handleListDrag, handleSpecificChange, RemoveFromList}:{list: string[], listName: string, subListType: string, subListIdx: number, handleListDrag: any, handleSpecificChange: any, RemoveFromList:any}) {

    const initial_IDs: string[] = []
    const [IDs, setIDs] = useState(initial_IDs);

    useEffect(() => {
        var temp_IDs: string[] = []
        list.map((item: string, index: number) => {temp_IDs = [...temp_IDs, item+index.toString()]});
        setIDs(temp_IDs);
      }, [list]);

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    boxShadow: isDragging ? '0 4px 8px 0 grey' : 'none',
    ...draggableStyle
    });

  return ( 
    <DragDropContext onDragEnd={handleListDrag}>
        <Droppable droppableId={listName}>
            {(provided: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {list.map((item: string, index: number) => (
                        <Draggable key={IDs[index]} draggableId={IDs[index]} index={index}>
                            {(provided: any, snapshot: any) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}
                                >
                                    <InputGroup className="mb-3">
                                        <FormControl value={item} className="Form-item" onChange={(event) => handleSpecificChange(event, index, listName, subListType, subListIdx)} dir="auto"/>
                                        <Button variant="outline-danger" onClick={() => RemoveFromList(listName, item, subListType, subListIdx)}>-</Button>
                                        <Button variant="outline-secondary" disabled>=</Button>
                                    </InputGroup>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
  );
}
export default DraggableList;