import renderForm from './renderForm';
import modal from './walletconnect';
import handleChange from './handleChange';

const initializeWidget = ({ address, signer }) => {
    renderForm({ address, signer });

    const connectbtns = document.querySelectorAll('.connectbtns');

    connectbtns.forEach(connectbtn => {
        connectbtn.addEventListener('click', () => modal.open());
    });

    const showuseraddress = document.querySelectorAll('.showuseraddress');
    showuseraddress.forEach(showaddress => {
        showaddress.textContent = 'Connect Wallet';
    });

    const connectbtn = document.getElementById('connectbtn');
    connectbtn.textContent = 'Connect Wallet';
    connectbtn.style.opacity = '1'

    modal.subscribeProvider(handleChange);
}

export default initializeWidget;