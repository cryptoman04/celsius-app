import { sendEvent } from "../mixpanel-util";

const buyCoinsAnalytics = {
  navigatedToBuyCoins,
  choseBuyCoinsType,
  enteredBuyCoinsAmount,
  initiatedBuyCoinsRequest,
  finishedSimplexFlow,
};

/**
 * Fires when user navigates to BuyCoinsLanding screen
 *
 * @param {string} from - screen from which user navigated to BuyCoinsLanding
 */
function navigatedToBuyCoins(from) {
  sendEvent("Navigated to Buy Coins", { from });
}

/**
 * Fires when user chooses type of BuyCoins flow
 *
 * @param {string} type - CARD|WIRE
 */
function choseBuyCoinsType(type) {
  sendEvent("Chose BuyCoins Type", { buyCoinsType: type });
}

/**
 * Fires when user presses Buy button on BuyCoinsEnterAmount
 *
 * @param {string} buyCoinsType - CARD|WIRE
 * @param {string} cryptoCoin - BTC|ETH
 * @param {string} fiatCoin - USD
 * @param {number} amountUsd
 * @param {number} amountFiat
 * @param {number} amountCrypto
 */
function enteredBuyCoinsAmount(
  buyCoinsType,
  cryptoCoin,
  fiatCoin,
  amountUsd,
  amountFiat,
  amountCrypto
) {
  sendEvent("Entered Buy Coins Coin & Amount", {
    buyCoinsType,
    cryptoCoin,
    fiatCoin,
    amountUsd,
    amountFiat,
    amountCrypto,
  });
}

/**
 * Fires when user confirms a Buy Coins request
 *
 * @param {string} buyCoinsType - CARD|WIRE
 * @param {string} cryptoCoin - BTC|ETH
 * @param {string} fiatCoin - USD
 * @param {number} amountUsd
 * @param {number} amountFiat
 * @param {number} amountCrypto
 */
function initiatedBuyCoinsRequest(
  buyCoinsType,
  cryptoCoin,
  fiatCoin,
  amountUsd,
  amountFiat,
  amountCrypto
) {
  sendEvent("Confirmed Buy Coins Request", {
    buyCoinsType,
    cryptoCoin,
    fiatCoin,
    amountUsd,
    amountFiat,
    amountCrypto,
  });
}

/**
 * Fires when user finishes Simplex flow in the app
 *
 * @param {string} buyCoinsType - CARD|WIRE
 * @param {string} cryptoCoin - BTC|ETH
 * @param {string} fiatCoin - USD
 * @param {number} amountUsd
 * @param {number} amountFiat
 * @param {number} amountCrypto
 * @param {string} status - success|fail
 */
function finishedSimplexFlow(
  buyCoinsType,
  cryptoCoin,
  fiatCoin,
  amountUsd,
  amountFiat,
  amountCrypto,
  status
) {
  sendEvent("Finished Buy Coins Simplex Flow", {
    buyCoinsType,
    cryptoCoin,
    fiatCoin,
    amountUsd,
    amountFiat,
    amountCrypto,
    status,
  });
}

export default buyCoinsAnalytics;
