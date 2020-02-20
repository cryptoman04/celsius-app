import store from "../redux/store";
import * as actions from "../redux/actions";

export default {
  isLosingMembership, // TODO check if it still works?
  isLosingTier, // TODO check if it still works?
  refetchMembershipIfChanged, // TODO maybe move to an action?
};

/**
 * Check if the user will lose Celsius membership
 *
 * @param {String} coin - eg. BTC|ETH|CEL
 * @param {number} newBalance
 * @returns {boolean}
 */
function isLosingMembership(coin, newBalance) {
  if (coin !== "CEL") return false;

  const { celsius_member: isCelsiusMember } = store.getState().user.profile;
  return isCelsiusMember && Number(newBalance) < 1;
}

/**
 * Check if the user will lose his current loyalty tier level
 *
 * @param {String} coin
 * @param {String} newBalance - new coin balance after transaction
 * @returns {boolean}
 */
function isLosingTier(coin, newBalance) {
  if (coin !== "CEL") return false;

  const { min_for_tier: minForTier, tier } = store.getState().user.loyaltyInfo;

  const celRatio = calculateCelRatio(newBalance);
  return celRatio < minForTier && tier.title !== "SILVER";
}

/**
 * Refetch cel membership flag if the cel summary balance is changed and it is lower than 1
 *
 * @param {String} coin
 */
async function refetchMembershipIfChanged(coin) {
  await store.dispatch(actions.getWalletSummary());
  if (coin === "CEL") {
    const { summary } = store.getState().wallet;
    const coinData = summary.coins.find(c => c.short === "CEL");
    if (Number(coinData.amount) < 1) {
      await store.dispatch(actions.getProfileInfo());
    }
  }
}

/**
 * Gets CEL ratio
 *
 * @param {Number} newCelBalance - celsius balance after a transaction
 * @returns {Boolean}
 */
function calculateCelRatio(newCelBalance) {
  const walletSummary = store.getState().wallet.summary;
  const celRate = store.getState().currencies.currencyRatesShort.cel;

  const celBalance =
    newCelBalance * celRate ||
    walletSummary.coins.find(c => c.short === "CEL").amount_usd;
  const otherCoinsBalance =
    walletSummary.total_amount_usd -
    walletSummary.coins.find(c => c.short === "CEL").amount_usd;
  const celRatio = otherCoinsBalance ? celBalance / otherCoinsBalance : 1;

  return celRatio;
}
