import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// const boardsCollectionRef = collection(db, "boards");

export const useAddBoard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBoard = async (boardName, boardDescription) => {
    setIsLoading(true);
    setError(null);

    try {
      // const user = auth.currentUser;
      // if (!user) throw new Error("User must be logged in to add a board");

      const newBoard = {
        name: boardName,
        description: boardDescription,
        // ownerId: user.uid,
        // memberIds: [user.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "boards"), newBoard);
      setIsLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return null;
    }
  };

  return { addBoard, isLoading, error };
};
