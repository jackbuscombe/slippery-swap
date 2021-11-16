import { Button, Image, Space, Typography } from "antd";
import { useMoralis } from "react-moralis";
import { Flex } from "uikit/Flex/Flex";

export default function Auth(props) {
	const { authenticate } = useMoralis();
	const { Title, Paragraph, Text, Link } = Typography;
	const styles = {
		outerDiv: {
			margin: "auto",
			padding: "10px",
		},
		content: {
			textAlign: "center",
			marginBottom: "60px",
		},
		image: {
			display: "block",
			marginLeft: "auto",
			marginRight: "auto",
			marginBottom: "10px",
		},
		button: {
			display: "flex",
		},
	};

	return (
		<div style={styles.outerDiv}>
			<div style={styles.content}>
				<img width={200} src={props.logo} preview={false} style={styles.image} />
				<Title>Gasless</Title>
				<Paragraph strong italic>
					The Electric Car Of Blockchain
				</Paragraph>
			</div>
			<Button onClick={authenticate} type="primary" size="large" block>
				<Space>
					<img src={props.metamaskFox} width={30} marginRight="10px" />
					Login
				</Space>
			</Button>
		</div>
	);
}
