import React from "react";
import copyIcon from "../../public/assets/copy.png";

const CopyLinkBtn: React.FC = () => {
  return (
    <button className="copy-link-btn">
      <img src={copyIcon} alt="link-icon" className="btn-icon" />
      Copy link
    </button>
  );
};

export default CopyLinkBtn;
