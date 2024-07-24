import { useState } from "react";
import PropTypes from "prop-types";
import { useCard } from "../../contexts/CardContext";
import { useModal } from "../../contexts/ModalContext";
import Button from "../Common/Button/Button";
import css from "./AddNewCard.module.scss";

const AddNewCard = ({ boardId, columnId }) => {
  const [cardName, setCardName] = useState("");
  const { addCard } = useCard();
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cardName.trim()) {
      try {
        await addCard(boardId, columnId, cardName.trim());
        closeModal();
      } catch (error) {
        console.error("Failed to add card:", error);
      }
    }
  };

  return (
    <div className={css.addCardModal}>
      <h2>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Enter card name"
          required
        />
        <Button type="submit">Add Card</Button>
      </form>
    </div>
  );
};

AddNewCard.propTypes = {
  boardId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
};

export default AddNewCard;
