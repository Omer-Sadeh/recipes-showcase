import firebase from "../firebase";

const storage = firebase.storage().ref("/images");

class RecipesStorageService {
    getStorage() {
        return storage;
    }
    async deleteAll() {
        const filesList = await storage.listAll();
        for (const file of filesList.items) file.delete();
    }
}

export default new RecipesStorageService();