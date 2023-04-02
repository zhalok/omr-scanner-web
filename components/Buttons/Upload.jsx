import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Image from "next/image";

export default function FileUpload({ onSubmit }) {
  const [imageURI, setImageURI] = useState("");
  const [image, setImage] = useState(null);
  useEffect(() => {
    // console.log(image);
    if (image) {
      const uri = URL.createObjectURL(image);
      // console.log(uri);
      setImageURI(uri);
    }
  }, [image]);

  return (
    <Stack direction="column" alignItems="center" spacing={2}>
      <div>
        <Image src={imageURI} height={500} width={500} />
      </div>
      <Button variant="contained" component="label" fullWidth>
        Choose File
        <input
          onChange={(e) => {
            setImage(e.target.files[0]);
            // console.log(e.target.files[0]);
          }}
          hidden
          accept="image/*"
          type="file"
        />
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={async () => {
          onSubmit(image);
        }}
      >
        Upload
      </Button>
    </Stack>
  );
}
