import { Client,Account,Databases,Storage } from "appwrite";
import env from "../../conf";
import { ID } from "appwrite";
class AppwriteService {
  constructor() {
    this.client = new Client();
    this.client.setEndpoint(env.ENDPOINT_URL).setProject(env.PROJECT_ID);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }
  async signup(email, password,username) {
    try {
        return await this.account.create({userId:username,email, password});
    } catch (error) {
     console.log("Error while creating account",error);
    }
  }
  async login(email, password) {
    try {
       return await this.account.createEmailPasswordSession({email, password}); 
    } catch (error) {
      console.log("Error while logging in",error);  
    }
   }
  async logout() {
    try {
       return await this.account.deleteSessions(); 
    } catch (error) {
      console.log("Error while logging out",error);  
    }
    } 
   async getCurrentUser() {
      try {
         return await this.account.get(); 
      } catch (error) {
        console.log("Error while getting current user",error);  
      }
      }
}
const appwriteAuthService = new AppwriteService();
export default appwriteAuthService;
