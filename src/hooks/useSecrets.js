import { useContext } from "react";
import { SecretsContext } from "../contexts/SecretsContext";

const useSecrets = () => useContext(SecretsContext);

export default useSecrets;
