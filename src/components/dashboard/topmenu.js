
import "../../App.css"; // Keep for common styles
import "./Dashboard.css"; // Specific styles for dashboard

import { useState } from "react";
import logo from "../../assets/images/logo-no-background.png";

function Header() {

  return (
    <header className="bg-[#2a3990] mx-auto flex items-center justify-between lg:px-8">
      <div className="flex lg:flex-1 pl-5">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <img alt="" src={logo} className="h-8 w-auto text-white" />
        </a>
      </div>
      <div className="py-6 text-white">
        <a href="#">Sign Out</a>
      </div>
    </header>
  );
}

export default Header;
