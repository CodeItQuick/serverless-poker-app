const aws = require('aws-sdk');
const doc = new aws.DynamoDB.DocumentClient();
const fs = require('fs');
const mime = require('mime-types');
const path = require('path');

const {
  FULFILLMENT_STATES,
  TEST_INTERACTIVE_OPTIONS,
} = require("./constants/interactive_options.js");
const { formTerminalResponse } = require("./util/response_handler.js");
const {
  handleElicitAction,
  handleActionResponse,
  handleInteractiveOptionResponse,
  handleOtherResponse,
} = require("./util/user_input_handler.js");

exports.handler = main;
const key = 'user_key';

const routes = {
  '/api/': true
};

function main(event, context, lambdaCallback) {
  console.log(event.body === null);
  var eventToString = false;
  if (event.body !== null && event.isBase64Encoded) {
    eventToString = Buffer.from(event.body, 'base64').toString();
  }
  if (event.body !== null) {
    try {
      console.log(`Request received: ${eventToString || event.body}`);
      let response = handleRequest(JSON.parse(eventToString || event.body));
      console.log(`Returning response: ${JSON.stringify(response)}`);
      return done(200, JSON.stringify(response.dialogAction), 'application/json', lambdaCallback);
    } catch (err) {
      console.error(`Error processing Lex request:`, err);
      return done(200, err, 'application/json', lambdaCallback);
    }
  } else {
    return servePublic(event, context, lambdaCallback);
  }
}

/* PROCESS INBOUND MESSAGE */
function handleRequest(request) {
  let input = request.inputTranscript;
  let recent_intent = request.recentIntentSummaryView;
  let recent_intent_action = null;
  if (recent_intent !== null)
    recent_intent_action = request.recentIntentSummaryView[0].slots.action;
  let current_intent = request.currentIntent.name;

  /* HANDLE INTENT 'InteractiveMessageIntent' */
  if (current_intent === 'InteractiveMessageIntent' && input === 'help') {
    return handleElicitAction(request);
  } else if (current_intent === 'InteractiveMessageIntent') {
    return handleActionResponse(input, request);
  }
  /* (optional) HANDLE OTHER INTENTS */

  /* HANDLE FULFILLED INTENT */
  else {
    return handleOtherResponse(input, request);
  }
}

// Attempt to serve public content from the public directory
function servePublic(event, context, lambdaCallback) {
  // Set urlPath
  var urlPath;
  if (event.path === '/prod') {
    return serveIndex(event, context, lambdaCallback);
  } else {
    urlPath = event.path.substring(5);
  }

  console.log(urlPath);

  // Determine the file's path on lambda's filesystem
  var publicPath = path.join(process.env.LAMBDA_TASK_ROOT, 'public');
  var filePath = path.resolve(path.join(publicPath, urlPath));
  var mimeType = mime.lookup(filePath);

  // Make sure the user doesn't try to break out of the public directory
  if (!filePath.startsWith(publicPath)) {
    console.log('forbidden', filePath, publicPath);
    return done(403, '{"message":"Forbidden"}', 'application/json', lambdaCallback);
  }

  // Attempt to read the file, give a 404 on error
  fs.readFile(filePath, function(err, data) {
    if (err) {
      return done(404, '{"message":"Not Found"}', 'application/json', lambdaCallback);
    } else if (mimeType === 'image/png' ||
        mimeType === 'image/jpeg' ||
        mimeType === 'image/x-icon') {
      // Base 64 encode binary images
      return done(200, data.toString('base64'), mimeType, lambdaCallback, true);
    } else {
      return done(200, data.toString(), mimeType, lambdaCallback);
    }
  });
}

// Serve the index page
function serveIndex(event, context, lambdaCallback) {
  // Determine base path on whether the API Gateway stage is in the path or not
  let base_path = '/';
  if (event.requestContext.path.startsWith('/' + event.requestContext.stage)) {
    base_path = '/' + event.requestContext.stage + '/';
  }

  let filePath = path.join(process.env.LAMBDA_TASK_ROOT, 'public/index.html');
  // Read the file, fill in base_path and serve, or 404 on error
  fs.readFile(filePath, function(err, data) {
    if (err) {
      return done(404, '{"message":"Not Found"}', 'application/json', lambdaCallback);
    }
    let content = data.toString().replace(/{{base_path}}/g, base_path);
    return done(200, content, 'text/html', lambdaCallback);
  });
}

// We're done with this lambda, return to the client with given parameters
function done(statusCode, body, contentType, lambdaCallback, isBase64Encoded = false) {

  lambdaCallback(null, {
    statusCode: statusCode,
    isBase64Encoded: isBase64Encoded,
    body: body,
    headers: {
      'Content-Type': contentType,
      "X-Custom-Header": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "X-Requested-With,content-type"
    }
  });
}
