import { useEffect, useState } from "react";
import { getDatabase, ref, query, orderByKey, get } from "firebase/database";

const useQuestions = (videoID) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      // database related works
      const db = getDatabase();

      const quizRef = ref(db, "quiz/" + videoID + "/questions");
      const quizQuery = query(quizRef, orderByKey());

      try {
        setError(false);
        setLoading(true);

        // request firebase database for videos
        const snapshot = await get(quizQuery);
        setLoading(false);
        if (snapshot.exists()) {
          setQuestions((prevQuestions) => {
            return [...prevQuestions, ...Object.values(snapshot.val())];
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }
    fetchQuestions();
  }, [videoID]);
  return {
    loading,
    error,
    questions,
  };
};

export default useQuestions;
