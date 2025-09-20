import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostInput() {
  const [newPost, setNewPost] = useState("");
  const [name, setName] = useState("");

  const addPost = async (e) => {
    e.preventDefault();

    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, "posts"), {
        text: newPost,
        senderName: name || "anonymous",
        timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
      });
      setNewPost("");
    } catch (err) {
      console.error("error adding post", err);
    }
  };

  return (
    <>
      <form
        id="addPost"
        onSubmit={addPost}
        className="postInput col-11 col-lg-6 row justify-content-start align-items-center gap-1 m-0"
      >
        <textarea
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              addPost(e);
            }
          }}
          onChange={(e) => setNewPost(e.target.value)}
          style={{
            resize: "none",
            minHeight: "40px",
            maxHeight: "120px",
            overflowY: "auto",
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          name="postBody"
          placeholder="add post ..."
          className="col-12 col-lg-5"
          rows={1}
          value={newPost}
        ></textarea>

        <input
          type="text"
          placeholder="Username (optional)"
          className="col-7 col-lg-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="btnArea col-lg-2 col-4 p-0">
          <button disabled={!newPost.trim()} type="submit" className="postBtn">
            Post
          </button>
        </div>
      </form>
    </>
  );
}
