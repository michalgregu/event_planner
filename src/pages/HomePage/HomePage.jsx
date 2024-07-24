import { useEffect } from "react";
import css from "./HomePage.module.scss";
import colors from "../../styles/_variables.module.scss";
import { useModal } from "../../contexts/ModalContext";
import { useBoard } from "../../contexts/BoardContext";
import BoardCard from "../../components/BoardCard/BoardCard";
import AddNewBoard from "../../components/AddNewBoard/AddNewBoard";
import BeatLoader from "react-spinners/BeatLoader";
import Button from "../../components/Common/Button/Button";

const override = {
  display: "block",
  margin: "150px auto",
  borderColor: "red",
};

const HomePage = () => {
  const { openModal } = useModal();
  const { boards, loading, error, fetchBoards } = useBoard();

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <div className={css.container}>
      <div className={css.boards}>
        <div className={css.headerWrapper}>
          <h4>All Boards</h4>
          <Button onClick={() => openModal(<AddNewBoard />)}>+ Add</Button>
        </div>
        <div className={css.boardsList}>
          {loading && (
            <BeatLoader
              color={colors.primary}
              loading={loading}
              cssOverride={override}
              size={30}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
          {error && <p>Error: {error}</p>}
          {!loading && !error && boards.length === 0 && (
            <p>You dont have any boards yet. Create one to get started!</p>
          )}
          {!loading &&
            !error &&
            boards.map((board) => <BoardCard board={board} key={board.id} />)}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
