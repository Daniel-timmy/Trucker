import React, { useState, useEffect } from "react";
import { Navbar,Nav } from "react-bootstrap"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import {jwtDecode} from "jwt-decode";



const Header = () => {
  const [isAuthorized, setIsAuthorized] = useState(null)
  useEffect(() => {
    auth().catch(() => setIsAuthorized(false))
  }, [])

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
        const res = await api.post("token/refresh/", {
            refresh: refreshToken,
        });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false)
        }

    } catch (error){
        console.log(error);
        setIsAuthorized(false);
    }
};

  const auth = async () => {
          const token = localStorage.getItem(ACCESS_TOKEN);
          if(!token){
              setIsAuthorized(false);
              return;
          }
          const decoded = jwtDecode(token);
          const tokenExpiration = decoded.exp;
          const now = Date.now() / 1000
  
          if (tokenExpiration < now) {
              await refreshToken();
          } else {
              setIsAuthorized(true);
          }
      };
  return (
        <Navbar expand="lg" className="px-3"  bg="transparent" data-bs-theme="dark">
            <Navbar.Brand href="#home">Trucker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              
              <Nav className="me-auto, justify-content-end">
                {isAuthorized && 
                <Nav.Link href="#link">Dashboard</Nav.Link>}
                {isAuthorized && 
                <Nav.Link href="#home">Log out</Nav.Link>}
                {!isAuthorized && 
                <Nav.Link href="#home">Login</Nav.Link>}
                {!isAuthorized && 
                <Nav.Link href="#home">Sign Up</Nav.Link>}
              </Nav>
            </Navbar.Collapse>
        </Navbar>
  )
}

export default Header;