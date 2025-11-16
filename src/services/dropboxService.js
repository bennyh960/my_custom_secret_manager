import { Dropbox } from "dropbox/dist/Dropbox-sdk.min.js";
import dropboxAuthService from "./dropboxAuthService";

// ============ Dropbox Service ============
const dropboxService = {
  async getClient() {
    const token = await dropboxAuthService.autoRefreshAccessToken();
    return new Dropbox({ accessToken: token });
  },

  // List files in a folder, return null if folder doesn't exist
  // used for 2nd auth step
  async listFiles(path = "not_exist_folder") {
    try {
      const client = await this.getClient();
      return await client.filesListFolder({ path: `/${path}` });
    } catch (error) {
      if (error.status === 409) {
        return null; // Folder doesn't exist
      }
      throw error;
    }
  },

  async readSecrets(userPath) {
    try {
      const client = await this.getClient();
      console.log("Reading from path:", userPath);
      const response = await client.filesDownload({ path: userPath });
      // response.fileBinary is a Blob in browser, Buffer in Node
      const blob = response.result.fileBlob; // browser
      const text = await blob.text(); // convert blob to text
      console.log("File content:", text);
      return text;
    } catch (error) {
      if (error.status === 409) {
        console.log("secrets.json not found, creating a new one.");
      }
      throw error;
    }
  },

  async writeSecrets(userPath, encryptedData) {
    console.log("Writing to path:", userPath);
    const client = await this.getClient();
    await client.filesUpload({
      path: userPath,
      contents: encryptedData,
      mode: "overwrite",
    });
  },
};

export default dropboxService;
