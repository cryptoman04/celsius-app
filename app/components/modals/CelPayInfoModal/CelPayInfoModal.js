import React from "react";

import InfoModal from "../InfoModalNew/InfoModal.js";
import CelPayInfoModalStyle from "./CelPayInfoModal.styles";
import { MODALS } from "../../../constants/UI";
import formatter from "../../../utils/formatter";

const CelPayInfoModal = props => {
  const style = CelPayInfoModalStyle(props.theme);
  const { maxTransferAmount } = props;
  return (
    <InfoModal
      picture={require("../../../../assets/images/icon-send.png")}
      darkPicture={require("../../../../assets/images/icon-send-dark.png")}
      pictureDimensions={{ width: 35, height: 35 }}
      style={style.container}
      name={MODALS.CELPAY_INFO_MODAL}
      heading={`Use CelPay to send crypto to your contacts`}
      paragraphs={[
        `No addresses needed - send up to ${formatter.usd(maxTransferAmount)} worth of crypto quickly and easily one-touch sharing options.`,
      ]}
    />
  );
};

export default CelPayInfoModal;
