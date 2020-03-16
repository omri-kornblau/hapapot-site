import React from "react";

import { Container, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Container fluid>
          <Nav>
            <NavItem>
              <NavLink href="javascript:void(0)">Instagram</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="javascript:void(0)">Drive</NavLink>
            </NavItem>
          </Nav>
          </Container>
      </footer>
    );
  }
}

export default Footer;
