import RNUxcam from "react-native-ux-cam";
import loggerUtil from "./logger-util";
import Constants from "../../constants";

const { UXCAM_API_KEY } = Constants;

export{
    initUxCam
};

async function initUxCam() {

  if (!UXCAM_API_KEY) return;

  try {
    await RNUxcam.optIntoSchematicRecordings(); // for enabling iOS screen recordings
    await RNUxcam.startWithKey(UXCAM_API_KEY); // Add this line after RNUcam.optIntoSchematicRecordings();
  } catch(err) {
    loggerUtil.log(err)
  }
}



