import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";

import { useAuth } from "../../contexts/AuthContext";
import { useCard } from "../../contexts/CardContext";

import EditableField from "../Common/EditableField/EditableField";
import Button from "../Common/Button/Button";
import styles from "./CardView.module.scss";

const UrgencyLevels = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

const CardView = ({ card, onClose }) => {
  const { user } = useAuth();
  const { updateCard, deleteCard } = useCard();
  const [cardData, setCardData] = useState(card);

  useEffect(() => {
    setCardData(card);
  }, [card]);

  const handleUpdate = (field, value) => {
    const updatedCard = { ...cardData, [field]: value };
    setCardData(updatedCard);
    updateCard(card.id, { [field]: value });
  };

  const handleDelete = () => {
    deleteCard(card.id);
    onClose();
  };

  const getDueDate = () => {
    if (!cardData.dueDate) return null;

    if (cardData.dueDate && typeof cardData.dueDate.toDate === "function") {
      return cardData.dueDate.toDate();
    }

    return new Date(cardData.dueDate);
  };

  return (
    <div className={styles.cardView}>
      <div className={styles.cardContent}>
        <EditableField
          value={cardData.name}
          onSave={(value) => handleUpdate("name", value)}
          className={styles.title}
        />
        <EditableField
          value={cardData.description}
          onSave={(value) => handleUpdate("description", value)}
          multiline
          className={styles.description}
        />
        <div className={styles.fieldGroup}>
          <label>Due Date:</label>
          <DatePicker
            selected={getDueDate()}
            onChange={(date) => handleUpdate("dueDate", date)}
            dateFormat="MMMM d, yyyy"
            className={styles.datePicker}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label>Owner:</label>
          <span>{cardData.owner || user.email}</span>
        </div>
        <div className={styles.fieldGroup}>
          <label>Urgency:</label>
          <select
            value={cardData.urgency || UrgencyLevels.LOW}
            onChange={(e) => handleUpdate("urgency", e.target.value)}
            className={styles.select}
          >
            {Object.entries(UrgencyLevels).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.dates}>
          <p>Created: {new Date(cardData.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(cardData.updatedAt).toLocaleString()}</p>
        </div>
        <div className={styles.actions}>
          <Button warning onClick={handleDelete}>
            Delete Card
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

CardView.propTypes = {
  card: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CardView;
