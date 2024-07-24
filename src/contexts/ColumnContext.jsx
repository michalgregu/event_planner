// src/contexts/ColumnsContext.js
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

const ColumnsContext = createContext();

export const useColumn = () => useContext(ColumnsContext);

export const ColumnProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchColumns = useCallback(async (boardId) => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    try {
      const columnsQuery = query(
        collection(db, "columns"),
        where("boardId", "==", boardId),
        orderBy("order")
      );
      const columnsSnapshot = await getDocs(columnsQuery);
      const fetchedColumns = columnsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setColumns(fetchedColumns);
    } catch (err) {
      console.error("Error fetching columns:", err);
      setError("Failed to fetch columns. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const addColumn = async (boardId, columnName) => {
    try {
      const newColumn = {
        boardId,
        name: columnName.trim(),
        order: columns.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "columns"), newColumn);
      setColumns((prevColumns) => [
        ...prevColumns,
        { id: docRef.id, ...newColumn },
      ]);
      return docRef.id;
    } catch (err) {
      console.error("Error adding new column:", err);
      throw new Error("Failed to create column. Please try again.");
    }
  };

  const updateColumn = async (columnId, updatedData) => {
    try {
      await updateDoc(doc(db, "columns", columnId), {
        ...updatedData,
        updatedAt: new Date(),
      });
      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.id === columnId ? { ...column, ...updatedData } : column
        )
      );
    } catch (err) {
      console.error("Error updating column:", err);
      throw new Error("Failed to update column. Please try again.");
    }
  };

  const deleteColumn = async (columnId) => {
    try {
      await deleteDoc(doc(db, "columns", columnId));
      setColumns((prevColumns) =>
        prevColumns.filter((column) => column.id !== columnId)
      );
    } catch (err) {
      console.error("Error deleting column:", err);
      throw new Error("Failed to delete column. Please try again.");
    }
  };

  const value = {
    columns,
    loading,
    error,
    fetchColumns,
    addColumn,
    updateColumn,
    deleteColumn,
  };

  return (
    <ColumnsContext.Provider value={value}>{children}</ColumnsContext.Provider>
  );
};

ColumnProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
