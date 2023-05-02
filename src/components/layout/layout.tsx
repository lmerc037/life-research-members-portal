/*
A simple layout component that contains the main content of the page and a footer. 
it has two sub-components:
  children - The components that are passed as children to this component
  Footer - The footer component that is a part of the layout
The component ensures that the content takes up at least the full height of the viewport.
*/

import React from "react";
import Footer from "./../footer";

type LayoutProps = React.PropsWithChildren<{}>;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <div className="content">{children}</div>
      <Footer />
      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default Layout;
