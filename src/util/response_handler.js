/* response_handler.js HANDLES CREATION OF RESPONSES TO THE LEX BOT */

/* CREATE A RESPONSE BASED ON INITIAL USER UTTERANCE */
function formElicitSlotWithTemplateResponse(
  intentName,
  slots,
  slotToElicit,
  template,
  sessionAttributes
) {
  return {
    sessionAttributes,
    dialogAction: {
      type: "ElicitSlot",
      intentName,
      slots,
      slotToElicit,
      message: JSON.stringify(template.map(({ title }) => ({ title: title || '' })))
    },
  };
}

/* CREATE A RESPONSE BASED TERMINATION UTTERANCE FROM THE USER */
function formTerminalResponse(sessionAttributes,fulfillmentState, messageText) {
  return {
    sessionAttributes,
    dialogAction: {
      type: "Close",
      fulfillmentState,
      message: JSON.stringify(messageText)
    },
  };
}

/* CLEAR THE RECENT INTENT HISTORY TO LET USER START OVER IN THE CHAT*/
function formElicitIntentResponse(sessionAttributes,intentName, messageText) {
  return {
    sessionAttributes,
    recentIntentSummaryView: [],
    dialogAction: {
      type: "ElicitIntent",
      message: JSON.stringify(messageText)
    },
  };
}

module.exports = {
  formElicitSlotWithTemplateResponse,
  formTerminalResponse,
  formElicitIntentResponse,
};