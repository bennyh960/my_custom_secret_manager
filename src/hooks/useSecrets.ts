import { useContext } from "react";
import { SecretsContext } from "../contexts/secretContext/SecretsContext";

const useSecrets = () => useContext(SecretsContext);

export default useSecrets;
