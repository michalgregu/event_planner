import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import colors from "../../../styles/_variables.module.scss";
import BeatLoader from "react-spinners/BeatLoader";

const override = {
  display: "block",
  margin: "150px 150px",
  borderColor: "red",
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <BeatLoader
        color={colors.primary}
        loading={loading}
        cssOverride={override}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
