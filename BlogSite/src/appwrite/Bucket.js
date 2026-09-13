import { Client, Storage, ID } from "appwrite";
import Conf from "../conf/Conf";

export class Bucket {
    client = new Client();
    storage;

    constructor() {
        this.client
            .setEndpoint(Conf.appwriteEndpoint)
            .setProject(Conf.appwriteProjectId);

        this.storage = new Storage(this.client);

    }

    //create file(upload file) : give actual file

    async uploadFile(file) {
        try {
            return await this.storage.createFile({
                bucketId: Conf.appwriteBucketId,
                fileId: ID.unique(),
                file: file
            })
        } catch (error) {

            console.log(
                "Appwrite error :: while uploading file :: ",
                error.message
            );

            return false;
        }
    }

    //delete file
    async deleteFile(fileid) {
        try {
            return await this.storage.deleteFile({
                bucketId: Conf.appwriteBucketId,
                fileId: fileid
            })
        } catch (error) {
            console.log(
                "Appwrite error :: while deleting file :: ",
                error.message
            );
            return false;
        }
    }

    //get file preview
    getFilePreview(fileid) {
        try {
            return this.storage.getFilePreview({
                bucketId: Conf.appwriteBucketId,
                fileId: fileid
            })
        } catch (error) {
            console.log("Appwrite error :: while getting file preview :: ", error.message);
            return false;
        }
    }



}

const bucket = new Bucket();
export default bucket;