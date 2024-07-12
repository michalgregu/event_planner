import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const usersCollectionRef = collection(db, "users");

export const createUser = async (name, marks) => {
  await addDoc(usersCollectionRef, { name, marks: Number(marks) });
};

// export const updateUser = async (id, marks) => {
//   const userDoc = doc(db, "users", id);
//   const newFields = { marks: marks + 1 };
//   await updateDoc(userDoc, newFields);
// };

// export const deleteUser = async (id) => {
//   const userDoc = doc(db, "users", id);
//   await deleteDoc(userDoc);
// };

// export const getUsers = async () => {
//   const data = await getDocs(usersCollectionRef);
//   return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
// };