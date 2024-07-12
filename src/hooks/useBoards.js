import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useBoards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const boardsQuery = query(
          collection(db, 'boards'),
          where('ownerId', '==', user.uid)
        );
        const boardMembersQuery = query(
          collection(db, 'board_members'),
          where('userId', '==', user.uid)
        );

        let [ownedBoardsSnapshot, memberBoardsSnapshot] = await Promise.all([
          getDocs(boardsQuery),
          getDocs(boardMembersQuery)
        ]);

        const ownedBoards = ownedBoardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          role: 'owner'
        }));

        const memberBoardIds = memberBoardsSnapshot.docs.map(doc => doc.data().boardId);
        const memberBoardsQuery = query(
          collection(db, 'boards'),
          where('id', 'in', memberBoardIds)
        );
         memberBoardsSnapshot = await getDocs(memberBoardsQuery);

        const memberBoards = memberBoardsSnapshot.docs.map(doc => {
          const boardMember = memberBoardsSnapshot.docs.find(
            memberDoc => memberDoc.data().boardId === doc.id
          );
          return {
            id: doc.id,
            ...doc.data(),
            role: boardMember.data().role
          };
        });

        setBoards([...ownedBoards, ...memberBoards]);
      } catch (err) {
        console.error('Error fetching boards:', err);
        setError('Failed to fetch boards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user]);

  return { boards, loading, error };
};