import dropboxService from "./services/dropboxService";
import encryptionService from "./services/encryptionService";

const playGround = async () => {
  console.log("This is the playground module.");
  const userPath = "/benny_6711904bh/secrets.json";
  const decryptedSecrets = await getSecrets(userPath);
  console.log("Decrypted secrets tags:", decryptedSecrets);
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
  // await saveSecrets(userSecrets, userPath);
};

const getSecrets = async (userPath: string) => {
  const encryptedData = await dropboxService.readSecrets(userPath);
  console.log("Encrypted data loaded:", encryptedData);

  const decrypted = await encryptionService.decrypt(encryptedData, userPath);
  return decrypted;
};

// const saveSecrets = async (secrets, userPath) => {
//   const encrypted = await encryptionService.encrypt(secrets, userPath);
//   await dropboxService.writeSecrets(userPath, encrypted);
// };

// export default playGround;
