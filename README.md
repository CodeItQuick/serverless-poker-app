# Poker AWS Serverless Application

React AWS Serverless Application with a Serverless backend.

General Functionality:
* [The main website is currently available through AWS at](https://3uj83kbjaf.execute-api.us-east-1.amazonaws.com/prod/prod)
* [The API endpoints this website hits to get the chat widget working. Note: Do not hit this directly, its an API.](https://yk940tr4lj.execute-api.us-east-1.amazonaws.com/Prod)
* [The other github repository with the React code for deployment using this API](https://github.com/CodeItQuick/PokerHandRangeRubyReact/tree/amazonConnect/integration)

The call flow can be displayed in the files (they were exported):
* _VF First Contact Flow
* _VF Call Flow
* _VF Queue Integration

I've hopefully included the phone number to reach the contact center by email. If I somehow forgot please remind me.

The capabilities of the call center:
1. First contact flow that routes to a flow that is either chat or calls.
1. The calls are routed to three "separate" queues (which are actually all the same as this is not production).
1. These separated queue's represent different regions in Canada (Eastern/Western) and one International Line.
1. Multilanguage support.
1. The default in queue music.

The capabilities of the chat widget:
1. It calls to a Lex bot that can perform some basic answers to questions, typically before the customer talks to an agent.
1. The customer can talk to an agent anytime, and if a message is received the bot doesn't understand it gives a 
generic response. If someone is on the other end in the call center it allows communication between the two people.
1. There is some very basic error handling performed when some API calls fail, that generates an error on the chat widget
to that effect.
1. I am going to add some more unit tests, and subsequently refactor some of the messier code on the last day (Friday Dec 4th)
before totally handing this off to you.


The tech stack is: 
* [React](https://reactjs.org)
* [API Gateway](https://aws.amazon.com/api-gateway/) 
* [AWS Lambda](https://aws.amazon.com/lambda) 
* [Node.js](https://nodejs.org/) 
* [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
* [AWS Connect](https://aws.amazon.com/connect/)

## Interesting files within these two repositories
* [A custom lambda function I built to retrieve the area code of the caller and place them in an appropriate queue](https://github.com/CodeItQuick/serverless-poker-app/blob/aws/deployed/src/awsConnectHandler/customConnectLambda.js)
* [The relatively sparse test folder, that has a few tests surrounding the above lambda function](https://github.com/CodeItQuick/serverless-poker-app/tree/aws/deployed/tests)
* [The SAM template file that constructs all the infrastructure code](https://github.com/CodeItQuick/serverless-poker-app/blob/aws/deployed/template.yml)

## Deploy with CloudFormation

Prerequisites: [Node.js](https://nodejs.org/en/) and [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed

* Create an [AWS](https://aws.amazon.com/) Account and [IAM User](https://aws.amazon.com/iam/) with the `AdministratorAccess` AWS [Managed Policy](http://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html)
* Run `aws configure` to put store that user's credentials in `~/.aws/credentials`
* The production build of the react site comes from the other linked repository. `npm run build` to build that project into the build
  folder of that repository, and then copy and paste it over to the public folder of this repository. Do not delete the app.js file in
  the public folder when doing this.
* Create an S3 bucket for storing the Lambda code and store its name in a shell variable with:
  * `export CODE_BUCKET=<bucket name>`
* Npm install:
  * `npm install`
* Build:
  * `npm run build`
* Upload package to S3, transform the CloudFormation template:
  * `npm run package`
* Deploy to CloudFormation:
  * `npm run deploy`

## Links
* [serverless-todo](https://github.com/evanchiu/serverless-todo) on Github
* [serverless-todo](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:233054207705:applications~serverless-todo) on the AWS Serverless Application Repository

## License
The code I used, which wasn't mine, I checked the licenses for all of it. Although I am not comfortable stating
the exact license of every codebase, I tended to pull from either AWS codebases that are typically MIT, or pull
from applications that are simple TO-DO apps and build on top of them. One of the licenses I am using is listed below:

&copy; 2017-2019 [Evan Chiu](https://evanchiu.com). This project is available under the terms of the MIT license.
