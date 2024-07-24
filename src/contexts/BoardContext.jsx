import { createContext, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useAuth } from "./AuthContext";

const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

export const BoardProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBoards = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const boardsQuery = query(
        collection(db, "boards"),
        where("ownerId", "==", user.uid)
      );
      const boardsSnapshot = await getDocs(boardsQuery);
      const fetchedBoards = boardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoards(fetchedBoards);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setError("Failed to fetch boards. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addBoard = async (boardName, boardDescription) => {
    if (!user) throw new Error("User must be logged in to add a board");

    try {
      const newBoard = {
        name: boardName.trim(),
        description: boardDescription.trim(),
        ownerId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "boards"), newBoard);
      setBoards((prevBoards) => [
        ...prevBoards,
        { id: docRef.id, ...newBoard },
      ]);
      return docRef.id;
    } catch (err) {
      console.error("Error adding new board:", err);
      throw new Error("Failed to create board. Please try again.");
    }
  };

  const updateBoard = async (boardId, updatedData) => {
    try {
      await updateDoc(doc(db, "boards", boardId), {
        ...updatedData,
        updatedAt: new Date(),
      });
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === boardId ? { ...board, ...updatedData } : board
        )
      );
    } catch (err) {
      console.error("Error updating board:", err);
      throw new Error("Failed to update board. Please try again.");
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await deleteDoc(doc(db, "boards", boardId));
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.id !== boardId)
      );
    } catch (err) {
      console.error("Error deleting board:", err);
      throw new Error("Failed to delete board. Please try again.");
    }
  };

  const value = {
    boards,
    loading,
    error,
    fetchBoards,
    addBoard,
    updateBoard,
    deleteBoard,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

BoardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
