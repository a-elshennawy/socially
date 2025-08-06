import { use, Suspense, useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import PostInput from "./PostInput";
import SpinnerLoader from "./SpinnerLoader";
import { db } from "../firebase";
import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { FaHeart, FaQuestion, FaUser } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { LiaCommentSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

async function getPosts() {
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const posts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() || new Date(),
  }));
  return posts;
}

const postsPromise = getPosts();

export default function Home() {
  const posts = use(postsPromise);
  const [allPosts, setAllPosts] = useState(posts);

  const [localLikeStatus, setLocalLikeStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLikes = localStorage.getItem("likedPosts");
      return savedLikes ? JSON.parse(savedLikes) : {};
    }
    return {};
  });

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      setAllPosts(updatedPosts);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("likedPosts", JSON.stringify(localLikeStatus));
    }
  }, [localLikeStatus]);

  const toggleLike = async (postId, currentLikes) => {
    const isCurrentlyLiked = localLikeStatus[postId];
    const newLikeCount = isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1;

    setLocalLikeStatus((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    setAllPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: newLikeCount } : post
      )
    );

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes: newLikeCount,
      });
    } catch (err) {
      console.error("Error updating like:", err);
      // Revert on error
      setLocalLikeStatus((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      setAllPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: currentLikes } : post
        )
      );
    }
  };

  return (
    <Suspense fallback={<SpinnerLoader />}>
      <section className="container">
        <div className="posts row justify-content-start align-items-center gap-2 m-0">
          <PostInput />
          {allPosts.map((post) => (
            <div
              key={post.id}
              className="post m-0 col-11 row justify-content-start align-items-center gap-2"
            >
              <h6 className="col-12 userName">
                {post.senderName.toLowerCase() === "shennawy" ? (
                  <>
                    {post.senderName} <MdVerified />
                  </>
                ) : post.senderName.toLowerCase() === "anonymous" ? (
                  <>
                    {post.senderName} <FaQuestion />
                  </>
                ) : (
                  <>
                    {post.senderName} <FaUser />
                  </>
                )}
                {post.timestamp.toLocaleString()}
              </h6>
              <h5 className="col-12" style={{ whiteSpace: "pre-wrap" }}>
                {post.text}
              </h5>
              <span
                className="col-lg-2 col-5 likesCounter"
                onClick={() => toggleLike(post.id, post.likes)}
                style={{ cursor: "pointer" }}
              >
                {localLikeStatus[post.id] ? <FaHeart /> : <CiHeart />}
                {post.likes}
              </span>
              <Link
                to={`/PostComments/${post.id}`}
                className="col-lg-2 col-5 comments"
              >
                <LiaCommentSolid /> {post.comments?.length || 0} Comments
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Suspense>
  );
}
