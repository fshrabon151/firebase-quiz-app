import  { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  orderByKey,
  get,
  startAt,
  limitToFirst,
} from "firebase/database";

const useVideoList = (page) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      // database related works
      const db = getDatabase();

      const videosRef = ref(db, "videos");
      const videoQuery = query(
        videosRef,
        orderByKey(),
        startAt("" + page),
        limitToFirst(15)
      );

      try {
        setError(false);
        setLoading(true);

        // request firebase database for videos
        const snapshot = await get(videoQuery);
        setLoading(false);
        if (snapshot.exists()) {
          setVideos((prevVideos) => {
            return [...prevVideos, ...Object.values(snapshot.val())];
          });
        } else {
          //
          setHasMore(false);
        }
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError(true);
      }
    }
    fetchVideos();
  }, [page]);
  return {
    loading,
    error,
    videos,
    hasMore,
  };
};

export default useVideoList;
