import React from "react";

interface ButtonGroupProps {
  canEdit: boolean;
  isEditMode: boolean;
  handleEditClick: () => void;
  handleCancelEdit: () => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  canEdit,
  isEditMode,
  handleEditClick,
  handleCancelEdit,
}) => {
  if (!canEdit) return null;

  return (
    <div className="button-group">
      <button
        className={
          isEditMode ? "save-btn action-btn" : "edit-btn action-btn"
        }
        onClick={handleEditClick}
      >
        {isEditMode ? (
          <>
            <img
              src="/assets/save-icon.png"
              alt="save-icon"
              className="btn-icon"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            SAVE
          </>
        ) : (
          <>
            <img
              src="/assets/pencil.png"
              alt="edit-icon"
              className="btn-icon"
            />
            EDIT
          </>
        )}
      </button>
      {isEditMode && (
        <button className="cancel-btn action-btn" onClick={handleCancelEdit}>
          CANCEL
        </button>
      )}
    </div>
  );
};

export default ButtonGroup;
