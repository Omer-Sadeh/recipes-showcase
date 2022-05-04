import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import UsersDataService from "../../DatabaseTools/users.service";
import RecipesDataService from '../../DatabaseTools/recipes.service';

function AdminToolBar() {

  const [NewName, setNewName] = useState("");
  const [NewPassword, setNewPassword] = useState("");

  const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
    event.preventDefault();
    if ((NewName !== "") && (NewPassword !== "")) {
      UsersDataService.create({name: NewName, password: NewPassword, mode: 'edit'});
    }
    setNewName("");
    setNewPassword("");
  };

  const handleNameChange = (event: any) => setNewName(event.target.value);
  const handlePassChange = (event: any) => setNewPassword(event.target.value);
  const DeleteAll = () => RecipesDataService.deleteAll();

  return ( 
    <Navbar bg="light" expand="sm" fixed="top" className="DevToolBar">
      <Container>
        <Navbar.Brand>DevTools</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#Main">Recipes</Nav.Link>
            <NavDropdown title="DataBase Actions" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={DeleteAll}>Delete All (CAUTION!)</NavDropdown.Item>
            </NavDropdown>
          </Nav>

          <Form className="d-flex" onSubmit={handleSubmit}>
            <FormControl type="text" value={NewName} placeholder="new user name" className="me-2" onChange={(event) => handleNameChange(event)}/>
            <FormControl type="text" value={NewPassword} placeholder="new user password" className="me-2" onChange={(event) => handlePassChange(event)}/>
            <Button variant="outline-success" type="submit">add</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default AdminToolBar;