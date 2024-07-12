import { useState } from "react";
import { useAddBoard } from "../../services/firestoreBoards";
import styles from "./AddNewBoard.module.scss";

const AddBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const { addBoard, isLoading, error } = useAddBoard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    const boardId = await addBoard(boardName, boardDescription);
    if (boardId) {
      console.log("Board added successfully with ID:", boardId);
      setBoardName("");
      setBoardDescription("");
      // Here you might want to redirect to the new board or update the UI
    }
  };

  return (
    <div className={styles.addBoard}>
      <h2>Add New Board</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Board Name"
          required
        />
        <textarea
          value={boardDescription}
          onChange={(e) => setBoardDescription(e.target.value)}
          placeholder="Board Description (optional)"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Board"}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default AddBoard;
