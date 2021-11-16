import { useState, useEffect, useRef } from "react";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import AssetModal from "./components/AssetModal";
import useInchDex from "hooks/useInchDex";
import { useERC20Balance } from "hooks/useERC20Balance";
import styles from "./styles";
import { Button, Skeleton, Switch, Typography } from "antd";
import ERC20Balance from "components/ERC20Balance";
import { ABI } from ".../abi";

const chainIds = {
	"0x1": "eth",
	"0x38": "bsc",
	"0x89": "polygon",
};

const getChainById = (id) => chainIds[id];

function Dex({ chain }) {
	const { trySwap, getQuote, getSupportedTokens, tokenList } = useInchDex();
	const { assets } = useERC20Balance();
	const { Moralis } = useMoralis();
	const { chainId, walletAddress } = useMoralisDapp();
	const [isFromModalActive, setFromModalActive] = useState(false);
	const [isToModalActive, setToModalActive] = useState(false);
	const [fromToken, setFromToken] = useState({ symbol: "USDC", name: "USD Coin", address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6, logoURI: "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png" });
	const [toToken, setToToken] = useState({ symbol: "ETH", name: "Ethereum", decimals: 18, address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", logoURI: "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png" });
	const [fromAmount, setFromAmount] = useState("");
	const [quote, setQuote] = useState();
	const [currentTrade, setCurrentTrade] = useState();
	const [gasless, setGasless] = useState(true);
	const [fromTokenBalance, setFromTokenBalance] = useState("");

	const onChangeHandler = (event) => setFromAmount(event.target.value);
	const Web3Api = useMoralisWeb3Api();
	const currentAddress = fromToken.address;
	Moralis.start({ serverUrl: "https://hxoknbh4j3d7.usemoralis.com:2053/server", appId: "QfzNAksTpBj2HGHFf44INKoUmrYK5wsKlDZjYKkl" });

	useEffect(() => {
		handleFromBalance();
		if (fromToken && toToken && fromAmount) setCurrentTrade({ fromToken, toToken, fromAmount, chain });
	}, [toToken, fromToken, fromAmount, chain]);

	useEffect(() => {
		if (currentTrade) getQuote(currentTrade).then((quote) => setQuote(quote));
	}, [currentTrade]);

	if (getChainById(chainId) !== chain) return <>Switch to supported {chain} network or edit Dex settings </>;

	async function handleFromBalance() {
		const balances = await Web3Api.account.getTokenBalances({ chain: chainId, address: walletAddress });
		for (let i = 0; i < balances.length; i++) {
			if (balances[i].token_address == currentAddress) {
				return setFromTokenBalance(parseFloat(Moralis.Units.FromWei(balances[i].balance, fromToken?.decimals).toFixed(6)));
			}
		}
		return setFromTokenBalance(0);
	}

	// const { runContractFunction, contractResponse, error, isRunning, isLoading } = useWeb3Contract({
	// 	abi: usdcEthPoolAbi,
	// 	contractAddress: usdcEthPoolAddress,
	// 	functionName: "observe",
	// 	params: {
	// 		secondsAgos: [0, 10],
	// 	},
	// });

	async function doSwap() {
		if (gasless) {
			if (fromToken.symbol != "ETH" && toToken.symbol != "ETH") {
				const receipt = await Moralis.executeFunction(swapOptionsTokenSwap);
				console.log(receipt);
			} else if (fromToken.symbol == "ETH" && toToken.symbol != "ETH") {
				const receipt = await Moralis.executeFunction(swapOptionsEthInSwap);
				console.log(receipt);
			} else if (fromToken.symbol != "ETH" && toToken.symbol == "ETH") {
				const receipt = await Moralis.executeFunction(swapOptionsEthOutSwap);
				console.log(receipt);
			} else {
				alert("Select A Valid Swap Pair");
			}
		} else {
			trySwap(currentTrade);
		}
	}

	const swapOptionsTokenSwap = {
		contractAddress: "0x3DAD4dF6d09Ad8C131E5C3d12203E2043DDfd710",
		functionName: "tokenSwap",
		abi: ABI,
		params: {
			_tokenIn: fromToken.address,
			_tokenOut: toToken.address,
			_amountIn: Moralis.Units.Token(fromAmount, fromToken.decimals),
			_amountOutMin: 0,
			_to: walletAddress,
		},
	};

	const swapOptionsEthInSwap = {
		contractAddress: "0x3DAD4dF6d09Ad8C131E5C3d12203E2043DDfd710",
		functionName: "ethInSwap",
		abi: ABI,
		params: {
			_tokenOut: toToken.address,
			_amountOutMin: 0,
			_to: walletAddress,
			msgValue: Moralis.Units.ETH(fromAmount),
		},
	};

	const swapOptionsEthOutSwap = {
		contractAddress: "0x3DAD4dF6d09Ad8C131E5C3d12203E2043DDfd710",
		functionName: "ethOutSwap",
		abi: ABI,
		params: {
			_tokenIn: toToken.address,
			_amountIn: Moralis.Units.Token(fromAmount, fromToken.decimals),
			_amountOutMin: 0,
			_to: walletAddress,
		},
	};

	const { Title, Paragraph, Text, Link } = Typography;
	return (
		<div style={{ display: "flex", justifyContent: "center" }}>
			<div style={styles.card}>
				<div>
					<div style={styles.header}>
						<h1>Swap</h1>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<circle cx="14" cy="6" r="2"></circle>
							<line x1="4" y1="6" x2="12" y2="6"></line>
							<line x1="16" y1="6" x2="20" y2="6"></line>
							<circle cx="8" cy="12" r="2"></circle>
							<line x1="4" y1="12" x2="6" y2="12"></line>
							<line x1="10" y1="12" x2="20" y2="12"></line>
							<circle cx="17" cy="18" r="2"></circle>
							<line x1="4" y1="18" x2="15" y2="18"></line>
							<line x1="19" y1="18" x2="20" y2="18"></line>
						</svg>
					</div>
					<div>
						<div style={styles.swapbox}>
							<div style={styles.header}>
								<div style={styles.swapboxHeader}>From</div>
								<div
									style={styles.swapboxHeader}
									onClick={() => {
										setFromAmount(fromTokenBalance);
									}}
								>
									<Skeleton loading={!assets} active>
										<Text>Balance: {fromTokenBalance}</Text>
									</Skeleton>
								</div>
							</div>
							<div style={styles.swapboxSelect}>
								<input style={styles.swapboxInput} placeholder="0.00" type="number" onChange={onChangeHandler} value={fromAmount} />
								<div
									style={styles.selectedRow}
									onClick={() => {
										setFromModalActive(true);
										getSupportedTokens(chain);
									}}
								>
									<img className="token_image" style={styles.selectedToken} src={fromToken?.logoURI} alt={fromToken?.symbol} />
									<span>{fromToken?.symbol}</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<polyline points="6 9 12 15 18 9" />
									</svg>
								</div>
							</div>
						</div>
						<div style={{ display: "flex", justifyContent: "center" }}>
							<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<line x1={12} y1={5} x2={12} y2={19} />
								<line x1={16} y1={15} x2={12} y2={19} />
								<line x1={8} y1={15} x2={12} y2={19} />
							</svg>
						</div>
						<div style={styles.swapbox}>
							<div style={styles.swapboxHeader}>To</div>
							<div style={styles.swapboxSelect}>
								<input style={styles.swapboxInput} type="number" placeholder="0.00" value={quote ? Moralis.Units.FromWei(quote?.toTokenAmount, quote?.toToken?.decimals).toFixed(6) : ""} readOnly />
								<div
									style={styles.selectedRow}
									onClick={() => {
										setToModalActive(true);
										getSupportedTokens(chain);
									}}
								>
									<img style={styles.selectedToken} src={toToken?.logoURI} alt={toToken?.symbol} />
									<span>{toToken?.symbol}</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<polyline points="6 9 12 15 18 9" />
									</svg>
								</div>
							</div>
						</div>
						<div style={{ display: "flex", justifyContent: "left", marginBottom: "10px" }}>
							<div>
								<h4 style={styles.networkFeeText}>Gasless Trade: </h4>
								<h4 style={styles.networkFeeText}>Estimated Network Fee:</h4>
							</div>
							<div style={{ marginLeft: "auto", marginRight: "0", alignContent: "right", textAlign: "end" }}>
								<Switch checkedChildren="Gasless" unCheckedChildren="Gas Extra" checked={gasless} onChange={setGasless} style={styles.networkFeeText} />
								<br />
								<Text strong style={styles.networkFeeText} {...(gasless ? { type: "success" } : {})}>
									{gasless ? "FREE!" : <span id="gas_estimate">{quote?.estimatedGas}</span>}
								</Text>
							</div>
						</div>
						<button style={styles.swapButton} onClick={doSwap} disabled={!currentTrade}>
							Swap
						</button>
					</div>
				</div>
				<AssetModal open={isFromModalActive} onClose={() => setFromModalActive(false)} setToken={setFromToken} tokenList={tokenList} style={{ position: "fixed", top: "50%", left: "50%" }} />
				<AssetModal open={isToModalActive} onClose={() => setToModalActive(false)} setToken={setToToken} tokenList={tokenList} />
			</div>
			<ERC20Balance />
		</div>
	);
}

export default Dex;
