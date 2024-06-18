import { contractabi, contractAddress } from './contractABIs/ContractFile';
import { assetAbi, assetAddress } from './contractABIs/USDTAssetFile';
import { Contract, formatUnits, parseEther, parseUnits } from 'ethers';
import renderForm from './renderForm';
import Big from 'big.js';

let submitvalue;
let signerGlobal;
let addressGlobal;

function shortenString(str, maxLength) {
    // Check if the current length is less than the maximum allowed length
    if (str.length <= maxLength) {
        return str;  // Return the original string if it's within the limit
    }

    // Calculate the length of each half to keep around the ellipsis
    let partLength = Math.floor((maxLength - 3) / 2); // Subtract 3 to account for the ellipsis

    // Get the first part from the beginning of the string
    let firstPart = str.substring(0, partLength);

    // Get the second part from the end of the string
    let secondPart = str.substring(str.length - partLength);

    // Return the string with the ellipsis in the middle
    return `${firstPart}...${secondPart}`;
}

function mobilewidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
        return true;
    } else {
        return false;
    }
}

function returnContract({ signer }) {
    const contract = new Contract(
        contractAddress,
        contractabi,
        signer
    );

    return contract
}

async function getethereumPrice({ value, hpltprice, signer }) {
    try {
        const contract = returnContract({ signer });
        const decimal = 8;
        const ethprice = await contract.getLatestEthPrice();

        const formated = formatUnits(`${ethprice}`, decimal);

        const etherprice = parseFloat(formated);
        const valueprice = value * etherprice;
        const hpltpriceAmt = valueprice / hpltprice;

        const amountofassetInput = document.getElementById('amountofasset');

        amountofassetInput.value = hpltpriceAmt;

        return etherprice;
    } catch (error) {
        console.log(error)
    }
}

async function getusdtPrice({ value, hpltprice, signer }) {
    try {
        const contract = returnContract({ signer });
        const decimal = 8;
        const usdtprice = await contract.getLatestUsdtPrice();

        const formated = formatUnits(`${usdtprice}`, decimal);

        const usdtpriceFloat = parseFloat(formated);

        const valueprice = value * usdtpriceFloat;
        const hpltpriceAmt = valueprice / hpltprice;

        const amountofassetInput = document.getElementById('amountofasset');

        amountofassetInput.value = hpltpriceAmt;

        return usdtpriceFloat;
    } catch (error) {
        console.log(error)
    }
}

async function computeInputData({ currentasset, value, address, signer }) {
    const val = parseFloat(value);
    const hpltprice = 0.10875;
    const connectbtn = document.getElementById('connectbtn');

    if (!address || !address.length) {
        submitvalue = null;
        return;
    }

    if (isNaN(val) || val <= 0) {
        preventsubmit();
        submitvalue = null;
        signerGlobal = null;
        return;
    }

    const contract = returnContract({ signer });
    const minEtherRequired = await contract.minEtherRequired();
    const minEtherRequiredFormated = parseFloat(formatUnits(minEtherRequired, 18));
    let userBalance;
    let balanceNum;

    switch (currentasset) {
        case 'eth':
            getethereumPrice({ value: val, hpltprice, signer });
            userBalance = await returnUserBalance({ asset: currentasset, address, decimal: 18, signer });

            balanceNum = parseFloat(userBalance);

            if (balanceNum >= val && val >= minEtherRequiredFormated) {
                allowsubmit();
                submitvalue = val;
                signerGlobal = signer;
                addressGlobal = address;
                connectbtn.addEventListener('click', submitEthTransaction)
            } else {
                submitvalue = null;
                signerGlobal = null;
                addressGlobal = null;
                preventsubmit();
            }

            break;
        case 'usdt':
            getusdtPrice({ value: val, hpltprice, signer });
            userBalance = await returnUserBalance({ asset: currentasset, address, decimal: 18, signer });

            const ethAmountForUsdt = await contract.getEthAmountForUsdt(parseUnits(`${val}`, 18));
            const ethAmountFromVal = parseFloat(formatUnits(ethAmountForUsdt[0], 18));

            balanceNum = parseFloat(userBalance);

            if (balanceNum >= val && ethAmountFromVal >= minEtherRequiredFormated) {
                allowsubmit();
                submitvalue = val;
                signerGlobal = signer;
                addressGlobal = address;
                connectbtn.addEventListener('click', submitUsdtTransaction)
            } else {
                submitvalue = null;
                signerGlobal = null;
                addressGlobal = null;
                preventsubmit();
            }
            break;
        default:
            break;
    }
}

function preventsubmit() {
    const connectbtn = document.getElementById('connectbtn');
    connectbtn.style.opacity = '0.6';
}

function allowsubmit() {
    const connectbtn = document.getElementById('connectbtn');
    connectbtn.style.opacity = '1';
}

async function submitEthTransaction() {
    if (submitvalue) {
        const connectbtn = document.getElementById('connectbtn');

        try {
            connectbtn.textContent = 'Processing...';
            const amountToSend = parseEther(submitvalue.toString());
            const contract = returnContract({ signer: signerGlobal });

            const tx = await contract.receiveeth({
                value: amountToSend
            });

            await tx.wait();

            renderForm({ address: addressGlobal, signer: signerGlobal })
        } catch (error) {
            console.error("Error:", error.message);
            renderForm({ address: addressGlobal, signer: signerGlobal })
        }
    }
}

async function submitUsdtTransaction() {
    if (submitvalue) {
        const connectbtn = document.getElementById('connectbtn');

        try {
            connectbtn.textContent = 'Processing...';
            const amountToSend = parseUnits(submitvalue.toString(), 18);
            const contract = returnContract({ signer: signerGlobal });

            const assetContract = new Contract(assetAddress, assetAbi, signerGlobal);

            const approvalTx = await assetContract.approve(contractAddress, amountToSend);
            await approvalTx.wait();

            const tx = await contract.receiveusdt(amountToSend);
            await tx.wait();
            renderForm({ address: addressGlobal, signer: signerGlobal })

        } catch (error) {
            console.error("Error:", error.message);
            renderForm({ address: addressGlobal, signer: signerGlobal })
        }
    }
}

async function returnUserBalance({ asset, address, decimal, signer }) {
    try {
        const contract = returnContract({ signer });

        let userBalance;

        const topblc = document.getElementById('topblc');
        let formated;
        let balance;

        if (asset === 'eth') {
            userBalance = await contract['getEtherBalance'](address);
            formated = formatUnits(userBalance, decimal);

            balance = `${formated} ETH`
        } else if (asset === 'usdt') {
            userBalance = await contract['getUsdtBalance'](address);
            formated = formatUnits(userBalance, decimal);

            balance = `${formated} USDT`
        }

        topblc.innerText = balance;

        return formated;
    } catch (error) {
        console.log(error);
    }
}

async function selectModalItemETH({ address, signer }) {
    preventsubmit()
    if (address.length) {
        await returnUserBalance({ asset: 'eth', address, decimal: 18, signer });
    }
}

async function selectModalItemUSDT({ address, signer }) {
    preventsubmit()
    if (address.length) {
        await returnUserBalance({ asset: 'usdt', address, decimal: 6, signer });
    }
}

export {
    shortenString,
    mobilewidth,
    getethereumPrice,
    computeInputData,
    selectModalItemETH,
    selectModalItemUSDT
}