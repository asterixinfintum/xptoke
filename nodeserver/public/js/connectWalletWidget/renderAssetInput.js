const returnbuttonlogo = (buttonlogo) => {
    return buttonlogo.includes('http') ?
        `<img src="${buttonlogo}" id="tickerimg"/>` :
        `<span class="token-symbol">H</span>`
}

const returndropdown = (dropdown) => {
    return dropdown ?
        `<span class="flex-align">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="SwapCurrencyInputPanel__StyledDropDown-sc-bc2530e8-8 fsTYVk"><path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path></svg>
        </span>` : ''
}

const returninput = ({ ticker, buttonlogo, role, dropdown }) => {
    const inputtemp = `
        <div class="input">
            <div class="input__top">
                <span class="input__inputrole">${role}</span>
            </div>
            <div class="input__bottom">
                <input class="input__input" id="${role === 'You pay' ? 'valueinput' : 'amountofasset'}" inputmode="decimal" autocomplete="off" autocorrect="off" type="number" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0.00" minlength="1" maxlength="79" spellcheck="false" min="0.02" step="0.01" value="" required ${role === 'You pay' ? '' : 'disabled'}/>
                <div class="input__buttonbody">
                    <button class="input__button" id="${role === 'You pay' ? 'drdowntrigger' : ''}">
                        <span class="input__button--logo flex-align">
                            ${returnbuttonlogo(buttonlogo)}
                        </span>
                        <span class="input__inputname flex-align" id="ticker">${ticker}</span>
                        ${returndropdown(dropdown)}
                    </button>

                    <div class="input__modal" id="${role === 'You pay' ? 'drdownmodal' : ''}">
                        <div class="input__modal--item eth">
                            <span class="input__button--logo flex-align input__modal--itemlogo">
                                <img src="https://token-icons.s3.amazonaws.com/eth.png"/>
                            </span>
                            <span>ETH</span>
                        </div>
                        <div class="input__modal--item usdt">
                            <span class="input__button--logo flex-align input__modal--itemlogo">
                                <img src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"/>
                            </span>
                            <span>USDT</span>
                        </div>
                    </div>
                </div>

                <div class="input__assetbalance">
                    <span>Balance:</span>
                    <span id="${role === 'You pay' ? 'topblc' : 'bottomblc'}">0</span>
                </div>
            </div>
        </div>
    `;

    return inputtemp;
}

export default returninput;