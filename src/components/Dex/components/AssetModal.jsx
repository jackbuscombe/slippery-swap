import React, { useState } from "react";
import { Skeleton, Input, Divider } from "antd";
import TokenPrice from "components/TokenPrice";

const styles = {
	modal: {
		height: "100vh",
		width: "100vw",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
		position: "fixed",
		top: "0",
		left: "0",
		zIndex: "3",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	modalHeader: {
		display: "flex",
		justifyContent: "space-between",
		paddingBottom: "20px",
	},
	modalContent: {
		maxWidth: "430px",
		width: "100%",
		height: "500px",
		padding: "20px",
		background: "#FFFFFF",
		borderRadius: "20px",
	},
	tokens: {
		height: "80%",
		overflow: "auto",
	},
	tokenRow: {
		padding: "5px 0",
		display: "flex",
		alignItems: "center",
		cursor: "pointer",
	},
	logo: {
		height: "32px",
		width: "32px",
		marginRight: "10px",
	},
	closeButton: {
		cursor: "pointer",
	},
};

function AssetModal({ open, onClose, setToken, tokenList }) {
	const [searchTerm, setSearchTerm] = useState("");
	const { Search } = Input;

	if (!open) return null;

	return (
		<div style={styles.modal}>
			<div style={styles.modalContent}>
				<div style={styles.modalHeader}>
					<h4>Select a Token</h4>
					<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={onClose} style={styles.closeButton}>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<line x1={18} y1={6} x2={6} y2={18} />
						<line x1={6} y1={6} x2={18} y2={18} />
					</svg>
				</div>
				<Search
					placeholder="Search Name or Paste Address..."
					enterButton
					onChange={(event) => {
						setSearchTerm(event.target.value);
					}}
					style={{ marginBottom: "15px" }}
				/>
				<Skeleton loading={!tokenList} active avatar>
					<div style={styles.tokens}>
						{!tokenList
							? null
							: Object.keys(tokenList)
									.filter((token) => {
										if (searchTerm == "") {
											return token;
										} else if (tokenList[token].symbol.toLowerCase().includes(searchTerm.toLowerCase()) || tokenList[token].name.toLowerCase().includes(searchTerm.toLowerCase()) || tokenList[token].address.toLowerCase().includes(searchTerm.toLowerCase())) {
											return token;
										}
									})
									.map((token, index) => (
										<div
											style={styles.tokenRow}
											onClick={() => {
												setToken(tokenList[token]);
												onClose();
											}}
											key={index}
										>
											<img style={styles.logo} src={tokenList[token].logoURI} alt="noLogo" />
											<div>
												<h4>{tokenList[token].name}</h4>
												<span style={{ fontWeight: "600", fontSize: "15px", lineHeight: "14px" }}>{tokenList[token].symbol}</span>
											</div>
										</div>
									))}
					</div>
				</Skeleton>
			</div>
		</div>
	);
}

export default AssetModal;
