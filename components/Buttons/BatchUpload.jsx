import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { PulseLoader } from "react-spinners";

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
  return (
    <Stack direction="column" alignItems="center" spacing={1} width={"500px"}>
      <Button variant="contained" component="label" fullWidth>
        Choose Folder
        <input
          onChange={(e) => {
            setImages(Array.from(e.target.files));
          }}
          hidden
          accept="image/*"
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
