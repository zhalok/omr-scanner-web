import fileDownload from "js-file-download";
import Head from "next/head";
import { useState } from "react";
import FileUpload from "../components/Buttons/Upload";
import DisplayResult from "../components/Display/DisplayResult";
import styles from "../styles/Home.module.css";
import axios from "../utils/axios";

export default function Home() {
  const [resultImage, setResultImage] = useState("");

  const submitFile = async (file) => {
    if (!file) {
      alert("Please choose a file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async function (e) {
      const binData = e.target.result;
      const encode = Buffer.from(binData).toString("base64");

      try {
        const response = await axios.post("/process", { image: encode });
        window.open(response.data.answer_file_url, "_blank");
        window.open(response.data.marked_sheet_url, "_blank");
        const answerResponse = await axios.get(response.data.answer_file_url, {
          responseType: "blob",
        });
        const detectionResponse = await axios.get(
          response.data.marked_sheet_url,
          {
            responseType: "blob",
          }
        );

        fileDownload(answerResponse.data, "results.txt");
        fileDownload(detectionResponse.data, "marked_sheet.jpg");
      } catch (e) {
        console.log(e);
      }
    };
    reader.onerror = function (e) {
      console.log("Error : " + e.type);
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className={styles.container}>
      <FileUpload onSubmit={submitFile} />
      {resultImage && <DisplayResult base64String={resultImage} />}
    </div>
  );
}
