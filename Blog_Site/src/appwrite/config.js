import Conf from "../conf/Conf";

import { Client, ID, TablesDB, Storage, Query } from "appwrite";


export class Service {

    client = new Client();

    databases;
    bucket;

    constructor() {

        // Configure the Appwrite Client with our Endpoint and Project ID
        this.client
            .setEndpoint(Conf.appWriteUrl)
            .setProject(Conf.projectId);

        // Create a TablesDB instance using the configured Client
        this.databases = new TablesDB(this.client);

        // Create a Storage instance using the configured Client
        this.bucket = new Storage(this.client);
    }


    // Create a new blog post
    async createPost({ title, slug, content, featuredImg, status, userId }) {

        try {

            // Create a new row in the articles table
            // ID.unique() generates a unique ID for the row
            return await this.databases.createRow({
                databaseId: Conf.databaseId,
                tableId: Conf.tableId,
                rowId: ID.unique(),

                data: {
                    title,
                    slug,
                    content,
                    featuredImg,
                    status,
                    userId
                }
            });

        } catch (error) {

            console.log(
                "AppWrite error :: while creating post :: ",
                error
            );
        }
    }


    // Update an existing blog post
    async updatePost(id, { title, slug, content, featuredImg, status }) {

        try {

            // Update the row using the post's unique row ID
            return await this.databases.updateRow({
                databaseId: Conf.databaseId,
                tableId: Conf.tableId,
                rowId: id,

                data: {
                    title,
                    slug,
                    content,
                    featuredImg,
                    status
                }
            });

        } catch (error) {

            console.log(
                "AppWrite error :: while updating post :: ",
                error
            );
        }
    }


    // Delete an existing blog post
    async deletePost(id) {

        try {

            // Delete the row using its unique row ID
            await this.databases.deleteRow({
                databaseId: Conf.databaseId,
                tableId: Conf.tableId,
                rowId: id
            });

            // Return true when the post is successfully deleted
            return true;

        } catch (error) {

            console.log(
                "AppWrite error :: while deleting post :: ",
                error
            );

            return false;
        }
    }


    // Get a single blog post using its row ID
    async getPost(id) {

        try {

            // Get one specific row from the articles table
            return await this.databases.getRow({
                databaseId: Conf.databaseId,
                tableId: Conf.tableId,
                rowId: id
            });

        } catch (error) {

            console.log(
                "AppWrite error :: while getting post :: ",
                error
            );

            return false;
        }
    }


    // Get all active posts
    async getPosts() {

        try {

            // Get rows where the status column is equal to "active"
            return await this.databases.listRows({
                databaseId: Conf.databaseId,
                tableId: Conf.tableId,

                queries: [
                    Query.equal("status", "active")
                ]
            });

        } catch (error) {

            console.log(
                "AppWrite error :: while getting posts :: ",
                error
            );

            return false;
        }
    }


    // File upload service
    async uploadFile(file) {

        try {

            // Upload the file to the Appwrite Storage bucket
            // ID.unique() generates a unique ID for the file
            return await this.bucket.createFile({
                bucketId: Conf.bucketId,
                fileId: ID.unique(),
                file: file
            });

        } catch (error) {

            console.log(
                "AppWrite error :: while uploading file :: ",
                error
            );

            return false;
        }
    }


    // Delete an uploaded file
    async deleteFile(fileId) {

        try {

            // Delete the file using its unique file ID
            await this.bucket.deleteFile({
                bucketId: Conf.bucketId,
                fileId: fileId
            });

            return true;

        } catch (error) {

            console.log(
                "AppWrite error :: while deleting file :: ",
                error
            );

            return false;
        }
    }


    // Get a preview URL for an uploaded file
    viewFile(fileId) {

        try {

            // Generate a preview URL for the file
            return this.bucket.getFilePreview({
                bucketId: Conf.bucketId,
                fileId: fileId
            });

        } catch (error) {

            console.log(
                "AppWrite error :: while viewing file :: ",
                error
            );

            return false;
        }
    }
}


// Create an object of the Service class and export it
const service = new Service();

export default service;