import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import UsersDataService from "../../DatabaseTools/users.service";
import RecipesDataService from '../../DatabaseTools/recipes.service';
import CategoriesDataService from "../../DatabaseTools/categories.service";

function AdminToolBar({logout}:{logout: any}) {

  const [UserEmail, setUserEmail] = useState("");
  const [CategoriesData, setCategoriesData] = useState("");
  const [RecipesData, setRecipesData] = useState("");
  const [UsersData, setUsersData] = useState("");

  useEffect(() => {
    CategoriesDataService.getAll().on("value", (items: any) => {setCategoriesData(items.toJSON())});
    RecipesDataService.getAll().on("value", (items: any) => {setRecipesData(items.toJSON())});
    UsersDataService.getAll().on("value", (items: any) => {setUsersData(items.toJSON())});
  }, []);

  const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
    event.preventDefault();
    UsersDataService.verify(UserEmail);
    setUserEmail("");
  };

  const handleNameChange = (event: any) => setUserEmail(event.target.value);

  const download = async () => {
    var snapshot = {"categories": CategoriesData, "recipes": RecipesData, "users": UsersData}
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(snapshot)], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = "snapshot.json";
    a.click();
  }

  return ( 
    <Navbar bg="light" expand="sm" fixed="top" className="DevToolBar">
      <Container>
        <Navbar.Brand>DevTools</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => download()}>Save Backup</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </Nav>

          <Form className="d-flex" onSubmit={handleSubmit}>
            <FormControl type="text" value={UserEmail} placeholder="User Email" className="me-2" onChange={(event) => handleNameChange(event)}/>
            <Button variant="outline-success" type="submit">validate</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default AdminToolBar;