const defaultErrorMessage = "משהו לא עבד";

const errorsMapping = {
  "1100": "שם המשתמש הזה תפוס",
  "1010": "יש כבר אירוע כזה ביום הזה",
  "1001": "אחד מהשדות לא טוב",
  "2100": "שמע נראה לי שאתה טועה",
  "2200": "שמע נראה לי שאתה טועה"
}

const mapError = err => {
  if (!err.response.data.data) {
    console.warn("This error doesn't contain app code ", err.message);
    return defaultErrorMessage
  }
  const message = errorsMapping[err.response.data.data.appCode];
  if (!!message) {
    return message;
  }

  return defaultErrorMessage;
}

export default mapError;