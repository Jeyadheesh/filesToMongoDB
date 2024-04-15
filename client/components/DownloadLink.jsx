const DownloadLink = ({ filename }) => {
  const handleClick = async () => {
    try {
      const response = await axios.get(`/download/${filename}`);
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename; // Set download filename
      link.click(); // Simulate a click to trigger download
      window.URL.revokeObjectURL(url); // Clean up temporary URL
    } catch (err) {
      console.error(err);
      alert("Error downloading file");
    }
  };

  return <button onClick={handleClick}>Download {filename}</button>;
};
