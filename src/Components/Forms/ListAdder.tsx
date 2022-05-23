import React, { useState } from 'react';
import { Button, Card, Form, FormControl, InputGroup, Modal } from 'react-bootstrap';

function ListAdder({list, addFunc}:{list: string, addFunc: any}) {

    const [Show, setShow] = useState(false);
    const [NewName, setNewName] = useState("");

    const HandleSubmit = () => {
        if (NewName !== "") addFunc(list, NewName);
        setShow(false);
        setNewName("");
    }

    const HandlePress = (event: any) => {
        if (event.key === 'Enter') {
            event.preventDefault();
			HandleSubmit();
		}
	}

  return (
    <>
        <p className="Form-List-btn" onClick={() => setShow(true)}>Add sublist...</p>

        <Modal show={Show} onHide={() => setShow(false)} size="sm" aria-labelledby="contained-modal-title-vcenter" centered >
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>New sub-list name:</Form.Label>
                    <Form.Control type="text" onChange={(event) => setNewName(event.target.value)} onKeyPress={(event) => HandlePress(event)} autoFocus />
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={() => setShow(false)}>Cancel</Button>
                <Button onClick={HandleSubmit}>Add</Button>
            </Modal.Footer>
        </Modal>
    </>
  );
}
export default ListAdder;