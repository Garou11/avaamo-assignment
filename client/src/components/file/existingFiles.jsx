import React from 'react';

const FileTable = ({ fileList }) => {
  return (
    <table>
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
  );
};

export default FileTable;