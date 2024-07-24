import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import BoardPage from "./pages/BoardPage/BoardPage";
import { ModalProvider } from "./contexts/ModalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { BoardProvider } from "./contexts/BoardContext";
import { CardProvider } from "./contexts/CardContext";
import { ColumnProvider } from "./contexts/ColumnContext";
import PrivateRoute from "./components/Common/PrivateRoute/PrivateRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/board/:id"
          element={
            <PrivateRoute>
              <BoardPage />
            </PrivateRoute>
          }
        />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    )
  );

  return (
    <AuthProvider>
      <BoardProvider>
        <ColumnProvider>
          <CardProvider>
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </CardProvider>
        </ColumnProvider>
      </BoardProvider>
    </AuthProvider>
  );
}

export default App;
