import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";

import css from "./Board.module.scss";
import { useColumn } from "../../contexts/ColumnContext";
import { useCard } from "../../contexts/CardContext";
import Column from "../Column/Column";

const Board = () => {
  const { id } = useParams();
  const { columns, fetchColumns } = useColumn();
  const { cards: firebaseCards, fetchCards, updateCard } = useCard();
  const [localCards, setLocalCards] = useState([]);
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0);
  const boardRef = useRef(null);

  useEffect(() => {
    fetchColumns(id);
    fetchCards(id);
  }, [id, fetchColumns, fetchCards]);

  useEffect(() => {
    setLocalCards(firebaseCards);
  }, [firebaseCards]);

  const getNewOrder = (
    columnCards,
    destinationIndex,
    sourceColumnId,
    destinationColumnId
  ) => {
    if (columnCards.length === 0) return 1;

    if (destinationIndex === 0) {
      const firstOrder = columnCards[0].order;
      return firstOrder > 0 ? firstOrder / 2 : 0.5; // Ensure it's always less than the first card
    }

    if (destinationIndex >= columnCards.length) {
      const lastOrder = columnCards[columnCards.length - 1].order;
      return lastOrder + 1;
    }

    const prevOrder = columnCards[destinationIndex - 1].order;
    const nextOrder = columnCards[destinationIndex].order;

    // If moving between columns and the orders are the same, ensure a unique order
    if (sourceColumnId !== destinationColumnId && prevOrder === nextOrder) {
      return nextOrder + 0.5;
    }

    // Ensure the new order is always between the previous and next card
    return prevOrder + (nextOrder - prevOrder) / 2;
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const draggedCard = localCards.find((card) => card.id === draggableId);
    if (!draggedCard) {
      console.error("Dragged card not found");
      return;
    }

    // Optimistic update
    const newCards = localCards.filter((card) => card.id !== draggableId);
    const columnCards = newCards
      .filter((card) => card.columnId === destination.droppableId)
      .sort((a, b) => a.order - b.order);

    const newOrder = getNewOrder(
      columnCards,
      destination.index,
      source.droppableId,
      destination.droppableId
    );

    const updatedCard = {
      ...draggedCard,
      columnId: destination.droppableId,
      order: newOrder,
    };

    // Insert the updated card at the correct position
    columnCards.splice(destination.index, 0, updatedCard);
    setLocalCards([...newCards, updatedCard]);

    // Update Firebase
    updateCard(draggableId, {
      columnId: destination.droppableId,
      order: newOrder,
    }).catch((error) => {
      console.error("Failed to update card:", error);
      // Revert to the Firebase state if update fails
      setLocalCards(firebaseCards);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (boardRef.current) {
        const scrollPosition = boardRef.current.scrollLeft;
        const columnWidth = boardRef.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / columnWidth);
        setCurrentColumnIndex(newIndex);
      }
    };

    const boardElement = boardRef.current;
    if (boardElement) {
      boardElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (boardElement) {
        boardElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={css.board} ref={boardRef}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={css.columns}>
          {columns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              cards={localCards.filter((card) => card.columnId === column.id)}
              isActive={index === currentColumnIndex}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
