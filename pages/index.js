import { useEffect, useState } from "react";
import SingleFileUpload from "../components/Buttons/SingleUpload";
import BatchFileUpload from "../components/Buttons/BatchUpload";
import styles from "../styles/Home.module.css";
import axios from "../utils/axios";
import { v4 as uuidv4 } from "uuid";
import Select from "../components/Select/Index";
import Image from "next/image";

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
    axios
      .post("/api/upload/single", formData)
      .then((res) => {
        setLoading(false);

        if (res.data) {
          // console.log(res.data);
          window.open(res.data.answer_sheet_url, "_blank");
          window.open(res.data.marked_sheet_url, "_blank");
          setImage(null);
          setImageUri("");
          // console
        }
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const uploadBatchFile = async (content) => {
    const formData = new FormData();
    formData.append("filezip", content);
    formData.append("name", uuidv4());
    try {
      setLoading(true);
      const response = await axios.post("/api/upload/batchBuffer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      console.log(response);
      window.location.replace(response.data.zipfilepath);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  return (
    <div className={styles.container} style={{}}>
      {uploadType == "Single" && (
        <div>
          {imageUri && (
            <Image
              src={imageUri}
              height={500}
              width={500}
              alt="Upload an Image"
            />
          )}
        </div>
      )}
      {uploadType == "Batch" && progress != -1 && (
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
