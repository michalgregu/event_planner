import css from "./HomePage.module.scss";
import { useModal } from "../../contexts/ModalContext";
import BoardCard from "../../components/BoardCard/BoardCard";
import AddNewBoard from "../../components/AddNewBoard/AddNewBoard";

const boards = [
  { id: 1, name: "New" },
  { id: 2, name: "Other" },
  { id: 3, name: "Bla" },
  { id: 4, name: "Ble" },
  { id: 5, name: "ASDASD" },
  { id: 6, name: "Dupa" },
  { id: 7, name: "Test" },
  { id: 8, name: "New Test" },
  { id: 9, name: "Other Test" },
];

const HomePage = () => {
  const { openModal } = useModal();

  return (
    <div className={css.container}>
      <div className={css.boards}>
        <div className={css.headerWrapper}>
          <h4>All Boards</h4>
          <button
            className={css.addBtn}
            onClick={() => openModal(<AddNewBoard />)}
          >
            + Add
          </button>
        </div>
        <div className={css.boardsList}>
          {boards.map((board, i) => (
            <BoardCard board={board} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
