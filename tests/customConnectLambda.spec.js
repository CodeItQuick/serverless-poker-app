import { main } from '../src/awsConnectHandler/customConnectLambda';
import input from './myNumberVoiceEvent.json'

describe('When the event handler for my custom Lambda function is called ', () => {
    test('it should return the province New Brunswick when given a 506 number', () => {
        
        const lambdaCallback = (_, input) => input
        const spy = jest.fn(lambdaCallback)
        const result = main(input.event, input.context, spy);

        expect(spy.mock.calls[0][1]).toStrictEqual({ province: "New Brunswick" });
    });
    test('it should return the province NWT/Yukon/Nunavut when given a 867 number', () => {
        
        const lambdaCallback = (_, input) => input
        const spy = jest.fn(lambdaCallback)

        const inputNewNumber = Object.assign(input, {
            Details: {
                ContactData: {
                    CustomerEndpoint: {
                        Type: 'Fake',
                        Address: '+18671234567'
                    }
                }
            }
        });

        const result = main(inputNewNumber, input.context, spy);

        expect(spy.mock.calls[0][1]).toStrictEqual({ province: "Northwest Territories/Nunavut/Yukon" });
    });
        test('it should return undefined when given Seattle Washington State 206 number', () => {
        
        const lambdaCallback = (_, input) => input
        const spy = jest.fn(lambdaCallback)

        const inputNewNumber = Object.assign(input, {
            Details: {
                ContactData: {
                    CustomerEndpoint: {
                        Type: 'Fake',
                        Address: '+12061234567'
                    }
                }
            }
        });

        const result = main(inputNewNumber, input.context, spy);

        expect(spy.mock.calls[0][1]).toStrictEqual({ province: undefined });
    });
})