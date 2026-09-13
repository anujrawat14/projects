import Conf from "../conf/Conf"
import { Client, Account, ID } from "appwrite";

export class AuthService {

    client = new Client();
    account;

    // Constructor runs automatically when AuthService object is created 
    constructor() {
        this.client
            .setProject(Conf.appwriteProjectId)
            .setEndpoint(Conf.appwriteEndpoint);

        this.account = new Account(this.client);
    }

    //create a new user account with email, password and name

    async createAccount(email, password, name) {
        try {
            const user = await this.account.create({ userId: ID.unique(), email: email, password: password, name: name });
            // If account is successfully created,
            // automatically login the user 
            if (user) {
                return this.login(email, password);
            }
            return null;
        }
        catch (error) {
            console.log("error while creating account :: ", error.message);
            // Send error back to the component
            throw error;
        }
    }


    // Login user with email and password 

    async login(email, password) {

        try {
            const session = await this.account.createEmailPasswordSession({
                email: email,
                password: password
            })
            return session;
        }
        catch (error) {
            console.log("error while login :: ", error.message);
            throw error;
        }
    }

    // Get currently logged-in user

    async getCurrentUser() {

        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.log("error while getting current user :: ", error.message);
            // No logged-in user can be a normal situation, so return null
            return null;
        }
    }

    // Logout user from all active sessions
    async logout() {
        try {
            return await this.account.deleteSessions();
        } catch (error) {
            console.log("error while logout :: ", error.message);
            throw error;
        }
    }

}

//creating object of AuthService class
const authService = new AuthService();

export default authService;