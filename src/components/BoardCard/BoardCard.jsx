import PropTypes from "prop-types";
import css from "./BoardCard.module.scss";
import { useNavigate } from "react-router-dom";

const BoardCard = ({ board }) => {
  const imageUrl = `https://picsum.photos/300/200?random=${board.id}`;

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/board/${board.id}`)}
      className={css.container}
    >
      <div className={css.imgWrapper}>
        <div
          className={css.img}
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
      </div>
      <div className={css.title}>{board.name}</div>
    </div>
  );
};

BoardCard.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoardCard;
