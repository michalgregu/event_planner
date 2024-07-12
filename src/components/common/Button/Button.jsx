import PropTypes from "prop-types";
import { BeatLoader } from "react-spinners";
import styles from "./Button.module.scss";

const Button = ({
  children,
  onClick,
  type = "button",
  secondary = false,
  disabled = false,
  outline = false,
  fullWidth = false,
  warning = false,
  loading = false,
  className = "",
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    fullWidth ? styles.fullWidth : "",
    secondary ? styles.secondary : "",
    outline ? styles.outline : "",
    warning ? styles.warning : "",
    loading ? styles.loading : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <BeatLoader
          color={secondary ? "#5aac44" : "#ffffff"}
          loading={loading}
          size={8}
          aria-label="Loading Spinner"
        />
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  warning: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
