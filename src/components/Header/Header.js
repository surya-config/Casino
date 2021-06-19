import React from "react";
import "./Header.css";
import MenuComp from "./MenuComp";

function Header() {
  return (
    <div>
      <div className="header">
        <div className="header__container">
          <div className="header__logo">
            <img src="/images/logo.jpg" alt="CASINO" />
          </div>

          <div className="header__right">
            <MenuComp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
