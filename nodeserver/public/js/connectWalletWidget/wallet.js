//const { ethers } = window;
import { formatUnits, parseEther } from 'ethers'

let contract;
let signeraddress;
//let signer;
let value;
let assetContract;
let currentasset = 'ETH';

const assetprice = 0.10875;
const minValue = 0.05;

const toggleassetdropdown = document.getElementById('toggleassetdropdown');
const inputmodalitems = document.querySelectorAll('.input__modal--item');
const inputmodal = document.querySelector('.input__modal');
const valueinput = document.getElementById('valueinput');

const contractabi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_usdtAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "currency",
                "type": "string"
            }
        ],
        "name": "PaymentReceived",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getEtherBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getUsdtBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "receiveeth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "receiveusdt",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "usdt",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawETH",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawUSDT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const assetAbi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

const assetAddress = '0x479310Cc3bbcbFdE5B980307a6A658D102e7eD0d';

toggleassetdropdown.addEventListener('click', function (event) {
    inputmodal.style.display = 'flex';
});

inputmodalitems.forEach(function (inputmodalitem) {
    inputmodalitem.addEventListener('click', selectModalItem);
});


valueinput.addEventListener('input', computeInputData);

async function selectModalItem(event) {
    const optiontext = this.querySelector('span:last-child').textContent;
    document.getElementById('buttonname').innerHTML = optiontext;
    document.getElementById('dropdownlogo').src = this.id;
    inputmodal.style.display = 'none';

    currentasset = optiontext;

    if (optiontext === 'ETH') {
        await returnUserBalance('eth')
    } else {
        await returnUserBalance('usdt')
    }
}

async function connectWallet(useraddress, signer, Contract) {
    try {
        document.getElementById('connectbtn').textContent = 'Processing...';

        signeraddress = useraddress;
        document.getElementById('useraddr').textContent = shortenString(signeraddress, 20);

        const optiontext = document.getElementById('buttonname').textContent;
        currentasset = optiontext;

        contract = new Contract(
            "0x3C77C7b307f96eA0aBba40A1a2e4C8BaFb954BE7",
            contractabi,
            signer
        );

        assetContract = new Contract(assetAddress, assetAbi, signer);

        if (optiontext === 'ETH') {
            await returnUserBalance('eth');
        } else {
            await returnUserBalance('usdt');
        }
        buttonlabel = 'Buy $XRPETF';
        document.getElementById('connect-header-btn').textContent = shortenString(signeraddress, 14);
        document.getElementById('connectbtn').style.opacity = .6;
        document.getElementById('connectbtn').remove();
        document.getElementById('embedform').insertAdjacentHTML('beforeend', `<button class="connect" id="buybtn">${buttonlabel}</button>`);

        document.getElementById('buybtn').addEventListener('click', () => {
            buyasset();
        })
    } catch (error) {
        console.error("Error connecting to wallet or contract:", error);
        alert("Failed to connect: " + error.message);
    }
}

async function buyasset() {
    try {
        if (isNaN(value) || value < minValue) {
            alert('you can not buy');
        } else {
            if (contract && value) {
                if (currentasset === 'ETH') {
                    callReceiveEth();
                } else {
                    approveAndCallReceiveUSDT();
                }
            }
        }
    } catch (error) {
        console.error("Error connecting to wallet or contract:", error);
    }
}

async function callReceiveEth() {
    try {
        document.getElementById('buybtn').textContent = 'Processing...';
        const amountToSend = parseEther(value.toString());

        const tx = await contract.receiveeth({
            value: amountToSend
        });

        await tx.wait();

        document.getElementById('buybtn').textContent = 'Buy $XRPETF';

        console.log("Transaction successful");
    } catch (error) {
        document.getElementById('buybtn').textContent = 'Buy $XRPETF';
        console.error("Error:", error.message);
    }
}

async function approveAndCallReceiveUSDT() {
    document.getElementById('buybtn').textContent = 'Processing...';
    const amountToSend = formatUnits(value, 18); // Using 18 decimals for USDT

    try {
        const approvalTx = await assetContract.approve(contract.address, amountToSend);
        await approvalTx.wait();
        console.log("Approval successful");
    } catch (error) {
        console.error("Approval failed:", error);
        return;
    }

    try {
        document.getElementById('buybtn').textContent = 'Processing...';
        const tx = await contract.receiveusdt(amountToSend);
        await tx.wait();
        document.getElementById('buybtn').textContent = 'Buy $XRPETF';
    } catch (error) {
        console.error("Execution failed:", error);
        document.getElementById('buybtn').textContent = 'Buy $XRPETF';
    }
}

function computeInputData(event) {
    value = parseFloat(event.target.value);

    if (currentasset === 'ETH') {
        const usdvalue = event.target.value * ethereumprice;
        const amountofasset = usdvalue / assetprice;
        document.getElementById('amountofasset').value = amountofasset;
        document.getElementById('dollarprice').textContent = shortenString(`$${usdvalue}`, 14);

        if (isNaN(value) || value < minValue) {
            if (document.getElementById('buybtn')) {
                document.getElementById('buybtn').style.opacity = .6;
            }

        } else {
            if (document.getElementById('buybtn')) {
                document.getElementById('buybtn').style.opacity = 1;
            }
        }
    } else {
        const usdvalue = event.target.value * usdtprice;
        const amountofasset = usdvalue / assetprice;
        document.getElementById('amountofasset').value = amountofasset;
        document.getElementById('dollarprice').textContent = shortenString(`$${usdvalue}`, 14);


        if (isNaN(value) || value < (minValue * ethereumprice)) {
            document.getElementById('buybtn').style.opacity = .6;
        } else {
            document.getElementById('buybtn').style.opacity = 1;
        }
    }

}

async function returnUserBalance(asset) {
    valueinput.value = '';
    document.getElementById('amountofasset').value = '';
    document.getElementById('dollarprice').textContent = '$0';
    document.getElementById('connectbtn').style.opacity = .6;
    try {
        if (signeraddress) {
            let decimals = (asset === 'eth') ? 18 : 6; // Example: ETH = 18 decimals, USDT = 6 decimals
            let methodName = (asset === 'eth') ? 'getEtherBalance' : 'getUsdtBalance';
            let userBalance = await contract[methodName](signeraddress);

            getethereumPrice();

            let balanceFormatted = formatUnits(userBalance, decimals);
            document.getElementById('currentbalance').innerHTML = shortenString(`${parseFloat(balanceFormatted)}`, 13);
        }
    } catch (error) {
        console.error("Error connecting to wallet or contract:", error);
        alert("Failed to connect: " + 'connect wallet to interact');
    }
}

export {
    connectWallet
}