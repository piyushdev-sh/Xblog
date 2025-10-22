import conf from "../../conf";
import { ID, TablesDB, Storage } from "appwrite";
import { Client } from "appwrite";

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.client.setEndpoint(conf.ENDPOINT_URL).setProject(conf.PROJECT_ID);
    this.tablesDB = new TablesDB(this.client);
    this.storage = new Storage(this.client);
  }
  async createPost(content, featuredImage, userId) {
    try {
      return await this.tablesDB.createRow({
        databaseId: conf.DATABASE_ID,
        tableId: conf.POSTS_ID,
        rowId: ID.unique(),
        data: { content, featuredImage, userId },
      });
    } catch (error) {
      console.log("Error while creating post", error);
    }
  }
  async deletePost(postId) {
    try {
      return await this.tablesDB.deleteRow({
        databaseId: conf.DATABASE_ID,
        tableId: conf.POSTS_ID,
        rowId: postId,
      });
    } catch (error) {
      console.log("Error while deleting post", error);
    }
  }
  async updatePost(postId, content, featuredImage) {
    try {
      return await this.tablesDB.updateRow({
        databaseId: conf.DATABASE_ID,
        tableId: conf.POSTS_ID,
        rowId: postId,
        data: { content, featuredImage },
      });
    } catch (error) {
      console.log("Error while updating post", error);
    }
  }
  async getPost(postId) {
    try {
      return await this.tablesDB.getRow({
        databaseId: conf.DATABASE_ID,
        tableId: conf.POSTS_ID,
        rowId: postId,
      });
    } catch (error) {
      console.log("Error while fetching post", error);
    }
  }
  async getPosts() {
    try {
      return await this.tablesDB.listRows({
        databaseId: conf.DATABASE_ID,
        tableId: conf.POSTS_ID,
      });
    } catch (error) {
      console.log("Error while fetching all posts", error);
    }
  }
  // file upload
  async fileUpload(file) {
    try {
      return await this.storage.createFile({
        bucketId: conf.BUCKET_ID,
        fileId: ID.unique(),
        file: file,
      });
    } catch (error) {
      console.log("Error while uploading file", error);
    }
  }
  async updateFile(fileId, file) {
    try {
      return await this.storage.updateFile({
        bucketId: conf.BUCKET_ID,
        fileId: fileId,
        file: file,
      });
    } catch (error) {
      console.log("Error while updating file", error);
    }
  }
  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile({
        bucketId: conf.BUCKET_ID,
        fileId: fileId,
      });
    } catch (error) {
      console.log("Error while deleting file", error);
    }
  }
  async getFile(fileId) {
    try {
        return this.storage.getFileView({
            bucketId: conf.BUCKET_ID,
            fileId: fileId,
        });
    } catch (error) {
       console.log("Error while getting file",error); 
    }
  }
  // user db
  async createUser(username, email,name) {
    try {
      return await this.tablesDB.createRow({
        databaseId: conf.DATABASE_ID,
        tableId: conf.USERS_ID,
        rowId: username,
        data: { name,email,username },
      });
    } catch (error) {
      console.log("Error while creating user", error);
    } 
  }
 async getUser(username) {
    try {
      return await this.tablesDB.getRow({
        databaseId: conf.DATABASE_ID,
        tableId: conf.USERS_ID,
        rowId: username,
      });
    } catch (error) {
      console.log("Error while fetching user", error);
      return true
    }
 }
}
const appwriteDBservice = new AppwriteService();
export const client = appwriteDBservice.client;
export default appwriteDBservice;
