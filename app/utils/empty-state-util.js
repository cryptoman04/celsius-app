import React from "react";
import { EMPTY_STATES } from "../constants/UI";
import { KYC_STATUSES } from "../constants/DATA";
import CelText from "../components/atoms/CelText/CelText";
import STYLES from "../constants/STYLES";

export default {
  getProps, // TODO add JSDoc
};

function getProps(purpose, componentProps) {
  if (!purpose) return {};
  const { actions } = componentProps;
  let props = {
    aboveHeadingSection: null,
    modal: null,
    modalProps: null,
    button: null,
  };
  if (
    purpose.includes("NON_VERIFIED") ||
    purpose.includes("VERIFICATION_IN_PROCESS")
  ) {
    props = getNonVerifiedProps(componentProps);
  }

  switch (purpose) {
    case EMPTY_STATES.HODL_MODE_WARNING:
      return {
        ...props,
        image: require("../../assets/images/error.png"),
        heading: "Withdrawing crypto is unavailable in HODL Mode",
        paragraphs: [
          "Your wallet is currently in HODL Mode, which means outbound transactions are currently unavailable. To make a withdrawal, please deactivate HODL Mode.",
        ],
        onPress: () => {
          actions.navigateTo("HodlLanding");
          actions.setHodlProps(false);
        },
        button: "Deactivate HODL Mode",
        secondaryOnPress: () => actions.navigateTo("WalletLanding"),
        secondaryButton: "Go back to wallet",
      };
    case EMPTY_STATES.HODL_MODE_PENDING_DEACTIVATION:
      return {
        ...props,
        image: require("../../assets/images/hodlModeStatus.png"),
        heading: "HODL Mode is active!",
        paragraphs: [
          `Your account is currently in HODL Mode, which means all outgoing functionalities are currently unavailable. This includes withdrawing funds, sending funds via CelPay, and changing whitelisted withdrawal addresses. These will be available once HODL Mode deactivation wait period is over.`,
        ],
        secondaryOnPress: () => actions.navigateTo("WalletLanding"),
        secondaryButton: "Go back to wallet",
      };
    case EMPTY_STATES.HODL_MODE_BACKOFFICE:
      return {
        ...props,
        image: require("../../assets/images/hodlModeStatus.png"),
        heading: "HODL Mode is active!",
        paragraphs: [
          <CelText>
            Your account was set to HODL Mode by our team, which means all
            outgoing functionalities are currently unavailable. This includes
            withdrawing funds, sending funds via CelPay, and changing
            whitelisted withdrawal addresses. If you would like to deactivate
            HODL Mode please{" "}
            <CelText
              color={STYLES.COLORS.CELSIUS_BLUE}
              onPress={() => actions.navigateTo("Support")}
            >
              contact our support team
            </CelText>
            .
          </CelText>,
        ],
        secondaryOnPress: () => actions.navigateTo("WalletLanding"),
        secondaryButton: "Go back to wallet",
      };
    case EMPTY_STATES.HODL_MODE_ACTIVE:
      return {
        ...props,
        image: require("../../assets/images/hodlModeStatus.png"),
        heading: "HODL Mode is active!",
        paragraphs: [
          "Your account is currently in HODL Mode, which means all outgoing functionalities are currently unavailable. This includes withdrawing funds, sending funds via CelPay, and changing whitelisted withdrawal addresses. Use the button below to start the deactivation process and exit HODL Mode.",
        ],
        onPress: () => {
          actions.navigateTo("HodlLanding");
          actions.setHodlProps(false);
        },
        button: "Deactivate HODL Mode",
        secondaryOnPress: () => actions.navigateTo("WalletLanding"),
        secondaryButton: "Go back to wallet",
      };
    case EMPTY_STATES.CHECK_YOUR_EMAIL:
      return {
        ...props,
        image: require("../../assets/images/checkEmail.png"),
        heading: "Check your Email!",
        paragraphs: [
          "To complete HODL Mode activation, please follow the instructions\n" +
            "sent to you via email.",
        ],
        onPress: () => actions.navigateTo("WalletLanding"),
        button: "Go to wallet",
      };
    case EMPTY_STATES.NO_LOANS:
      return {
        ...props,
        heading: "Borrow Cash Instantly",
        paragraphs: [
          "Get a USD or stablecoin loan at the best interest rates on the block!",
        ],
        onPress: () => actions.navigateTo("BorrowChooseLoan"),
        button: "Get Cash",
        secondaryOnPress: () => actions.navigateTo("BorrowCalculatorScreen"),
        secondaryButton: "Calculate Loan Interest",
      };

    // Not KYC Verified Empty States
    case EMPTY_STATES.NON_VERIFIED_WITHDRAW:
      return {
        ...props,
        heading: "Withdraw",
        paragraphs: [
          "Withdraw pain (and fee!) free with Celsius Network. Complete your KYC verification to take full advantage.",
        ],
        onPress: () => actions.navigateTo("KYCProfileDetails"),
      };

    case EMPTY_STATES.VERIFICATION_IN_PROCESS_WITHDRAW:
      return {
        ...props,
        paragraphs: ["Withdraw will be available upon identity verification."],
        button: "Back to wallet",
        onPress: () => actions.navigateTo("WalletLanding"),
      };

    case EMPTY_STATES.MAINTENANCE:
      return {
        ...props,
        heading: "Be back soon!",
        paragraphs: [
          "Celsius is currently down for maintenance. We expect to be back in a couple of hours. Thanks for your patience.",
        ],
      };

    case EMPTY_STATES.NON_VERIFIED_CELPAY:
      return {
        ...props,
        heading: "Send crypto to your friends",
        paragraphs: [
          "Quickly, easily and with no fees or keys required. All you have to do is become a Celsius member by verifying your profile.",
        ],
        onPress: () => actions.navigateTo("KYCProfileDetails"),
      };

    case EMPTY_STATES.VERIFICATION_IN_PROCESS_CELPAY:
      return {
        ...props,
        paragraphs: ["CelPay will be available upon identity verification."],
        button: "Back to wallet",
        onPress: () => actions.navigateTo("WalletLanding"),
      };

    case EMPTY_STATES.NON_VERIFIED_DEPOSIT:
      return {
        ...props,
        heading: "Start earning interest",
        paragraphs: [
          "Start earning 7% a year on your coin. All you have to do is become a Celsius member by verifying your profile.",
        ],
        onPress: () => actions.navigateTo("KYCProfileDetails"),
      };

    case EMPTY_STATES.VERIFICATION_IN_PROCESS_DEPOSIT:
      return {
        ...props,
        paragraphs: ["Deposits will be available upon identity verification."],
        button: "Back to wallet",
        onPress: () => actions.navigateTo("WalletLanding"),
      };

    case EMPTY_STATES.NON_MEMBER_CELPAY:
      return {
        ...props,
        heading: "Send crypto to your friends",
        paragraphs: [
          "Quickly, easily and with no fees or keys required. All you have to do is become a Celsius member by adding some CEL to your wallet",
        ],
        button: "Deposit CEL",
        onPress: () => actions.navigateTo("Deposit", { coin: "CEL" }),
      };

    case EMPTY_STATES.NO_WITHDRAWAL_ADDRESSES:
      return {
        ...props,
        heading: "You have no withdrawal addresses set yet!",
        paragraphs: [],
        button: "Back to settings",
        onPress: () => actions.navigateTo("WalletSettings"),
      };

    case EMPTY_STATES.COMPLIANCE:
      return {
        ...props,
        heading: "Sorry!",
        paragraphs: [
          "We apologize for any inconvenience, but due to local laws and regulations, we are unable to work with users from your region.",
        ],
      };

    case EMPTY_STATES.SIMPLEX_COMPLIANCE:
      return {
        ...props,
        heading: "We are sorry!",
        paragraphs: [
          "We apologize for any inconvenience, but due to local laws and regulations, our Buy Coins service is not available to users in your region.",
        ],
      };

    case EMPTY_STATES.INSUFFICIENT_FUNDS:
      return {
        ...props,
        heading: "Insufficient funds!",
        paragraphs: [
          "Please deposit more funds in order to gain eligibility to use this feature.",
        ],
      };

    case EMPTY_STATES.NO_CONTACTS:
      return {
        ...props,
        heading: "No friends",
        paragraphs: [
          "None of your friends has installed Celsius app. You can still CelPay them with a link",
        ],
        button: "Send link",
        onPress: () => actions.navigateTo("CelPayEnterAmount"),
      };

    case EMPTY_STATES.NO_TRANSACTIONS:
      return {
        ...props,
        heading: "Sorry",
        paragraphs: ["No transactions in your wallet"],
      };

    case EMPTY_STATES.NON_VERIFIED_GET_COINS:
      return {
        ...props,
        heading: "Buy Crypto with Credit Card",
        paragraphs: [
          "You can directly purchase cryptocurrency with credit card on Celsius. We offer the best route to buy crypto using credit card.",
          "All you have to do is become a Celsius member by verifying your profile.",
        ],
        button: "Verify profile",
        onPress: () => actions.navigateTo("KYCProfileDetails"),
      };

    case EMPTY_STATES.VERIFICATION_IN_PROCESS_GET_COINS:
      return {
        ...props,
        heading: "Buy Crypto with Credit Card",
        paragraphs: [
          "You can directly purchase cryptocurrency with credit card on Celsius. This option will be available upon identity verification.",
        ],
        button: "Back to wallet",
        onPress: () => actions.navigateTo("WalletLanding"),
      };

    // TODO: remove, used only on Support screen
    case EMPTY_STATES.USER_CLEARED:
      return {
        ...props,
        heading: "Great job!",
        paragraphs: ["Ready to start exploring Celsius"],
        button: "Go Home",
        onPress: () => actions.navigateTo("Home"),
      };

    default:
      return {
        ...props,
        heading: "Sorry",
        paragraphs: ["No data"],
      };
  }
}

function getNonVerifiedProps(componentProps) {
  const { user } = componentProps;

  if (!user.kyc) return {};

  const kycRejectionReasons = user.kyc.rejectionReasons;
  if (kycRejectionReasons && !kycRejectionReasons.length) {
    kycRejectionReasons.push(
      "Please go through the verification process again or contact our support for help."
    );
  }

  const kycStatus = user.kyc.status;
  const isRejected = [KYC_STATUSES.rejeceted, KYC_STATUSES.rejected].includes(
    kycStatus
  );
  const isPending = [KYC_STATUSES.pending].includes(kycStatus);

  let aboveHeadingSection = isRejected ? "kyc-rejected" : null;
  aboveHeadingSection = isPending ? "kyc-pending" : aboveHeadingSection;

  const button = !isPending ? "Verify profile" : null;

  return {
    aboveHeadingSection,
    button,
  };
}
