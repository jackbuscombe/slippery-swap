import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import { MoralisDappProvider } from "./providers/MoralisDappProvider/MoralisDappProvider";

const APP_ID = "QfzNAksTpBj2HGHFf44INKoUmrYK5wsKlDZjYKkl";
const SERVER_URL = "https://hxoknbh4j3d7.usemoralis.com:2053/server";

ReactDOM.render(
	<React.StrictMode>
		<MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
			<MoralisDappProvider>
				<App />
			</MoralisDappProvider>
		</MoralisProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
