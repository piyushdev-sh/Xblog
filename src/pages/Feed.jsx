import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import dbService , {client} from "../appwrite/database";
import authService from "../appwrite/auth";
import PostCard from "../components/PostCard";
import env from "../../conf";
import Post from "../components/Post";

function Feed() {
  const [Posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const fetchedPosts = await dbService.getPosts();
        console.log("Fetched posts:", fetchedPosts);
        setPosts(fetchedPosts.rows);
      } catch (error) {
        console.log("Error while fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    let unsubscribe;
    try {
      unsubscribe = client.subscribe(
        `databases.${env.DATABASE_ID}.collections.${env.TABLE_ID}.documents`,
        () => {
            fetchPosts();
        }
      );
    } catch (error) {
      console.log("Error in realtime subscription", error);
    }

    return () => unsubscribe && unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <FaSpinner className="animate-spin text-4xl mr-3" />
        <span className="text-xl font-semibold">Loading feed...</span>
      </div>
    );
  }

  return(
    <div>
    <Post/>
    <div>
        {Posts && Posts.length > 0 ? (
            Posts.map((post)=>(
                <div key={post.$id}>
                    <PostCard content={post.content} postId={post.$id} featuredImage={post.featuredImage} userId={post.userId} time ={post.$updatedAt} />
                </div>
            ))
        ) : null}
    </div></div>
  )
}

export default Feed;
