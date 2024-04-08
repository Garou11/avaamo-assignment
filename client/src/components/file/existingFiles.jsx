import React, {useEffect, useState} from "react";
import './fileUpload.css';
import { BsPencilSquare } from 'react-icons/bs';
import FileEditModal from "./maskFile";
import axios from "axios";

const FileTable = ({ fileList, userId, setFileError }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [uniqeWordData, setUniqueWordData] = useState({});

	useEffect(() => {
		async function getUniqueWords(){
			setUniqueWordData({});
			const uniqueWordsDataPromises = await Promise.allSettled(fileList.map(async(ele)=> {
				try{
					 const res = await axios.post('http://localhost:4000/file/countUniqueWords',{
						userID: userId,
						fileName: ele.filename
					});
						return {data:res.data, fileName: ele.filename};
				} catch (err) {
					console.log(err);
					setFileError("Unable to fetch unique word count");
					return;
				}
			}));
			const uniqueWordsData ={};
			uniqueWordsDataPromises.filter(ele=> ele.status === "fulfilled").forEach(ele=> {
				uniqueWordsData[ele.value.fileName] = ele.value.data.data;
			});
			console.log(uniqueWordsData);
			setUniqueWordData(uniqueWordsData);
		}
		getUniqueWords();
		
	},[fileList]);

	

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
			<table className="file-table col-xs-12 col-md-12">
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
							<td>{Object.keys(uniqeWordData).includes(file.filename) ? uniqeWordData[file.filename].uniqueWordCount : 0}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default FileTable;
