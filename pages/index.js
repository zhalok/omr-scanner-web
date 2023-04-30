import fileDownload from "js-file-download";
import Head from "next/head";
import { useEffect, useState } from "react";
import SingleFileUpload from "../components/Buttons/SingleUpload";
import BatchFileUpload from "../components/Buttons/BatchUpload";
import DisplayResult from "../components/Display/DisplayResult";
import styles from "../styles/Home.module.css";
import axios from "../utils/axios";
import PulseLoader from "react-spinners";
import { v4 as uuidv4 } from "uuid";
// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Select from "../components/Select/Index";
import Image from "next/image";
import JSZip from "jszip";
import throttle from "lodash.throttle";
import { saveAs } from "file-saver";

export default function Home() {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [imageUri, setImageUri] = useState("");
  const [uploadType, setUplodType] = useState("Single");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(-1);

  useEffect(() => {
    setImage(null);
    setImageUri("");
  }, [uploadType]);

  const uploadSingleFile = async (file) => {
    if (!file) {
      alert("Pleaes select a file");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    const name = uuidv4();
    formData.append("file", image);
    formData.append("name", name);
    axios.post("/api/upload/total", formData).then((res) => {
      setLoading(false);

      if (res.data) {
        console.log(res.data);
        setImage(null);
        setImageUri("");
      }
    });
  };
  const onZipUpdate = (metadata) => {
    setProgress(metadata.percent);
    console.log("progression: " + metadata.percent.toFixed(2) + " %");
    if (metadata.currentFile) {
      console.log("current file = " + metadata.currentFile);
    }
  };
  const throttledZipUpdate = throttle(onZipUpdate, 50);
  const uploadBatchFile = async (files) => {
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });
    zip
      .generateAsync({ type: "blob" }, throttledZipUpdate)
      .then(function (content) {
        // saveAs(content, "files.zip");
        const formData = new FormData();
        formData.append("folderzip", content);

        console.log("ready to send to server", content);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className={styles.container} style={{}}>
      {uploadType == "Single" && (
        <div>
          <Image
            src={imageUri}
            height={500}
            width={500}
            // alt="Upload an Image"
          />
        </div>
      )}
      {uploadType == "Batch" && (
        <progress style={{ width: "100%" }} max="100" value={progress}>
          {progress?.toFixed(2)}%{" "}
        </progress>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "20px",
          width: "100%",
        }}
      >
        <Select
          items={["Single", "Batch"]}
          selectedItem={uploadType}
          setSelectedItem={setUplodType}
          label={"Upload Type"}
        />

        <div style={{ marginTop: "20px" }}>
          {uploadType == "Single" && (
            <SingleFileUpload
              image={image}
              setImage={setImage}
              imageUri={imageUri}
              setImageUri={setImageUri}
              upload={uploadSingleFile}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {uploadType == "Batch" && (
            <BatchFileUpload
              images={images}
              setImages={setImages}
              progress={progress}
              setProgress={setProgress}
              upload={uploadBatchFile}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
