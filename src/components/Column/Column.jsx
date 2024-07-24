import PropTypes from "prop-types";
import { Droppable } from "@hello-pangea/dnd";

import css from "./Column.module.scss";
import { useModal } from "../../contexts/ModalContext";
import AddNewCard from "../AddNewCard/AddNewCard";
import Button from "../Common/Button/Button";
import Card from "../Card/Card";

const Column = ({ column, cards, isActive }) => {
  const { openModal } = useModal();

  const handleAddCard = () => {
    openModal(<AddNewCard boardId={column.boardId} columnId={column.id} />);
  };

  return (
    <div className={`${css.column} ${isActive ? css.active : ""}`}>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <div className={css.columnContent}>
              <h2>{column.name}</h2>
              <div className={css.cards}>
                {cards
                  .sort((a, b) => a.order - b.order)
                  .map((card, index) => (
                    <Card key={card.id} card={card} index={index} />
                  ))}
              </div>
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      <Button onClick={handleAddCard}>Add Card</Button>
    </div>
  );
};

Column.propTypes = {
  column: PropTypes.object.isRequired,
  cards: PropTypes.array.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default Column;
