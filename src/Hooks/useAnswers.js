import  { useEffect, useState } from "react";
import { getDatabase, ref, query, orderByKey, get } from "firebase/database";

const useAnswers = (videoID) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    async function fetchAnswers() {
      // database related works
      const db = getDatabase();

      const answerRef = ref(db, "answers/" + videoID + "/questions");
      const answerQuery = query(answerRef, orderByKey());

      try {
        setError(false);
        setLoading(true);

        // request firebase database for videos
        const snapshot = await get(answerQuery);
        setLoading(false);
        if (snapshot.exists()) {
          setAnswers((prevAnswers) => {
            return [...prevAnswers, ...Object.values(snapshot.val())];
          });
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }
    fetchAnswers();
  }, [videoID]);
  return {
    loading,
    error,
    answers,
  };
};

export default useAnswers;
