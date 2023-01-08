import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import AuthService from "../../DatabaseTools/authen.service";

function UserPanel({logout}:{logout: any}) {

  return ( 
    <Navbar fixed="top" className="UserPanel">
          <Nav className="justify-content-center">
            <div><p className="">{AuthService.user()?.displayName} - <span onClick={logout} className="panel-link">logout</span></p></div>
          </Nav>
    </Navbar>
  );
}
export default UserPanel;