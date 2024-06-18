import { BrowserProvider, Contract, formatUnits } from 'ethers';

import { shortenString } from './utils';

import renderForm from './renderForm';
import initializeWidget from './initializeWidget';

async function handleChange({ provider, providerType, address, error, chainId, isConnected }) {

    if (isConnected && address) {
        const ethersProvider = new BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        renderForm({ address, signer });

        const showuseraddress = document.querySelectorAll('.showuseraddress');
        showuseraddress.forEach(showaddress => {
            showaddress.textContent = shortenString(address, 14);
        });
    } else {
        initializeWidget({ address: '', signer: null });
    }
};

export default handleChange;