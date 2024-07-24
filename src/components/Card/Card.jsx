import { Draggable } from "@hello-pangea/dnd";
import PropTypes from "prop-types";

import { useModal } from "../../contexts/ModalContext";
import css from "./Card.module.scss";
import CardView from "../CardView/CardView";

const Card = ({ card, index }) => {
  const { openModal, closeModal } = useModal();

  const handleCardClick = () => {
    openModal(<CardView card={card} onClose={closeModal} />);
  };

  return (
    <Draggable draggableId={card.id} index={index} type="card">
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`${css.card} ${snapshot.isDragging ? css.isDragging : ""}`}
          onClick={handleCardClick}
        >
          <h3>{card.name}</h3>
        </div>
      )}
    </Draggable>
  );
};

Card.propTypes = {
  card: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default Card;
