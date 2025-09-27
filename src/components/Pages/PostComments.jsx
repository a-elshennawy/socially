import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { db } from "../../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FaQuestion, FaUser, FaShare, FaHome } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import SpinnerLoader from "../ReusableComponents/SpinnerLoader";
import CommentsInput from "../ReusableComponents/CommentsInput";
import { FcLike } from "react-icons/fc";
import { linkify } from "../../utils/linkify";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { ThemeToggle } from "../Contexts/ThemeProvider";
export default function PostComments() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setloading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [localLikeStatus, setLocalLikeStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLikes = localStorage.getItem("likedPosts");
      return savedLikes ? JSON.parse(savedLikes) : {};
    }
    return {};
  });

  useEffect(() => {
    setloading(true);
    const postRef = doc(db, "posts", postId);

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
          setPost(null);
        }
        setloading(false);
      },
      (error) => {
        console.error("Error listening to post:", error);
        setloading(false);
      }
    );

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

  const toggleCommLikes = async (commentId) => {
    if (!post || !post.comments || !commentId) {
      console.error("Invalid post, comments, or comment ID");
      return;
    }

    const commentToUpdate = post.comments.find(
      (comment) => comment.id === commentId
    );
    if (!commentToUpdate) {
      console.error("Comment not found in state");
      return;
    }

    try {
      const isCurrentlyLiked = localLikeStatus[commentId];
      const newLikeCount = isCurrentlyLiked
        ? commentToUpdate.likes - 1
        : commentToUpdate.likes + 1;

      const updatedComments = post.comments.map((comment) =>
        comment.id === commentId ? { ...comment, likes: newLikeCount } : comment
      );

      setLocalLikeStatus((prev) => ({
        ...prev,
        [commentId]: !isCurrentlyLiked,
      }));
      setPost((prev) => ({ ...prev, comments: updatedComments }));
      localStorage.setItem(
        "likedPosts",
        JSON.stringify({ ...localLikeStatus, [commentId]: !isCurrentlyLiked })
      );

      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        comments: updatedComments,
      });
    } catch (err) {
      console.error("Error updating comment like:", err);
      const isCurrentlyLiked = localLikeStatus[commentId];
      const revertedComments = post.comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: commentToUpdate.likes }
          : comment
      );
      setLocalLikeStatus((prev) => ({
        ...prev,
        [commentId]: isCurrentlyLiked,
      }));
      setPost((prev) => ({ ...prev, comments: revertedComments }));
    }
  };

  const getUsernameIcon = (name) => {
    const lowerTrimmedName = name.trim().toLowerCase();
    if (
      lowerTrimmedName.includes("shennawy") ||
      lowerTrimmedName.includes("ghall")
    ) {
      return <MdVerified />;
    }
    if (lowerTrimmedName.includes("anonymous")) {
      return <FaQuestion />;
    }
    return <FaUser />;
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

  const copyPostUrl = (postId) => {
    const postUrl = `https://socially.pages.dev/PostComments/${postId}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      })
      .catch((err) => {
        console.error("failed to copy link :", err);
      });
  };

  return (
    <>
      <div className="miniNav row justify-content-between align-items-center m-0">
        <button className="backBtn col-5 text-start p-0">
          <Link to={"/"}>
            <FaHome />
          </Link>
        </button>
        <div className="col-5 text-end p-0">
          <ThemeToggle />
        </div>
      </div>
      <section className="container-fluid postComm">
        <div
          key={post.id}
          className="postDetails m-0 row justify-content-start align-items-center"
        >
          <div className="upperPostBody m-0 p-0 row">
            <h5 className="col-12 userName mx-0 px-0">
              {post.senderName}&nbsp;
              {getUsernameIcon(post.senderName)}
            </h5>
            <p className="px-0">
              {post.timestamp.toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <h5
              className="col-12 postBody m-0 px-0"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {linkify(post.text)}
            </h5>
            <div className="col-12 px-0">
              <span
                className="likesCounter text-start py-2"
                onClick={toggleLike}
              >
                {localLikeStatus[post.id] ? <FcLike /> : <CiHeart />}
                {post.likes}
              </span>
            </div>
          </div>
          <hr className="m-0" />
          <CommentsInput postId={postId} />
          <div className="col-12 p-0 commentsSection">
            <h5>
              Comments ({post.comments?.length || 0})
              <span
                className="text-end py-2 px-3"
                onClick={() => copyPostUrl(post.id)}
                style={{ cursor: "pointer" }}
              >
                <FaShare />
              </span>
            </h5>
            {post.comments?.length > 0 ? (
              post.comments
                .slice()
                .reverse()
                .map((comment, index) => (
                  <div key={index} className="comment">
                    <small>
                      {comment.timestamp?.toDate
                        ? comment.timestamp.toDate().toLocaleString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : new Date(comment.timestamp).toLocaleString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }) || "Unknown date"}
                    </small>
                    <h5>{comment.text}</h5>
                    <span
                      className="col-12 likesCounter"
                      onClick={() => toggleCommLikes(comment.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {localLikeStatus[comment.id] ? <FcLike /> : <CiHeart />}
                      {comment.likes}
                    </span>
                    <hr className="my-2" />
                  </div>
                ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </section>

      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1001,
          }}
          className="shareNotification"
        >
          Post link copied <IoCheckmarkCircleSharp />
        </motion.div>
      )}
    </>
  );
}
