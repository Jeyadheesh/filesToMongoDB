import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!selectedFile) {
        setUploadMessage("Please select a file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:9000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadMessage(response.data);
    } catch (error) {
      console.error(error);
      setUploadMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadMessage}</p>
    </div>
  );
}

export default FileUpload;
