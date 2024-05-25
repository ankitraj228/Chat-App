import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('/upload', formData)
      .then(response => {
        console.log('File uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
}

export default FileUpload;
