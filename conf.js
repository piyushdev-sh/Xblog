const env = {
  PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
  PROJECT_NAME: import.meta.env.VITE_PROJECT_NAME,
  ENDPOINT_URL: import.meta.env.VITE_ENDPOINT_URL,
  DATABASE_ID: import.meta.env.VITE_DATABASE_ID,
  POSTS_ID: import.meta.env.VITE_TABLE_ID_POSTS,
  USERS_ID: import.meta.env.VITE_TABLE_ID_USERS,
  BUCKET_ID: import.meta.env.VITE_BUCKET_ID
  
};

export default env;