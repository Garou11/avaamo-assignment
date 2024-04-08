import React, {useState, useEffect} from 'react'
import logo from "../../assets/dot-logo-600.png"
import './header.css'
export const AppHeader = () => {
  const [showText, setShowText] = useState(true);
  return (
    <div>
      <div className='logo'>
        <img src={logo} alt='logo' width={80} style={{ cursor: 'pointer' }}></img>
      </div>
      <div className='heading'>
        {showText && <h1 className="text-animation">File Anonymizer</h1>}
      </div>
    </div>
  );
};