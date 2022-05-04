import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import UsersDataService from "../../DatabaseTools/users.service";

function LoginForm({setAccount, goBack}:{setAccount: any, goBack: any}) {

    const [validated, setValidated] = useState(false);
    const [CurrentPassword, setCurrentPassword] = useState("");
    const [Data, setData] = useState(new Map<string, string[]>());

    // Get Users data
    useEffect(() => {
        UsersDataService.getAll().on("value", onDataChange);
      }, []);
      const onDataChange = (items: any) => {
        let users = new Map<string, string[]>();
        items.forEach((item: any) => {
          let data = item.val();
          users.set(data.password, [data.name ,data.mode]);
        });
        setData(users);
      }

      // Check if password checks out and set account accordingly
    const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        if (Data.has(CurrentPassword)) {
            setAccount(Data.get(CurrentPassword));
            goBack();
        }
        else event.stopPropagation();
        setValidated(true);
      };

      const handleChange = (event: any) => setCurrentPassword(event.target.value);

  return (
    <div className="Login-content">
      <p>Please login to do this action:</p>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col>
            <InputGroup>
              <Form.Control type="text" placeholder="Password" onChange={(event) => handleChange(event)} className="Form-item" required/>
              <Button className="form-btn" type="submit">Login</Button>
            </InputGroup>
          </Col>
        </Row>

        <Row> 
          <Col>
            <Button className="form-btn" onClick={goBack}>Go Back</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default LoginForm;