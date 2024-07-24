import { useState, useRef, useEffect } from "react";
import styles from "./EditableField.module.scss";

const EditableField = ({ value, onSave, multiline, className }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSave();
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${styles.editableField} ${className}`}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`${styles.editableField} ${className}`}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${styles.editableField} ${className}`}
    >
      {value}
    </div>
  );
};

export default EditableField;
