import "./App.css";
import FileUpload from "./components/file/fileUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import React, { useEffect, useState } from "react";
import { AppHeader } from "./components/common/header";
import { motion } from "framer-motion";

function App() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.onload = () => {
			setLoaded(true);
		};
		img.src = "./assets/AnonymousBG.jpeg";
	}, []);
	return (
		<div className="App">
			<div className={`app ${loaded ? "loaded" : ""}`}>
				<motion.div
					className="element"
					initial={{ opacity: 0, y: 100 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<div className="heading">
            <AppHeader />
          </div>
          <FileUpload />
				</motion.div>
			</div>
		</div>
	);
}

export default App;
