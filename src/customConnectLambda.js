const aws = require('aws-sdk');

exports.handler = (event, context, callback) => main(event, context, callback);

const phoneNumberLookup = {
  403: 'Alberta', 587: 'Alberta', 780: 'Alberta', 825: 'Alberta',
  250: 'British Columbia', 604: 'British Columbia', 236: 'British Columbia', 778: 'British Columbia',
	204: 'Manitoba', 431: 'Manitoba',
  506: 'New Brunswick',
	709: 'Newfoundland',
	867: 'Northwest Territories/Nunavut/Yukon',
	782: 'Prince Edward Island/Nova Scotia',
	365: 'Ontario', 548: 'Ontario', 705: 'Ontario', 226: 'Ontario', 289: 'Ontario', 613: 'Ontario', 
  807: 'Ontario', 437: 'Ontario', 249: 'Ontario', 343: 'Ontario', 416: 'Ontario', 519: 'Ontario', 
  647: 'Ontario', 905: 'Ontario',
	902: 'Prince Edward Island/Nova Scotia',
	418: 'Quebec', 450: 'Quebec', 367: 'Quebec', 579: 'Quebec', 873: 'Quebec', 514: 'Quebec', 
  581: 'Quebec', 819: 'Quebec', 438: 'Quebec',
	306: 'Saskatchewan', 639: 'Saskatchewan'
};


export function main({event}, context, lambdaCallback) {
  
  
  try {

    const response = event.Details.ContactData.CustomerEndpoint.Address;
    console.log(response);
    const areaCode = response.substring(2, 5);
    console.log(areaCode);
    const province = phoneNumberLookup[areaCode];
    console.log(province);

    console.log(`Returning response: ${JSON.stringify(response)}`);
    return done(200, JSON.stringify({
        province
        }), 'application/json', lambdaCallback);
  } catch (err) {
    console.error(`Error processing Custom Lambda Handler request:`, err);
    return done(200, err, 'application/json', lambdaCallback);
  }
}

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