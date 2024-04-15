import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUpload from "../components/FileUpload";

function App() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/files");
      setFiles(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:9000/download/${fileName}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      console.log(url);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <FileUpload />
      <h1>Uploaded Files</h1>

      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <div>{file.fileName}</div>
            <button onClick={() => downloadFile(file.fileName)}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
