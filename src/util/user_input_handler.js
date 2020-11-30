/* user_input_hander.js HANDLES INPUTS PROVIDED BY THE USER TO THE CHAT */

const {
  formElicitSlotWithTemplateResponse,
  formTerminalResponse,
  formElicitIntentResponse,
} = require("./response_handler");

const {
  FULFILLMENT_STATES,
  SLOTS,
  TEMPLATE_TYPES,
  ACTIONS,
  TEST_INTERACTIVE_OPTIONS,
  TEST_INTERACTIVE_OPTIONS_SLOTS,
  TEST_INTERACTIVE_OPTIONS_TEMPLATES,
  DEPARTMENT_SLOT
} = require("../constants/interactive_options");

/* HANDLE INITIAL UTTERANCE INPUT */
function handleElicitAction(request) {
  let template = createSimpleListPickerFromOptions(
    "How can I help you?",
    Object.values(ACTIONS)
  );
  return formElicitSlotWithTemplateResponse(
    request.currentIntent.name,
    request.currentIntent.slots,
    SLOTS.ACTION,
    template.data.content.elements,
    request.sessionAttributes
  );
}

/* HANDLE ACTION INPUT */
function handleActionResponse(input, request) {
  if (ACTIONS.CONTINUE_TO_AGENT === input  || ACTIONS.END_CHAT === input  ) {
    return formTerminalResponse(
      request.sessionAttributes,
      FULFILLMENT_STATES.FULFILLED,
      `Received '${input}'`
    );
  } else if (ACTIONS.TEST_INTERACTIVE === input) {
    let template = createSimpleListPickerFromOptions(
      "What would you like to do?",
      Object.values(TEST_INTERACTIVE_OPTIONS)
    );
    var outputSessionAttributes = request.sessionAttributes || {};
    return formElicitSlotWithTemplateResponse(
      request.currentIntent.name,
      request.currentIntent.slots,
      SLOTS.INTERACTIVE_OPTION,
      template.data.content.elements,
      outputSessionAttributes
    );
  } else if (TEST_INTERACTIVE_OPTIONS.DEPARTMENT_WITH_MULTIPLE_IMAGES === input) {
    let template = createSimpleListPickerFromOptions(
      "Which department would you like to see?",
      Object.values(DEPARTMENT_SLOT)
    );
    
    let elicitSlot = TEST_INTERACTIVE_OPTIONS_SLOTS.DEPARTMENT_WITH_MULTIPLE_IMAGES;
    var outputSessionAttributes = request.sessionAttributes || {};
    return formElicitSlotWithTemplateResponse(
      request.currentIntent.name,
      request.currentIntent.slots,
      elicitSlot,
      template.data.content.elements,
      outputSessionAttributes
    );
    } else if (TEST_INTERACTIVE_OPTIONS.SIMPLE_TIMEPICKER === input) {
    let template = createSimpleListPickerFromOptions(
      "Which timeslot do you want?",
      TEST_INTERACTIVE_OPTIONS_TEMPLATES.SIMPLE_TIMEPICKER.data.content.timeslots.map(({title}) => title)
    );
    
    let elicitSlot = TEST_INTERACTIVE_OPTIONS_SLOTS.SIMPLE_TIMEPICKER;
    var outputSessionAttributes = request.sessionAttributes || {};
    return formElicitSlotWithTemplateResponse(
      request.currentIntent.name,
      request.currentIntent.slots,
      elicitSlot,
      template.data.content.elements,
      outputSessionAttributes
    );
  } else if ( Object.keys(DEPARTMENT_SLOT).filter(check => input === DEPARTMENT_SLOT[check]).length > 0) {
    return formTerminalResponse(
      request.sessionAttributes,
      FULFILLMENT_STATES.FULFILLED,
      `Received '${input}'`
    );
  } else if ( TEST_INTERACTIVE_OPTIONS_TEMPLATES.SIMPLE_TIMEPICKER.data.content.timeslots.filter(timeslot => input === timeslot.title).length > 0) {
    return formTerminalResponse(
      request.sessionAttributes,
      FULFILLMENT_STATES.FULFILLED,
      `Received '${input}'`
    );
  } else {
    throw new Error(`Invalid action recieved: ${input}`);
  }
}

/* HANDLE INTERACTIVE OPTION INPUT */
function handleInteractiveOptionResponse(input, request) {
  let interactionOptionKey = Object.entries(TEST_INTERACTIVE_OPTIONS).filter(
    (entry) => entry[1] == input
  )[0][0];
  console.log(interactionOptionKey);
  let template = TEST_INTERACTIVE_OPTIONS_TEMPLATES[interactionOptionKey];
  let elicitSlot = TEST_INTERACTIVE_OPTIONS_SLOTS[interactionOptionKey];
  
  return formElicitSlotWithTemplateResponse(
    request.currentIntent.name,
    request.currentIntent.slots,
    elicitSlot,
    template,
    request.sessionAttributes
  );
}

/* HANDLE OTHER RESPONSES */
function handleOtherResponse(input, request) {
  let message = `Received '${input}'\n\nPlease send 'help' to start again`;
  return formElicitIntentResponse(
    request.sessionAttributes,
    request.currentIntent.name,
    message
  );
}

/* CREATE A LIST PICKER */
function createSimpleListPickerFromOptions(title, options) {
  let elements = options.map((option) => {
    return { title: option };
  });

  return {
    templateType: TEMPLATE_TYPES.LISTPICKER,
    version: "1.0",
    data: {
      content: {
        title: title,
        subtitle: "Tap to select option",
        elements: elements,
      },
    },
  };
}

module.exports = {
  handleElicitAction,
  handleActionResponse,
  handleInteractiveOptionResponse,
  handleOtherResponse,
};