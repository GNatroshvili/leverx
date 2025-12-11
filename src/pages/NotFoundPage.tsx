import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/scss/reset.scss";
import "../../styles/scss/layout.scss";
import "../../styles/scss/404-not-found.scss";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <body>
      <div className="not-found-wrapper">
        <img
          src="./assets/404.png"
          alt="404-not-found-image"
          className="image"
        />
        <p className="title">404 Page not found</p>
        <p className="description">
          sorry, we can't find the page you're looking for.
        </p>
        <a
          href="/main"
          className="back-to-main-btn clickable"
          onClick={(e) => {
            e.preventDefault();
            navigate("/main");
          }}
        >
          Go to the home page
        </a>
      </div>
    </body>
  );
};

export default NotFoundPage;
