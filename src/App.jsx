import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import HomePage from "./pages/HomePage/HomePage";
import Login from "./components/Login/Login";
import BoardPage from "./pages/BoardPage/BoardPage";
import { ModalProvider } from "./contexts/ModalContext";
import { AuthProvider } from "./contexts/AuthContext";
import { BoardProvider } from "./contexts/BoardContext";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

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
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </BoardProvider>
    </AuthProvider>
  );
}

export default App;
