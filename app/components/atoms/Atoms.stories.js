import React from "react";
import { Provider } from "react-redux";
import { storiesOf } from "@storybook/react-native/dist";
import store from "../../redux/store";
import CenterView from "../../../storybook/stories/CenterView";
import CelTextStories from "./CelText/CelText.stories";
import CelButtonStories from "./CelButton/CelButton.stories";
import BadgeStories from "./Badge/Badge.stories";
import BadgeSelectorStories from "./BadgeSelector/BadgeSelector.stories";
import BalanceViewStories from "./BalanceView/BalanceView.stories";
import CardStories from "./Card/Card.stories";
import CelCheckboxStories from "./CelCheckbox/CelCheckbox.stories";
import CelModalButtonStories from "./CelModalButton/CelModalButton.stories";
import CelSwitchStories from "./CelSwitch/CelSwitch.stories";
import CircleButtonStories from "./CircleButton/CircleButton.stories";
import CoinIconStories from "./CoinIcon/CoinIcon.stories";
import CoinSwitchStories from "./CoinSwitch/CoinSwitch.stories";
import ContactRowStories from "./ContactRow/ContactRow.stories";
import ContactSupportStories from "./ContactSupport/ContactSupport.stories";
import DotsBarStories from "./DotsBar/DotsBar.stories";
import EmptyStateStories from "./EmptyState/EmptyState.stories";
import HeadingProgressBarStories from "./HeadingProgressBar/HeadingProgressBar.stories";
import HiddenFieldStories from "./HiddenField/HiddenField.stories";
import HorizontalSliderStories from "./HorizontalSlider/HorizontalSlider.stories";
import IconStories from "./Icon/Icon.stories";
import InfoBoxStories from "./InfoBox/InfoBox.stories";
import LoaderStories from "./Loader/Loader.stories";
import LoadingStateStories from "./LoadingState/LoadingState.stories";
import MissingInfoCardStories from "./MissingInfoCard/MissingInfoCard.stories";
import OfflineModeStories from "./OfflineMode/OfflineMode.stories";
import PaymentListItemStories from "./PaymentListItem/PaymentListItem.stories";
import ProgressBarStories from "./ProgressBar/ProgressBar.stories";
import SecurityStrengthMeter from "./SecurityStrengthMeter/SecurityStrengthMeter.stories";
import SecurityScoreGauge from "./SecurityScoreGauge/SecurityScoreGauge.stories";
import HodlBannerStories from "./HodlBanner/HodlBanner.stories";
import PassMeterTooltipStories from "./PassMeterTooltip/PassMeterTooltip.stories";
import PassStrengthMeterStories from "./PassStrengthMeter/PassStrengthMeter.stories";
// NOTE(fj): plop componentGen importing new stories here

storiesOf("Atoms", module)
  .addDecorator(getStory => (
    <Provider store={store}>
      <CenterView>{getStory()}</CenterView>
    </Provider>
  ))
  .add("CelText", CelTextStories)
  .add("CelButton", CelButtonStories)
  .add("Badge", BadgeStories)
  .add("BadgeSelector", BadgeSelectorStories)
  .add("BalanceView", BalanceViewStories)
  .add("Card", CardStories)
  .add("CelCheckbox", CelCheckboxStories)
  .add("CelModalButton", CelModalButtonStories)
  .add("CelSwitch", CelSwitchStories)
  .add("CircleButton", CircleButtonStories)
  .add("CoinIcon", CoinIconStories)
  .add("CoinSwitch", CoinSwitchStories)
  .add("ContactRow", ContactRowStories)
  .add("ContactSupport", ContactSupportStories)
  .add("DotsBar", DotsBarStories)
  .add("EmptyState", EmptyStateStories)
  .add("HeadingProgressBar", HeadingProgressBarStories)
  .add("HiddenField", HiddenFieldStories)
  .add("HorizontalSlider", HorizontalSliderStories)
  .add("Icon", IconStories)
  .add("InfoBox", InfoBoxStories)
  .add("Loader", LoaderStories)
  .add("LoadingState", LoadingStateStories)
  .add("MissingInfoCard", MissingInfoCardStories)
  .add("OfflineMode", OfflineModeStories)
  .add("PaymentListItem", PaymentListItemStories)
  .add("ProgressBar", ProgressBarStories)
  .add("SecurityStrengthMeter", SecurityStrengthMeter)
  .add("SecurityScoreGauge", SecurityScoreGauge)
  .add("HodlBanner", HodlBannerStories)
  .add("PassMeterTooltipStories", PassMeterTooltipStories)
  .add("PassStrengthMeterStories", PassStrengthMeterStories);
// NOTE(fj): plop componentGen adding new stories here
