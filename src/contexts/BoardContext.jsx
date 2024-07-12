import { createContext, useState, useContext, useCallback } from "react";
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
      const boardMembersQuery = query(
        collection(db, "board_members"),
        where("userId", "==", user.uid)
      );

      const [ownedBoardsSnapshot, memberBoardsSnapshot] = await Promise.all([
        getDocs(boardsQuery),
        getDocs(boardMembersQuery),
      ]);

      const ownedBoards = ownedBoardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        role: "owner",
      }));

      const memberBoardIds = memberBoardsSnapshot.docs.map(
        (doc) => doc.data().boardId
      );

      let memberBoards = [];
      if (memberBoardIds.length > 0) {
        const memberBoardsQuery = query(
          collection(db, "boards"),
          where("id", "in", memberBoardIds)
        );
        const memberBoardsSnapshot = await getDocs(memberBoardsQuery);

        memberBoards = memberBoardsSnapshot.docs.map((doc) => {
          const boardMember = memberBoardsSnapshot.docs.find(
            (memberDoc) => memberDoc.data().boardId === doc.id
          );
          return {
            id: doc.id,
            ...doc.data(),
            role: boardMember.data().role,
          };
        });
      }

      setBoards([...ownedBoards, ...memberBoards]);
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

      await addDoc(collection(db, "board_members"), {
        boardId: docRef.id,
        userId: user.uid,
        role: "owner",
      });

      setBoards((prevBoards) => [
        ...prevBoards,
        { id: docRef.id, ...newBoard, role: "owner" },
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
      await fetchBoards(); // Refresh the boards list
    } catch (err) {
      console.error("Error updating board:", err);
      throw new Error("Failed to update board. Please try again.");
    }
  };

  const deleteBoard = async (boardId) => {
    try {
      await deleteDoc(doc(db, "boards", boardId));
      // Also delete related board_members documents
      const boardMembersQuery = query(
        collection(db, "board_members"),
        where("boardId", "==", boardId)
      );
      const boardMembersSnapshot = await getDocs(boardMembersQuery);
      boardMembersSnapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      await fetchBoards(); // Refresh the boards list
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
