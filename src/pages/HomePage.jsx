import React, { useEffect } from "react";

const HomePage = () => {
  //   async function loadJSON() {
  //     const res = await fetch("https://content.dropboxapi.com/2/files/download", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${DROPBOX_TOKEN}`,
  //         "Dropbox-API-Arg": JSON.stringify({ path: "/passwords.json" }),
  //       },
  //     });

  //     return res.json();
  //   }

  useEffect(() => {
    // dbx
    //   .filesListFolder({ path: "" })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
    // dbx
    //   .filesCreateFolderV2({ path: "/benny" })
    //   .then((r) => console.log(r))
    //   .catch((e) => console.error(e));
  }, []);

  return <div>HomePage</div>;
};

export default HomePage;
