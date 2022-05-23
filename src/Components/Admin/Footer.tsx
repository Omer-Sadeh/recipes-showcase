import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function Footer() {
  return ( 
    <Navbar fixed="bottom" className="Footer">
          <Nav className="justify-content-center">
            <Nav.Link href="https://omer-sadeh.com/">© Omer Sadeh</Nav.Link>
          </Nav>
    </Navbar>
  );
}
export default Footer;