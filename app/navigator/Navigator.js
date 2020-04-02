import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { INITIAL_ROUTE } from "../constants/UI";
import { transitionConfig } from "./navigationConfig";

import Storybook from "../components/screens/Storybook/Storybook";

import Home from "../components/screens/Home/Home";
import Community from "../components/screens/Community/Community";
import Maintenance from "../components/screens/Maintenance/Maintenance";
import LockedAccount from "../components/screens/LockedAccount/LockedAccount";
import Login from "../components/screens/Login/Login";
import ForgotPassword from "../components/screens/ForgotPassword/ForgotPassword";
import RegisterInitial from "../components/screens/RegisterInitial/RegisterInitial";
import RegisterSetPin from "../components/screens/RegisterSetPin/RegisterSetPin";
import TermsOfUse from "../components/screens/TermsOfUse/TermsOfUse";
import Welcome from "../components/screens/Welcome/Welcome";
import VerifyProfile from "../components/screens/VerifyProfile/VerifyProfile";
import TransactionsOnHold from "../components/screens/TransactionsOnHold/TransactionsOnHold";
import KYCProfileDetails from "../components/screens/KYCProfileDetails/KYCProfileDetails";
import KYCAddressInfo from "../components/screens/KYCAddressInfo/KYCAddressInfo";
import KYCTaxpayer from "../components/screens/KYCTaxpayer/KYCTaxpayer";
import KYCVerifyIdentity from "../components/screens/KYCVerifyIdentity/KYCVerifyIdentity";
import KYCAddressProof from "../components/screens/KYCAddressProof/KYCAddressProof";
import KYCCheckPhotos from "../components/screens/KYCCheckPhotos/KYCCheckPhotos";
import KYCPrimeTrustToU from "../components/screens/KYCPrimeTrustToU/KYCPrimeTrustToU";
import KYCFinalRejection from "../components/screens/KYCFinalRejection/KYCFinalRejection";
import WalletLanding from "../components/screens/WalletLanding/WalletLanding";
import WalletInterest from "../components/screens/WalletInterest/WalletInterest";
import BalanceHistory from "../components/screens/BalanceHistory/BalanceHistory";
import CoinDetails from "../components/screens/CoinDetails/CoinDetails";
import AllTransactions from "../components/screens/AllTransactions/AllTransactions";
import GetCoinsLanding from "../components/screens/GetCoinsLanding/GetCoinsLanding";
import GetCoinsEnterAmount from "../components/screens/GetCoinsEnterAmount/GetCoinsEnterAmount";
import GetCoinsTransactionDetails from "../components/screens/GetCoinsTransactionDetails/GetCoinsTransactionDetails";
import MyCel from "../components/screens/MyCel/MyCel";
import Simplex from "../components/screens/Simplex/SimplexScreen";
import InterestCalculatorScreen from "../components/screens/InterestCalculatorScreen/InterestCalculatorScreen";
import InterestRates from "../components/screens/InterestRates/InterestRates";
import Deposit from "../components/screens/Deposit/Deposit";
import SelectCoin from "../components/screens/SelectCoin/SelectCoin";
import BorrowEnterAmount from "../components/screens/BorrowEnterAmount/BorrowEnterAmount";
import BorrowCollateral from "../components/screens/BorrowCollateral/BorrowCollateral";
import BorrowLoanOption from "../components/screens/BorrowLoanOption/BorrowLoanOption";
import BorrowLoanTerm from "../components/screens/BorrowLoanTerm/BorrowLoanTerm";
import BorrowBankAccount from "../components/screens/BorrowBankAccount/BorrowBankAccount";
import ConfirmYourLoan from "../components/screens/ConfirmYourLoan/ConfirmYourLoan";
import BorrowLanding from "../components/screens/BorrowLanding/BorrowLanding";
import ChoosePaymentMethod from "../components/screens/ChoosePaymentMethod/ChoosePaymentMethod";
import ChooseMarginCollateralCoin from "../components/screens/ChooseMarginCollateralCoin/ChooseMarginCollateralCoin";
import PaymentCel from "../components/screens/PaymentCel/PaymentCel";
import LoanPrepaymentPeriod from "../components/screens/LoanPrepaymentPeriod/LoanPrepaymentPeriod";
import LoanPaymentList from "../components/screens/LoanPaymentList/LoanPaymentList";
import LoanPaymentCoin from "../components/screens/LoanPaymentCoin/LoanPaymentCoin";
import WiringBankInformation from "../components/screens/WiringBankInformation/WiringBankInformation";
import LoanRequestDetails from "../components/screens/LoanRequestDetails/LoanRequestDetails";
import LoanPaymentHistory from "../components/screens/LoanPaymentHistory/LoanPaymentHistory";
import LoanSettings from "../components/screens/LoanSettings/LoanSettings";
import PrincipalPayment from "../components/screens/PrincipalPayment/PrincipalPayment";
import PrincipalPaymentType from "../components/screens/PrincipalPaymentType/PrincipalPaymentType";
import LoanTermsOfUse from "../components/screens/LoanTermsOfUse/LoanTermsOfUse";
import InterestPaymentSettings from "../components/screens/InterestPaymentSettings/InterestPaymentSettings";
import BorrowChooseLoan from "../components/screens/BorrowChooseLoan/BorrowChooseLoan";
import BorrowCalculatorScreen from "../components/screens/BorrowCalculatorScreen/BorrowCalculatorScreen";
import CelPayLanding from "../components/screens/CelPayLanding/CelPayLanding";
import CelPayChooseFriend from "../components/screens/CelPayChooseFriend/CelPayChooseFriend";
import CelPayEnterAmount from "../components/screens/CelPayEnterAmount/CelPayEnterAmount";
import CelPayMessage from "../components/screens/CelPayMessage/CelPayMessage";
import Profile from "../components/screens/Profile/Profile";
import NotificationsSettings from "../components/screens/NotificationsSettings/NotificationsSettings";
import SecuritySettings from "../components/screens/SecuritySettings/SecuritySettings";
import SecurityOverview from "../components/screens/SecurityOverview/SecurityOverview";
import WalletSettings from "../components/screens/WalletSettings/WalletSettings";
import ApiAuthorization from "../components/screens/ApiAuthorization/ApiAuthorization";
import ApiAuthorizationPermissions from "../components/screens/ApiAuthorizationPermissions/ApiAuthorizationPermissions";
import Appearance from "../components/screens/Appearance/Appearance";
import ChangePassword from "../components/screens/ChangePassword/ChangePassword";
import ChangePin from "../components/screens/ChangePin/ChangePin";
import TwoFactorSettings from "../components/screens/TwoFactorSettings/TwoFactorSettings";
import TwoFaAuthAppConfirmationCode from "../components/screens/TwoFaAuthAppConfirmationCode/TwoFaAuthAppConfirmationCode";
import ChangeAvatar from "../components/screens/ChangeAvatar/ChangeAvatar";
import CameraScreen from "../components/screens/CameraScreen/CameraScreen";
import ConfirmCamera from "../components/screens/ConfirmCamera/ConfirmCamera";
import LoyaltyProgram from "../components/screens/LoyaltyProgram/LoyaltyProgram";
import CellphoneEnter from "../components/screens/CellphoneEnter/CellphoneEnter";
import CellphoneVerify from "../components/screens/CellphoneVerify/CellphoneVerify";
import SelectCountry from "../components/screens/SelectCountry/SelectCountry";
import SelectState from "../components/screens/SelectState/SelectState";
import WithdrawNewAddressSetup from "../components/screens/WithdrawNewAddressSetup/WithdrawNewAddressSetup";
import WithdrawAddressOverview from "../components/screens/WithdrawAddressOverview/WithdrawAddressOverview";
import WithdrawAddressLabel from "../components/screens/WithdrawAddressLabel/WithdrawAddressLabel";
import PersonalInformation from "../components/screens/PersonalInformation/PersonalInformation";
import Support from "../components/screens/Support/Support";
import WithdrawEnterAmount from "../components/screens/WithdrawEnterAmount/WithdrawEnterAmount";
import WithdrawConfirmAddress from "../components/screens/WithdrawConfirmAddress/WithdrawConfirmAddress";
import WithdrawCreateAddress from "../components/screens/WithdrawCreateAddress/WithdrawCreateAddress";
import QRScanner from "../components/screens/QRScanner/QRScanner";
import HODLInfoCheckboxes from "../components/screens/HODLInfoCheckboxes/HODLInfoCheckboxes";
import HodlLanding from "../components/screens/HodlLanding/HodlLanding";
import HODLViewCode from "../components/screens/HODLViewCode/HODLViewCode";
import HodlDeactivationCode from "../components/screens/HodlDeactivationCode/HodlDeactivationCode";
import TransactionsIntersection from "../components/screens/TransactionsIntersection/TransactionsIntersection";
import CelHeading from "../components/organisms/CelHeading/CelHeading";
import WithdrawConfirm from "../components/screens/WithdrawConfirm/WithdrawConfirm";

export const screens = {
  /**
   * Out of limit
   */

  Home,
  Maintenance,
  LockedAccount,
  Storybook,

  /**
   * Onboarding
   */

  Welcome,
  Login,
  ForgotPassword,
  RegisterInitial,
  RegisterSetPin,
  TermsOfUse,

  /**
   * KYC
   */

  KYCProfileDetails,
  KYCAddressInfo,
  KYCTaxpayer,
  KYCVerifyIdentity,
  KYCAddressProof,
  KYCCheckPhotos,
  KYCPrimeTrustToU,
  KYCFinalRejection,

  VerifyProfile,

  /**
   * Wallet
   */

  WalletLanding,
  WithdrawConfirm,
  TransactionsOnHold,
  WalletInterest,
  BalanceHistory,
  CoinDetails,
  AllTransactions,
  TransactionsIntersection,

  /**
   * Community
   */

  Community,

  /**
   * Simplex
   */

  GetCoinsLanding,
  GetCoinsEnterAmount,
  GetCoinsTransactionDetails,
  Simplex,

  /**
   * Borrow
   */

  InterestCalculatorScreen,
  InterestRates,
  SelectCoin,
  BorrowEnterAmount,
  BorrowCollateral,
  BorrowLoanOption,
  BorrowLoanTerm,
  BorrowBankAccount,
  ConfirmYourLoan,
  BorrowLanding,
  ChoosePaymentMethod,
  ChooseMarginCollateralCoin,
  PaymentCel,
  LoanPrepaymentPeriod,
  LoanPaymentList,
  LoanPaymentCoin,
  WiringBankInformation,
  LoanRequestDetails,
  LoanPaymentHistory,
  LoanSettings,
  PrincipalPayment,
  PrincipalPaymentType,
  LoanTermsOfUse,
  InterestPaymentSettings,
  BorrowChooseLoan,
  BorrowCalculatorScreen,

  /**
   * MyCel
   */

  MyCel,
  LoyaltyProgram,

  /**
   *  Deposit
   */

  Deposit,
  QRScanner,

  /**
   * Celpay
   */

  CelPayLanding,
  CelPayChooseFriend,
  CelPayEnterAmount,
  CelPayMessage,

  /**
   * Profile
   */

  Profile,
  ChangeAvatar,
  CellphoneEnter,
  CellphoneVerify,
  SelectCountry,
  SelectState,
  PersonalInformation,

  /**
   * Settings
   */

  NotificationsSettings,
  SecuritySettings,
  SecurityOverview,
  WalletSettings,
  ApiAuthorization,
  ApiAuthorizationPermissions,
  Appearance,
  ChangePassword,
  ChangePin,
  TwoFactorSettings,
  TwoFaAuthAppConfirmationCode,
  HODLViewCode,
  HodlLanding,
  HODLInfoCheckboxes,
  HodlDeactivationCode,

  /**
   * Camera
   */

  CameraScreen,
  ConfirmCamera,

  /**
   * Withdraw
   */

  WithdrawEnterAmount,
  WithdrawNewAddressSetup,
  WithdrawAddressOverview,
  WithdrawAddressLabel,
  WithdrawCreateAddress,
  WithdrawConfirmAddress,

  Support,
};

const navigatorProps = {
  initialRouteName: INITIAL_ROUTE,
  transitionConfig,
  defaultNavigationOptions: {
    header: props => <CelHeading {...props} />,
  },
};

const AppNavigator = createStackNavigator(screens, navigatorProps);

export default createAppContainer(AppNavigator);
