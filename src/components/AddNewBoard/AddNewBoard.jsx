import { useState } from "react";
import { useModal } from "../../contexts/ModalContext";
import css from "./AddNewBoard.module.scss";
import { useBoard } from "../../contexts/BoardContext";
import Button from "../../components/Common/Button/Button";

const AddNewBoard = () => {
  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addBoard } = useBoard();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await addBoard(boardName, boardDescription);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.addNewBoard}>
      <h2>Create New Board</h2>
      {error && <p className={css.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={css.inputGroup}>
          <label htmlFor="boardName">Board Name</label>
          <input
            type="text"
            id="boardName"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
          />
        </div>
        <div className={css.inputGroup}>
          <label htmlFor="boardDescription">Description (optional)</label>
          <textarea
            id="boardDescription"
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
          />
        </div>

        <Button fullWidth type="submit" loading={isLoading}>
          Create Board
        </Button>
      </form>
    </div>
  );
};

export default AddNewBoard;
