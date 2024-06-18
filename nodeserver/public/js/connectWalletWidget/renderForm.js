import renderAssetInput from './renderAssetInput';
import assetMetadataArray from './assets';
import { shortenString, computeInputData, selectModalItemETH, selectModalItemUSDT } from './utils';

let buttonlabel = '';

const returnbutton = () => {
    return `<button class="connect connectbtns" id="connectbtn">${buttonlabel}</button>`
}

const returninputarrow = () => {
    return `
    <div class="input__box">
        <div class="input__arrow">
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </span>
        </div>
    </div>
    `
}

const returnuseraddress = (address) => {
    return address.length ?
        `<div class="embedform__useraddress" id="useraddr">${shortenString(address, 20)}</div>` :
        `<div class="embedform__useraddress" id="useraddr">Connect to interact</div>`;
}

const renderForm = ({ address, signer }) => {
    const embed = document.getElementById("embed");

    embed.innerHTML = '';

    const form = `
        <div class="embedform" id="embedform">
            ${returnuseraddress(address)}
            ${renderAssetInput({ ticker: 'ETH', buttonlogo: 'https://token-icons.s3.amazonaws.com/eth.png', role: 'You pay', dropdown: 'true' })}
            ${returninputarrow()}
            ${renderAssetInput({ ticker: 'XRPETF', buttonlogo: 'H', role: 'You receive' })}
            ${returnbutton()}
        </div>
    `;

    embed.insertAdjacentHTML('beforeend', form);

    const valueinput = document.getElementById('valueinput');
    const drdowntrigger = document.getElementById('drdowntrigger');
    const drdownmodal = document.getElementById('drdownmodal');
    let currentasset = 'eth';

    const inputmodalitems = document.querySelectorAll('.input__modal--item');

    valueinput.addEventListener('input', (event) => {
        const value = event.target.value;
        computeInputData({ currentasset, value, address, signer })
    });

    drdowntrigger.addEventListener('click', () => {
        drdownmodal.style.display = 'flex';
    });

    selectModalItemETH({ address, signer });

    const connectbtn = document.getElementById('connectbtn');
    connectbtn.textContent = 'Buy XRPETF';
    connectbtn.style.opacity = '0.6'

    inputmodalitems.forEach(function (inputmodalitem) {

        inputmodalitem.addEventListener('click', (event) => {
            const assetsymbol = inputmodalitem.classList[1];
            currentasset = assetsymbol;
            selectAssetInModal({ assetsymbol, address, signer })
        });
    });
}

function selectAssetInModal({ assetsymbol, address, signer }) {
    const drdownmodal = document.getElementById('drdownmodal');

    assetsymbol === 'eth' ? selectModalItemETH({ address, signer }) : selectModalItemUSDT({ address, signer });
    drdownmodal.style.display = 'none';

    const inputs = document.querySelectorAll('.input__input');
    inputs.forEach(inpt => inpt.value = '');

    const assetMetadata = assetMetadataArray.find(assetMeta => assetMeta.symbol === assetsymbol);
    document.getElementById('ticker').innerText = assetMetadata.symbol.toUpperCase();
    document.getElementById('tickerimg').src = assetMetadata.image;
}


export default renderForm;