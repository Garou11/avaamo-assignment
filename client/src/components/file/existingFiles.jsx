import React, {useState} from "react";
import './fileUpload.css';
import { BsPencilSquare } from 'react-icons/bs';
import FileEditModal from "./maskFile";

const FileTable = ({ fileList }) => {
	const [selectedFile, setSelectedFile] = useState(null);

  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
  };

  const handleSaveChanges = (file, newParameters) => {
    console.log('Saving changes for file:', file, 'New parameters:', newParameters);
  };
	return (
		<div className="file-table-container">
			<table className="file-table">
				<thead>
					<tr>
						<th>File Name</th>
						<th>Size (KB)</th>
						<th>Number of Unique Word</th>
					</tr>
				</thead>
				<tbody>
					{fileList.map((file, index) => (
						<tr key={index}>
							<td className="clickable" onClick={() => handleFileClick(file)}>{file.filename}
								<BsPencilSquare onClick={() => handleFileClick(file)} style={{ marginLeft: '5px', cursor: 'pointer' }} />
							</td>
							<td>{file.size}</td>
							<td>{file.uniqueWordsCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<FileEditModal file={selectedFile} isOpen={selectedFile !== null} onClose={handleCloseModal} onSave={handleSaveChanges} />
		</div>
	);
};

export default FileTable;
