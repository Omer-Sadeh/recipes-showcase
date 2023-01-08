import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import AuthService from "../DatabaseTools/authen.service";
import emailjs from 'emailjs-com';

function LoginPage({procceed, setGuest}:{procceed: any, setGuest:any}) {

    const [LoginState, setLoginState] = useState(true);
    const [validated, setValidated] = useState(false);
    const [CurrentPassword, setCurrentPassword] = useState("");
    const [CurrentPassword2, setCurrentPassword2] = useState("");
    const [CurrentEmail, setCurrentEmail] = useState("");
    const [CurrentName, setCurrentName] = useState("");

    const SwitchState = () => {
        setCurrentPassword("");
        setCurrentPassword2("");
        setCurrentEmail("");
        setCurrentName("");
        setLoginState(!LoginState);
    }
    const handlePasswordChange = (event: any) => setCurrentPassword(event.target.value);
    const handlePassword2Change = (event: any) => setCurrentPassword2(event.target.value);
    const handleEmailChange = (event: any) => setCurrentEmail(event.target.value);
    const handleNameChange = (event: any) => setCurrentName(event.target.value);

    const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        if (LoginState) {
            if (CurrentEmail !== "" && CurrentPassword !== "") {
                AuthService.login(CurrentEmail, CurrentPassword, procceed);
            }
        }
        else {
            if (CurrentName !== "Administrator") {
                AuthService.register(CurrentEmail, CurrentPassword, CurrentPassword2, CurrentName, event.currentTarget);
            }
        }
        event.stopPropagation();
        setValidated(true);
      };

      



    const LoginForm = () => {
        return(
            <div className="login-form">
                <p className="login-title">Login</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Enter email" onChange={(event) => handleEmailChange(event)} required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" onChange={(event) => handlePasswordChange(event)} required />
                    </Form.Group>
                    <Button variant="outline-secondary" className="login-btn" type="submit">Login</Button><br /><br />
                </Form>
                <p className="login-subtext">Don't have an account? <span onClick={SwitchState} className="login-link">signup</span> or <span onClick={setGuest} className="login-link">continue as guest</span>.</p>
            </div>
        );
    }

    const SignupForm = () => {
        return(
            <div className="login-form">
                <p className="login-title">Signup</p>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Enter email" onChange={(event) => handleEmailChange(event)} name="req_email" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control type="text" placeholder="Enter Name" onChange={(event) => handleNameChange(event)} name="req_name" required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" onChange={(event) => handlePasswordChange(event)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword2">
                        <Form.Control type="password" placeholder="Repeat Password" onChange={(event) => handlePassword2Change(event)} />
                    </Form.Group>

                    <Button  variant="outline-secondary" className="login-btn" type="submit" value="Send">Signup</Button><br /><br />
                </Form>
                <p className="login-subtext"><span onClick={SwitchState} className="login-link">Back to login</span></p>
            </div>
        );
    }

    return (
        <div className="LoginPage">
            <img src={require("../Assets/cook-login.png")} alt="login-logo" className="login-logo"></img>
            {LoginState ? LoginForm() : SignupForm()}
        </div>
    );
}

export default LoginPage;