import React, { useState, useEffect } from "react";
import dbService , {client} from "../appwrite/database";
import authService from "../appwrite/auth";
import PostCard from "../components/PostCard";
import env from "../../conf";
import Post from "../components/Post";

function Feed() {
  const [Posts, setPosts] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await dbService.getPosts();
        console.log("Fetched posts:", fetchedPosts);
        setPosts(fetchedPosts.rows);
      } catch (error) {
        console.log("Error while fetching posts", error);
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

  return(
    <div>
    <Post/>
    <div>
        {Posts && Posts.length > 0 ? (
            Posts.map((post)=>(
                <div key={post.$id}>
                    <PostCard content={post.content} featuredImage={post.featuredImage} userId={post.userId} time ={post.$updatedAt} />
                </div>
            ))
        ) : null}
    </div></div>
  )
}

export default Feed;
