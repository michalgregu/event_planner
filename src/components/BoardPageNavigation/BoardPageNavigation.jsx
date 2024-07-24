import css from "./BoardPageNavigation.module.scss";
import Button from "../Common/Button/Button";
import PropTypes from "prop-types";
import { useModal } from "../../contexts/ModalContext";
import { useAuth } from "../../contexts/AuthContext";
import AddNewColumn from "../AddNewColumn/AddNewColumn";

const BoardPageNavigation = ({ board }) => {
  const { openModal } = useModal();
  const { user } = useAuth();

  const handleAddColumn = () => {
    openModal(<AddNewColumn boardId={board.id} />);
  };

  return (
    <>
      <div className={css.boardHeader}>
        <h1>{board.name}</h1>
        <div className={css.userIcon}>{user?.email[0].toUpperCase()}</div>
        <Button onClick={handleAddColumn}>Add Column</Button>
      </div>
    </>
  );
};

BoardPageNavigation.propTypes = {
  board: PropTypes.object.isRequired,
};

export default BoardPageNavigation;
