import React from "react";
import Header from "./Header";

const Layout = ({ ContentComponent }) => {
  return (
    <div>
      <div>
        <div>
          <Header />
        </div>
        <div className="flex flex-col">
          <div>{ContentComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
