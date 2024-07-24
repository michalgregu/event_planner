import { useAuth } from "../../contexts/AuthContext"; // Make sure this path is correct
import css from "./NavBar.module.scss";
import Button from "../../components/Common/Button/Button";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className={css.navbar}>
      <span onClick={navigateHome}>Home</span>
      {user && (
        <Button outline onClick={handleLogout}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default NavBar;
