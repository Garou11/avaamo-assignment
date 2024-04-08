import React from "react";
import './fileUpload.css';

const FileTable = ({ fileList }) => {
	return (
		<div className="file-table-container">
			<table className="file-table">
				<thead>
					<tr>
						<th>File Name</th>
						<th>Size</th>
					</tr>
				</thead>
				<tbody>
					{fileList.map((file, index) => (
						<tr key={index}>
							<td>{file.filename}</td>
							<td>{file.size}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default FileTable;
