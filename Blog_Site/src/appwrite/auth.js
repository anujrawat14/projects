import Conf from "../conf/Conf";
import { Client, Account, ID } from "appwrite";

// Class
export class AuthService {

    Client = new Client();

    account;

    // This constructor is automatically called when we create an object of this class
    constructor() {

        this.Client
            .setEndpoint(Conf.appWriteUrl)
            .setProject(Conf.projectId);

        // Pass the Client object to Account so that it can communicate with our Appwrite project
        this.account = new Account(this.Client);
    }

    // Create an async function to create a new user account
    async createAccount({ email, password, name }) {

        try {

            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )

            if (userAccount) {

                // If the account is created successfully,
                // call the login method to automatically log the user in
                return this.login(email, password);

            }
            else {

                // If account creation was not successful,
                // return the response received from Appwrite
                return userAccount;
            }

        }
        catch (error) {

            // Handle and display the error if account creation fails
            console.log("AppWrite error :: while creating an account :: ", error);
        }
    }


    // Create an async function to log in an existing user
    async login({ email, password }) {
        try {
            return await this.account.createEmailSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Create an async function to check the current user's login status
    async getStatus() {

        try {

            // Get the currently logged-in user's account information
            return await this.account.get();

        } catch (error) {

            // Handle and display the error if we cannot get the user's status
            console.log("AppWrite error :: while getting status of user :: ", error);
        }

        // Return null if there is no logged-in user or an error occurs
        return null;
    }

    // Create an async function to log out the current user
    async logOut() {

        try {

            // Delete all active sessions of the current user
            return await this.account.deleteSessions();

        } catch (error) {

            // Handle and display the error if logout fails
            console.log("AppWrite error :: while logout :: ", error);
        }
    }
}

// Create an object of the AuthService class and export it
const authService = new AuthService();

export default authService;


/*
ismain humne kya kiya hai?

Step 1:
Humne Appwrite se Client, Account aur ID import kiya,
jo authentication ke liye required hain.

Saath mein Conf ko bhi import kiya kyunki uske andar
hamara Appwrite Endpoint aur Project ID stored hai.


Step 2:
Hum Appwrite documentation se authentication ka code
directly components ke andar bhi use kar sakte the.

Lekin future mein agar hume authentication ke code mein
kuch change karna pade, toh baar-baar alag-alag files mein
changes karne padte.

Isliye humne ek AuthService class banayi hai aur
authentication se related saara code ek hi jagah rakha hai.

Isse code reusable aur maintainable ho jata hai.


Step 3:
Humne AuthService naam ki ek class banayi,
jiske andar Client aur Account hain.

Jab hum AuthService ka object create karte hain,
toh constructor automatically call hota hai.

Constructor ke andar:
- setEndpoint() se Appwrite ka Endpoint set kiya.
- setProject() se Appwrite ka Project ID set kiya.
- Account ka object banaya aur uske andar configured Client pass kiya.

Ab this.account ke through hum Appwrite ki
authentication methods ko use kar sakte hain.


Step 4:
Humne createAccount() method banaya hai.

Iska kaam Appwrite mein ek naya user account create karna hai.

Humne ID.unique() use karke user ke liye ek unique ID generate ki,
aur email, password aur name ko account.create() method mein pass kiya.

Agar account successfully create ho jata hai,
toh hum login() method ko call karke user ko automatically login kar dete hain.


Step 5:
Humne login() method banaya hai.

Isme createEmailPasswordSession() method use kiya hai,
jo email aur password ke through user ka login session create karta hai.

Agar session successfully create ho jata hai,
toh user logged in ho jata hai.


Step 6:
Humne getStatus() method banaya hai.

Iska purpose check karna hai ki currently koi user logged in hai
ya nahi.

this.account.get() current logged-in user ki information return karta hai.

Agar user logged in nahi hai ya error aata hai,
toh hum null return karte hain.


Step 7:
Humne logOut() method banaya hai.

Isme deleteSessions() method use kiya hai,
jo current user ke saare active sessions delete kar deta hai.

Iske baad user logout ho jata hai.


Step 8:
Finally, humne AuthService class ka object create kiya
aur usko export kar diya.

Ab hum is object ko kisi bhi file mein import karke
authentication-related methods ko use kar sakte hain.

For example:

authService.createAccount(...)
authService.login(...)
authService.getStatus(...)
authService.logOut(...)

Is tarah authentication ka saara logic
ek hi jagah manage ho raha hai.
*/
/*

ismain humna kra kya hai 

step 1:- import krdiya hai client account id ko jo chiya hai authentication k liya
sath main conf ko bhi import kr diya kyunki uska andr project id hai 


step 2 :- hum jaisa docs main diya hai appwrite ka waisa bhi copy paste kr skta tha but future main humko or jada mehnat krni pdti toh humnei ek class and object ki madad sa usko export kr  hai

step 3:- humne ek class bnyi jiska and client and account hai  , jaisa hi koi class ko call krega ya object bnyega toh constructor call hoga , constructor ka andar humni .setendpoint and set project ka use kra hai or account ka andr client pass kra hai

step 4 class ka object bnaka usko export kr hai

*/
