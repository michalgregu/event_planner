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
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";

const CardContext = createContext();

export const useCard = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCards = useCallback(async (boardId) => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    try {
      const cardsQuery = query(
        collection(db, "cards"),
        where("boardId", "==", boardId),
        orderBy("order")
      );
      const cardsSnapshot = await getDocs(cardsQuery);
      const fetchedCards = cardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(fetchedCards);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setError("Failed to fetch cards. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCard = async (boardId, columnId, cardName) => {
    try {
      const newCard = {
        boardId,
        columnId,
        name: cardName.trim(),
        order: cards.filter((card) => card.columnId === columnId).length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "cards"), newCard);
      setCards((prevCards) => [...prevCards, { id: docRef.id, ...newCard }]);
      return docRef.id;
    } catch (err) {
      console.error("Error adding new card:", err);
      throw new Error("Failed to create card. Please try again.");
    }
  };

  const updateCard = async (cardId, updatedData) => {
    try {
      await updateDoc(doc(db, "cards", cardId), {
        ...updatedData,
        updatedAt: new Date(),
      });
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId ? { ...card, ...updatedData } : card
        )
      );
    } catch (err) {
      console.error("Error updating card:", err);
      throw new Error("Failed to update card. Please try again.");
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await deleteDoc(doc(db, "cards", cardId));
      setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
    } catch (err) {
      console.error("Error deleting card:", err);
      throw new Error("Failed to delete card. Please try again.");
    }
  };

  const value = {
    cards,
    loading,
    error,
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
};

CardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
