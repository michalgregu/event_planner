import { useState } from "react";
import PropTypes from "prop-types";
import { useColumn } from "../../contexts/ColumnContext";
import { useModal } from "../../contexts/ModalContext";
import Button from "../Common/Button/Button";
import css from "./AddNewColumn.module.scss";

const AddNewColumn = ({ boardId }) => {
  const [columnName, setColumnName] = useState("");
  const { addColumn } = useColumn();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (columnName.trim()) {
      try {
        await addColumn(boardId, columnName.trim());
        closeModal();
      } catch (error) {
        console.error("Failed to add column:", error);
      }
    }
  };

  return (
    <div className={css.addColumnModal}>
      <h2>Add New Column</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          placeholder="Enter column name"
          required
        />
        <Button type="submit">Add Column</Button>
      </form>
    </div>
  );
};

AddNewColumn.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default AddNewColumn;
