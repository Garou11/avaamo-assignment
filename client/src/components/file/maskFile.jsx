import React, { useState, useRef, useEffect } from 'react';
import './maskFile.css';
import Strip from "../common/strip";
import axios from "axios";

const FileEditModal = ({ file, onClose, onSave, userID, setFileError }) => {
  const popupRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);
  const [newParameters, setNewParameters] = useState({
   word: '',
   synonyms: [],
   isSynonym: false,
   synonymCount: {}
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewParameters((prevParameters) => ({
      ...prevParameters,
      word: value,
    }));
  };
  const handleCheckChange = (e) => {
    setNewParameters((prevParameters) => ({
      ...prevParameters,
      isSynonym: e.target.checked,
    }));
  };

  const handleSubmit = async () => {
    onSave(file, newParameters);
    try{
      const synonymData = await axios.post('http://localhost:4000/file/countWords', {
        userID: userID,
        word: newParameters.word,
        fileName: file.filename,
        findSynonyms: newParameters.isSynonym
      });
      if(!synonymData || !synonymData.data || !synonymData.data.isSuccess) {
        throw new Error("unable to find synonym data")
      };
      setNewParameters({
        ...newParameters,
        synonymCount: synonymData.data.data,
        synonyms: Object.keys(synonymData.data.data).filter((key) => synonymData.data.data[key] > 0),
      });
      return;
    } catch(err) {
      setFileError("Unable to fetch synonyms");
      return;
    }
  };
  const handleMask = async () => {
    onSave(file, newParameters);
    try{
      const maskedData = await axios.post('http://localhost:4000/file/maskPdf', {
        userID: userID,
        word: newParameters.synonyms,
        fileName: file.filename,
      },{
        responseType: 'blob',
      });
      if(!maskedData || !maskedData.data || !maskedData.data.isSuccess) {
        throw new Error("unable to find synonym data")
      };
      debugger
      return;
    } catch(err) {
      setFileError("Unable to fetch synonyms");
      return;
    }
  };

  return (
      <div className="popup col-xs-12 col-md-6">
        <div className="content">
          <span className="close" onClick={onClose} style={{ fontSize: '20px', cursor: 'pointer', color: '#fff' }}>&times;</span>
          <Strip step={2.5} text="Mask File" delay={500} />
          <input className="input-field col-xs-4 col-md-5" type="text" name="wordInput" value={newParameters.word} onChange={handleChange} placeholder='Enter the word to find' autoComplete='off' />
          <label className="checkbox-container col-xs-12 col-md-12" style={{ fontSize: '14px', color: '#fff' }}>
            <input
              type="checkbox"
              checked={newParameters.isSynonym}
              onChange={handleCheckChange}
            />
            Find Synonyms
          </label>
          <button onClick={handleSubmit} disabled={newParameters.word.length ===0}>Fetch Count</button>
          {newParameters.synonyms.length > 0 && (
            <><div className="synonyms-container">
            <ul>
              {newParameters.synonyms.map((synonym) => (
                <li key={synonym}>{synonym} - Count: {newParameters.synonymCount[synonym]}</li>
              ))}
            </ul>
          </div><button onClick={handleMask} disabled={newParameters.synonyms.length === 0}>Mask File</button></>
          )}
        </div>
      </div>
  );
};

export default FileEditModal;