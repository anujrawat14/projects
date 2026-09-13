import Conf from '../conf/Conf';
import { Client, TablesDB, Query } from 'appwrite';

export class Database {

    client = new Client();
    tablesDb;

    constructor() {
        this.client
            .setEndpoint(Conf.appwriteEndpoint)
            .setProject(Conf.appwriteProjectId);
        this.tablesDb = new TablesDB(this.client);
    }

    //create post (row)
    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return this.tablesDb.createRow({
                databaseId: Conf.appwriteDatabaseId,
                tableId: Conf.appwriteTableId,
                rowId: slug,
                data: {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            })
        } catch (error) {
            console.log("error while creating post :: ", error.message);
            throw error;
        }
    }

    //update post
    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.tablesDb.updateRow({
                databaseId: Conf.appwriteDatabaseId,
                tableId: Conf.appwriteTableId,
                rowId: slug,
                data: {
                    title: title,
                    content: content,
                    featuredImage: featuredImage,
                    status: status
                }
            })
        } catch (error) {
            console.log("Appwrite error :: while updating post :: ", error.message);
            throw error;

        }
    }

    //delete post
    async deletePost(slug) {
        try {
            await this.tablesDb.deleteRow({
                databaseId: Conf.appwriteDatabaseId,
                tableId: Conf.appwriteTableId,
                rowId: slug
            })
            return true;//post deleted successfully
        } catch (error) {
            console.log("Appwrite error :: while deleting post :: ", error.message);
            return false;
        }
    }

    //show posts
    async showPost(slug) {
        try {
            return await this.tablesDb.listRows({
                databaseId: Conf.appwriteDatabaseId,
                tableId: Conf.appwriteTableId,
                queries: [Query.equal("slug", slug)]
            })
        } catch (error) {
            console.log("Appwrite error :: while showing post :: ", error.message);
            return false;
        }
    }


    //show all post when status is true
    async showAllPosts() {
        try {
            return await this.tablesDb.listRows({
                databaseId: Conf.appwriteDatabaseId,
                tableId: Conf.appwriteTableId,
                queries: [
                    Query.equal('status', true),
                    Query.orderAsc("title")
                ]

            })
        } catch (error) {
            console.log("Appwrite error :: while showing all posts :: ", error.message);
            return false;
        }
    }

}

const database = new Database();

export default database;