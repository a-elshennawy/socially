import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { db } from "../firebase";
import {
  orderBy,
  query,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { FaHeart, FaQuestion, FaUser } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import SpinnerLoader from "./SpinnerLoader";
import CommentsInput from "./CommentsInput";

export default function PostComments() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setloading] = useState(true);

  const [localLikeStatus, setLocalLikeStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLikes = localStorage.getItem("likedPosts");
      return savedLikes ? JSON.parse(savedLikes) : {};
    }
    return {};
  });

  useEffect(() => {
    setloading(true); // Set loading to true when a new fetch starts
    const postRef = doc(db, "posts", postId);

    // Use a single onSnapshot listener for both initial data and real-time updates
    const unsubscribe = onSnapshot(
      postRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const postData = {
            id: docSnap.id,
            ...docSnap.data(),
            timestamp: docSnap.data().timestamp?.toDate() || new Date(),
          };
          setPost(postData);
        } else {
          console.log("post is not found");
          setPost(null); // Clear the post if it no longer exists
        }
        setloading(false);
      },
      (error) => {
        console.error("Error listening to post:", error);
        setloading(false);
      }
    );

    // Cleanup function to detach the listener when the component unmounts
    return () => unsubscribe();
  }, [postId]);

  const toggleLike = async () => {
    if (!post || typeof post.likes !== "number") {
      console.error("Invalid post or like count");
      return;
    }

    try {
      const postRef = doc(db, "posts", post.id);
      const isCurrentlyLiked = localLikeStatus[post.id];
      const newLikeCount = isCurrentlyLiked ? post.likes - 1 : post.likes + 1;

      setLocalLikeStatus((prev) => ({
        ...prev,
        [post.id]: !prev[post.id],
      }));
      setPost((prev) => ({ ...prev, likes: newLikeCount }));

      await updateDoc(postRef, {
        likes: newLikeCount,
      });
    } catch (err) {
      console.error("Error updating like:", err);

      setLocalLikeStatus((prev) => ({
        ...prev,
        [post.id]: prev[post.id],
      }));
      setPost((prev) => ({
        ...prev,
        likes: prev.likes,
      }));
    }
  };

  if (loading) {
    return <SpinnerLoader />;
  }

  if (!post) {
    return (
      <div className="text-center">
        <h1>post is not found</h1>
      </div>
    );
  }

  return (
    <>
      <section className="container-fluid">
        <div
          key={post.id}
          className="postDetails m-0 row justify-content-start align-items-center gap-1"
        >
          <div className="backBtnArea col-12">
            <button className="backBtn">
              <Link to={"/"}>back</Link>
            </button>
          </div>
          <div className="upperPostBody">
            <h5 className="col-12 userName m-0">
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
            </h5>
            <p>{post.timestamp.toLocaleString()}</p>
            <h3 className="col-12 postBody" style={{ whiteSpace: "pre-wrap" }}>
              {post.text}
            </h3>
            <span
              className="col-12 likesCounter"
              onClick={toggleLike}
              style={{ cursor: "pointer" }}
            >
              {localLikeStatus[post.id] ? <FaHeart /> : <CiHeart />}
              {post.likes}
            </span>
          </div>
          <CommentsInput postId={postId} />
          <div className="col-12 commentsSection">
            <h4>Comments ({post.comments?.length || 0})</h4>
            {post.comments?.length > 0 ? (
              post.comments
                .slice()
                .reverse()
                .map((comment, index) => (
                  <div key={index} className="comment">
                    <small>
                      {comment.timestamp?.toDate
                        ? comment.timestamp.toDate().toLocaleString()
                        : new Date(comment.timestamp).toLocaleString() ||
                          "Unknown date"}
                    </small>
                    <h5>{comment.text}</h5>
                  </div>
                ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
