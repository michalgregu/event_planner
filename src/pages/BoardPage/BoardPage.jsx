import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useBoard } from "../../contexts/BoardContext";

import BoardPageNavigation from "../../components/BoardPageNavigation/BoardPageNavigation";
import Board from "../../components/Board/Board";
import css from "./BoardPage.module.scss";


const BoardPage = () => {
  const { id } = useParams();
  const { boards, fetchBoards } = useBoard();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetchBoards();
  }, [id, fetchBoards]);

  useEffect(() => {
    const currentBoard = boards.find((b) => b.id === id);
    setBoard(currentBoard);
  }, [boards, id]);

  if (!board) return <div>Loading...</div>;

  return (
    <div className={css.board}>
      <BoardPageNavigation board={board} />
      <Board />
    </div>
  );
};

export default BoardPage;
