import React, { useState, useEffect } from "react";
import logo from "../../assets/dot-logo-600.png";
import "./header.css";
import TextReplacer from "./text-animation";
export const AppHeader = () => {
	const [showText, setShowText] = useState(false);
	const handleMouseEnter = () => {
		setShowText(true);
	};

  useEffect(()=> {
    setTimeout(() => {
      setShowText(true);
    }, 1000);
  },[]);

	const handleMouseLeave = () => {
		setShowText(false);
	};
	return (
		<div>
			<div className="logo">
				<span className={`block ${showText ? "slide-in" : "dont-show"}`}>
					<TextReplacer text="File An" initialTimeout={4000} finalTimeout={3200}/>
				</span>
				<span>
					<img
						src={logo}
						alt="logo"
						width={80}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					></img>
				</span>
				<span className={`block ${showText ? "slide-out" : "dont-show"}`}>
					<TextReplacer text="nymizer" initialTimeout={5600} finalTimeout={3200} />
				</span>
			</div>
		</div>
	);
};
