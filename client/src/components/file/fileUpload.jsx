import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import FileTable from "./existingFiles";
import { ErrorMessageViewer } from "../errors/errorMessage";
import { AppHeader } from "../common/header";
import "./fileUpload.css";
import Strip from "../common/strip";

const FileUpload = () => {
	const [files, setFiles] = useState([]);
	const [filesUploaded, setFilesUploaded] = useState([]);
	const [fileError, setFileError] = useState(null);
	const [userId, setUserId] = useState(null);

	const [activeIndex, setActiveIndex] = useState(null);

	useEffect(() => {
		if (fileError) {
			setTimeout(() => {
				setFileError(null);
			}, 10000);
		}
	}, [fileError]);

	const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    const duplicateFiles = [];
    const updatedFiles = acceptedFiles.map(file => {
      const isDuplicate = files.some(existingFile => existingFile.name === file.name);
      if (isDuplicate) {
        duplicateFiles.push(file.name);
        return null;
      } else {
        return file;
      }
    });
		setFiles([...files, ...updatedFiles]);
    if (rejectedFiles.length > 0) {
      setFileError('Only PDF files are allowed.');
    } else if(duplicateFiles.length > 0) {
      setFileError('Duplicate files found -> '+ duplicateFiles.join(', '));
    }else {
      setFileError(null);
    }
	}, []);

	useEffect(() => {
		async function getExistingFiles() {
			const searchParams = new URLSearchParams(window.location.search);

			const userId = searchParams.get("userId");
			try {
				const fileList = await axios.get("http://localhost:4000/file/getDocs?userID=" + userId);
				if (fileList.data && fileList.data.data) {
					setFilesUploaded(fileList.data.data);
					setUserId(userId);
				}
				return;
			} catch (err) {
				setFilesUploaded([
					{
						filename: "TEST1",
						size: "20",
						uniqueWordsCount: "10",
					},
					{
						filename: "TEST1",
						size: "20",
						uniqueWordsCount: "10",
					},
				]);
				setFileError("Unable to fetch existing documents");
				return;
			}
		}
		getExistingFiles();
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/pdf": [".pdf"],
		},
    multiple: true
	});

	const handleUpload = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		files.forEach((file) => {
			formData.append("pdfFiles", file);
		});
		formData.append("userID", userId);
		try {
			const postResponse = await axios.post("http://localhost:4000/file/upload", formData);
			if (!postResponse.data.isSuccess) {
				throw new Error("Failed. Error -> " + postResponse.data.error);
			}
			const addedFiles = postResponse.data.fileInfo.map((fileAdded) => {
				return fileAdded.filename;
			});
			setFilesUploaded(addedFiles);
			return;
		} catch (err) {
			console.log(err);
			setFileError("Unable to upload documents");
			return;
		}
	};

	return (
		<div className="file-app">
			<Strip step={1} text="Upload Files" delay={500} />
			<div className="drop-zone-container row align-middle content-between mb-4">
				<div
					{...getRootProps()}
					className="drop-zone col-xs-10 col-md-7 content-center"
					style={{ border: "2px dashed #ccc", padding: "20px", textAlign: "center", cursor: "pointer" }}
				>
					<input {...getInputProps()} />
					{isDragActive ? (
						<p>Drop the files here ...</p>
					) : (
						<p>Drag 'n' drop some files here, or click to select files</p>
					)}
				</div>
				<div className="col-xs-10 col-md-3">
					<ul className="file-list" style={{ width: "fit-content" }}>
						{files.map((file, index) => (
							<li key={index}>{file.name}</li>
						))}
					</ul>
					<button className="upload" onClick={handleUpload} disabled={files.length === 0}>
						Upload
					</button>
				</div>
			</div>
			<Strip step={2} text="View File Analytics" delay={10000} />
			<div className="file-analytics row align-middle content-between">
				<FileTable fileList={filesUploaded} />
			</div>
			<ErrorMessageViewer errorMessage={fileError} />
		</div>
	);
};

export default FileUpload;
