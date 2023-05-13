import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { PulseLoader } from "react-spinners";
import JSZip from "jszip";
import { throttle } from "lodash";

export default function SingleFileUpload({
  images,
  setImages,
  progress,
  setProgress,
  multiple = false,
  upload,
  loading,
  setLoading,
  webkitdirectory = false,
}) {
  const onZipUpdate = (metadata) => {
    setProgress(metadata.percent);
    console.log("progression: " + metadata.percent.toFixed(2) + " %");
    if (metadata.currentFile) {
      console.log("current file = " + metadata.currentFile);
    }
  };
  const throttledZipUpdate = throttle(onZipUpdate, 50);
  return (
    <Stack direction="column" alignItems="center" spacing={1} width={"500px"}>
      <Button variant="contained" component="label" fullWidth>
        Choose Folder
        <input
          onChange={(e) => {
            setProgress(0);

            const files = Array.from(e.target.files);
            const zip = new JSZip();
            files.forEach((file) => {
              zip.file(file.webkitRelativePath, file);
            });
            zip
              .generateAsync({ type: "blob" }, throttledZipUpdate)
              .then((content) => {
                setImages(content);
              });
          }}
          value={""}
          hidden
          // accept="image/*"
          type="file"
          webkitdirectory="true"
        />
      </Button>
      {loading ? (
        <PulseLoader />
      ) : (
        <Button
          fullWidth
          variant="outlined"
          onClick={async () => {
            upload(images);
          }}
        >
          Upload
        </Button>
      )}
    </Stack>
  );
}
