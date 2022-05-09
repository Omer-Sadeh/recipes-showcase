import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Footer from '../Admin/Footer';

function MainMenu({switchAdd, Account, changeAccount, Ref, setOnMain}:{switchAdd: any, Account: string[], changeAccount: any, Ref: any, setOnMain: any}) {

  const HandleAddClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth',});
    if (Account[1] === 'guest') changeAccount();
    else switchAdd();
  }

  const HandleScrollClick = () => {
      setOnMain();
      Ref.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
      <div className="Landing-content">
        <Row><div className="Landing-title">Recipes Site</div></Row>
        <Row><Col /><Col xs="auto"><p onClick={HandleAddClick} className="Landing-btn-layout Landing-btn">Add Recipe</p></Col><Col /></Row>
        <Row><Col /><Col xs="auto"><p onClick={HandleScrollClick} className="Landing-start-btn-layout Landing-btn">Let's Cook!</p></Col><Col /></Row>
        <Footer />
      </div>
  );
}

export default MainMenu;