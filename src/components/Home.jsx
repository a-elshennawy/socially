import { motion } from "motion/react";
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
import { FaComments, FaQuestion, FaUser } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import FilterPannel from "./FilterPannel";
import { linkify } from "../utils/linkify";
import { Helmet } from "react-helmet";

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
  const [filterType, setFilterType] = useState("newFirst");

  const [localLikeStatus, setLocalLikeStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLikes = localStorage.getItem("likedPosts");
      return savedLikes ? JSON.parse(savedLikes) : {};
    }
    return {};
  });

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", filterType === "oldFirst" ? "asc" : "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      }));
      setAllPosts(updatedPosts);
    });
    return () => unsubscribe();
  }, [filterType]);

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

  const handleFilterChange = (newFilter) => {
    setFilterType(newFilter);
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

  return (
    <Suspense fallback={<SpinnerLoader />}>
      <Helmet>
        <title>Socially - Feed</title>
      </Helmet>
      <section className="container postsFeed">
        <div className="posts row justify-content-start align-items-center gap-2 m-0">
          <PostInput />
          <FilterPannel
            onFilterChange={handleFilterChange}
            currentFilter={filterType}
          />
          {allPosts.map((post) => (
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.5 }}
              whileInView={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.1, ease: "linear" }}
              key={post.id}
              className="post m-0 col-11 row justify-content-start align-items-center gap-2"
            >
              <h6 className="col-12 userName">
                {post.senderName} {getUsernameIcon(post.senderName)}
                {post.timestamp.toLocaleString("en-US", {
                  month: "numeric",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </h6>
              <h5 className="col-12" style={{ whiteSpace: "pre-wrap" }}>
                {linkify(post.text)}
              </h5>
              <span
                className="col-lg-2 col-4 likesCounter"
                onClick={() => toggleLike(post.id, post.likes)}
                style={{ cursor: "pointer" }}
              >
                {localLikeStatus[post.id] ? <FcLike /> : <CiHeart />}
                {post.likes}
              </span>
              <Link
                to={`/PostComments/${post.id}`}
                className="col-lg-2 col-6 comments"
              >
                <FaComments /> {post.comments?.length || 0} Comments
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Suspense>
  );
}
