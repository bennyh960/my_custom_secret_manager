import React, { useEffect } from "react";
import dropboxAuthService from "./services/dropboxAuthService";
import dropboxService from "./services/dropboxService";

const Test = () => {
  useEffect(() => {
    dropboxService.listFiles().then((files) => {
      console.log(files);
    });
    // dropboxAuthService.authenticate();
  }, []);
  return (
    <div>
      <h1>TEST</h1>
    </div>
  );
};

export default Test;
