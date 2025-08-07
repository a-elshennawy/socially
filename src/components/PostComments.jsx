import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { db } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FaQuestion, FaUser } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import SpinnerLoader from "./SpinnerLoader";
import CommentsInput from "./CommentsInput";
import { FcLike } from "react-icons/fc";

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
              {localLikeStatus[post.id] ? <FcLike /> : <CiHeart />}
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
                    <span
                      className="col-12 likesCounter"
                      onClick={() => toggleCommLikes(comment.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {localLikeStatus[comment.id] ? <FcLike /> : <CiHeart />}
                      {comment.likes}
                    </span>
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
