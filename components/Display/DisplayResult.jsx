import Image from "next/image";
import React, { useEffect, useState } from "react";
import fileDownload from "js-file-download";

function base64ToFile(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  let file = new Blob([bytes], { type: "result/jpg" });
  file.name = "results.jpg";

  return file;
}

export default function DisplayResult({ base64String }) {
  const [imageURI, setImageURI] = useState("");

  useEffect(() => {
    if (base64String) {
      const file = base64ToFile(base64String);
      fileDownload(file, "results.jpg");
      setImageURI(URL.createObjectURL(file));
    }
  }, [base64String]);

  return (
    <div>
      {/* {imageURI && (
        <Image height={300} width={300} src={imageURI} alt={"janina bhai"} />
      )} */}
    </div>
  );
}
