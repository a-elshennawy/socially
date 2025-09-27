import { useState } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { FaHourglassEnd } from "react-icons/fa";
import { nanoid } from "nanoid";

export default function CommentsInput({ postId }) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addComment = async (e) => {
    e.preventDefault();
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        comments: arrayUnion({
          id: nanoid(),
          likes: 0,
          text: commentText.trim(),
          timestamp: new Date(),
        }),
      });
      setCommentText("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={addComment}
        className="commentForm row justify-content-start align-items-center gap-0 m-0 py-2 px-0"
      >
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addComment(e);
            }
          }}
          style={{
            resize: "none",
            minHeight: "30px",
            maxHeight: "120px",
            overflowY: "auto",
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          rows={1}
          className="col-6 col-lg-2"
          placeholder="Add a comment..."
          disabled={isSubmitting}
        />
        <div className="btnArea col-6 p-0 text-start">
          <button type="submit" disabled={!commentText.trim() || isSubmitting}>
            {isSubmitting ? <>adding...</> : <>add comment</>}
          </button>
        </div>
      </form>
    </>
  );
}
