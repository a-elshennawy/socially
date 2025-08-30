import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PostInput() {
  const [newPost, setNewPost] = useState("");
  const [postType, setPostType] = useState("anonymous");
  const [name, setName] = useState("");
  const [imageAsBase64, setImageAsBase64] = useState(null);
  const [imageName, setImageName] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        setImageAsBase64(readerEvent.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();

    if (!newPost.trim() && !imageAsBase64) return;

    try {
      await addDoc(collection(db, "posts"), {
        text: newPost,
        senderName: name || "anonymous",
        timestamp: serverTimestamp(),
        likes: 0,
        comments: [],
        image: imageAsBase64,
      });
      setNewPost("");
      setImageAsBase64(null);
      setImageName(null);
    } catch (err) {
      console.error("error adding post", err);
    }
  };

  return (
    <>
      <form
        id="addPost"
        onSubmit={addPost}
        className="postInput col-10 row justify-content-start align-items-center gap-1 m-0"
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
          placeholder="add post..."
          className="col-12 col-lg-5"
          rows={1}
          value={newPost}
        ></textarea>

        {postType === "use_name" && (
          <input
            type="text"
            placeholder="Your name"
            className="col-5 col-lg-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <select
          className="col-6 col-lg-2"
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          required
        >
          <option disabled>post as ?</option>
          <option value="anonymous">anonymous</option>
          <option value="use_name">use your name</option>
        </select>
        <div className="imgUp col-lg-2 col-4 m-0 p-0 text-center">
          <label htmlFor="file-upload" className="custom-file-upload">
            {imageName ? `${imageName}` : "Select image"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="btnArea col-lg-2 col-4 p-0">
          <button
            disabled={!newPost.trim() && !imageAsBase64}
            type="submit"
            className="postBtn"
          >
            add post
          </button>
        </div>
      </form>
    </>
  );
}
