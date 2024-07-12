import PropTypes from "prop-types";
import css from "./BoardCard.module.scss";

const BoardCard = ({ board }) => {
  const imageUrl = `https://picsum.photos/300/200?random=${board.id}`;

  return (
    <div className={css.container}>
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
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default BoardCard;
