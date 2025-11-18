import { SecretsContextType } from "./contexts/secretContext/types";
import dropboxService from "./services/dropboxService";
import encryptionService from "./services/encryptionService";

const playGround = async () => {
  // console.log("This is the playground module.");
  // const userPath = "/benny_6711904bh/secrets.json";
  // const decryptedSecrets: SecretsContextType["userSecretData"] = await getUserData(userPath);
  // console.log("Decrypted secrets tags:", decryptedSecrets.tags);
  // const userTags = [
  //   { name: "Private", color: "green" },
  //   { name: "Work", color: "red" },
  // ];
  // decryptedSecrets.tags = userTags;
  // const updatedSecretesWithTags = decryptedSecrets.map((s) => {
  //   return { ...s, tags: [] };
  // });
  // console.log("Updated secrets with tags:", updatedSecretesWithTags);
  // const userSecrets = {
  //   secrets: decryptedSecrets,
  //   tags: ["Work", "Private", "Account", "Programs", "Social"],
  //   settings: {
  //     theme: "dark",
  //   },
  // };
  // await saveUserData(decryptedSecrets, userPath);
};

const getUserData = async (userPath: string) => {
  const encryptedData = await dropboxService.readSecrets(userPath);
  console.log("Encrypted data loaded:", encryptedData);

  const decrypted = await encryptionService.decrypt(encryptedData, userPath);
  return decrypted;
};

const saveUserData = async (secrets: SecretsContextType["userSecretData"], userPath: string) => {
  const encrypted = await encryptionService.encrypt(secrets, userPath);
  await dropboxService.writeSecrets(userPath, encrypted);
};

// export default playGround;
