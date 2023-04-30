import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import { PulseLoader } from "react-spinners";

export default function SingleFileUpload({
  image,
  setImage,
  imageUri,
  setImageUri,
  multiple = false,
  upload,
  loading,
  setLoading,
  webkitdirectory = false,
}) {
  useEffect(() => {
    if (image) {
      const uri = URL.createObjectURL(image);
      setImageUri(uri);
    }
  }, [image]);

  return (
    <Stack direction="column" alignItems="center" spacing={1} width={"500px"}>
      <Button variant="contained" component="label" fullWidth>
        Choose File
        <input
          onChange={(e) => {
            if (!webkitdirectory) {
              setImage(e.target.files[0]);
            } else {
              setImage(e.target.files);
            }
          }}
          hidden
          accept="image/*"
          type="file"
          webkitdirectory={webkitdirectory}
        />
      </Button>
      {loading ? (
        <PulseLoader />
      ) : (
        <Button
          fullWidth
          variant="outlined"
          onClick={async () => {
            upload(image);
          }}
        >
          Upload
        </Button>
      )}
    </Stack>
  );
}
