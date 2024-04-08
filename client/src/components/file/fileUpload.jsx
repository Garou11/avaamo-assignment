import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation, BrowserRouter } from 'react-router-dom'
import axios from 'axios';
import FileTable from './existingFiles';

const FileUpload = () => {

  const [files, setFiles] = useState([]);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [userId, setUserId] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  useEffect(() => {
    async function getExistingFiles() {
      const searchParams = new URLSearchParams(window.location.search);
  
      const userId = searchParams.get('userId');
      try {
        const fileList = await axios.get('http://localhost:4000/file/getDocs?userID='+userId);
        if(fileList.data && fileList.data.data) {
          setFilesUploaded(fileList.data.data);
          setUserId(userId);
        }
      } catch (err) {
        setFileError('Unable to fetch existing documents');
      }
    }
    getExistingFiles();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    files.forEach((file)=> {
      formData.append('pdfFiles', file);
    })
    formData.append('userID', userId);
    debugger
    try {
      const postResponse = await axios.post('http://localhost:4000/file/upload', formData);
      if(!postResponse.data.isSuccess) {
        throw new Error("Failed. Error -> "+ postResponse.data.error)
      }
      const addedFiles = postResponse.data.fileInfo.map((fileAdded)=> {
        return fileAdded.filename;
      });
      setFilesUploaded(addedFiles);
      return;
    } catch(err){
      console.log(err);
      return;
    }
  };

  return (
    <div className="App">
      <h1>Upload PDFs</h1>
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {files.length > 0 && (
        <div>
          <h2>Selected Files:</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}
      <FileTable fileList={filesUploaded} />
    </div>
  );
}
  
  export default FileUpload;