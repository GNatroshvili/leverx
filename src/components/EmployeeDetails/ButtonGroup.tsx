import React from "react";
import pencilIcon from "../../public/assets/pencil.png";

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
        className={isEditMode ? "save-btn action-btn" : "edit-btn action-btn"}
        onClick={handleEditClick}
      >
        {isEditMode ? (
          <>SAVE</>
        ) : (
          <>
            <img src={pencilIcon} alt="edit-icon" className="btn-icon" />
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
