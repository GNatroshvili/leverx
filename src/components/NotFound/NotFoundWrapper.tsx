import React from "react";
import { useNavigate } from "react-router-dom";
import NotFound from "../../public/assets/404.png";

const NotFoundWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-wrapper fade-slide-in">
      <img src={NotFound} alt="404-not-found-image" className="image" />
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
