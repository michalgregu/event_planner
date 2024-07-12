import { useAuth } from "../../contexts/AuthContext"; // Make sure this path is correct
import css from "./NavBar.module.scss";
import Button from "../../components/common/Button/Button";

const NavBar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className={css.navbar}>
      <span>Navbar</span>
      {user && (
        <Button outline onClick={handleLogout}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default NavBar;
