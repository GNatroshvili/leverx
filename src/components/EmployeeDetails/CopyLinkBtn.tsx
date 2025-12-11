import React from "react";

const CopyLinkBtn: React.FC = () => {
  return (
    <button className="copy-link-btn">
      <img src="/assets/copy.png" alt="link-icon" className="btn-icon" />
      Copy link
    </button>
  );
};

export default CopyLinkBtn;
