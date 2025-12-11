import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default NotFoundWrapper;
