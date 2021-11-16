const ABI = [
	{ inputs: [], name: "WETH", outputs: [{ internalType: "contract IERC20", name: "", type: "address" }], stateMutability: "view", type: "function" },
	{
		inputs: [
			{ internalType: "address", name: "_tokenOut", type: "address" },
			{ internalType: "uint256", name: "_amountOutMin", type: "uint256" },
			{ internalType: "address", name: "_to", type: "address" },
		],
		name: "ethInSwap",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_tokenIn", type: "address" },
			{ internalType: "uint256", name: "_amountIn", type: "uint256" },
			{ internalType: "uint256", name: "_amountOutMin", type: "uint256" },
			{ internalType: "address", name: "_to", type: "address" },
		],
		name: "ethOutSwap",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_tokenIn", type: "address" },
			{ internalType: "address", name: "_tokenOut", type: "address" },
			{ internalType: "uint256", name: "_amountIn", type: "uint256" },
			{ internalType: "uint256", name: "_amountOutMin", type: "uint256" },
			{ internalType: "address", name: "_to", type: "address" },
		],
		name: "tokenSwap",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{ inputs: [], name: "uniswap", outputs: [{ internalType: "contract IUniswapV2Router", name: "", type: "address" }], stateMutability: "view", type: "function" },
];
