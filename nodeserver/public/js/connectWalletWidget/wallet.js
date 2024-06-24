//const { ethers } = window;
import { formatUnits, parseEther } from 'ethers'

let contract;
let signeraddress;
//let signer;
let value;
let assetContract;
let currentasset = 'ETH';

const assetprice = 0.10875;
const minValue = 0.02;

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
                "internalType": "int256",
                "name": "_usdtAmount",
                "type": "int256"
            }
        ],
        "name": "getEthAmountForUsdt",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
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
        "inputs": [],
        "name": "getLatestEthPrice",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLatestUsdtPrice",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
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
        "name": "minEtherRequired",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newMinEther",
                "type": "uint256"
            }
        ],
        "name": "updateMinEtherRequired",
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

const assetAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_upgradedAddress","type":"address"}],"name":"deprecate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"deprecated","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_evilUser","type":"address"}],"name":"addBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"upgradedAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maximumFee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_maker","type":"address"}],"name":"getBlackListStatus","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newBasisPoints","type":"uint256"},{"name":"newMaxFee","type":"uint256"}],"name":"setParams","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"basisPointsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isBlackListed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_clearedUser","type":"address"}],"name":"removeBlackList","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_UINT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_blackListedUser","type":"address"}],"name":"destroyBlackFunds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_initialSupply","type":"uint256"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAddress","type":"address"}],"name":"Deprecate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"feeBasisPoints","type":"uint256"},{"indexed":false,"name":"maxFee","type":"uint256"}],"name":"Params","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_blackListedUser","type":"address"},{"indexed":false,"name":"_balance","type":"uint256"}],"name":"DestroyedBlackFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"AddedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_user","type":"address"}],"name":"RemovedBlackList","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"}];

const assetAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

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
            "0x3B5af710DE7cE11C453533910a94358479067728",
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