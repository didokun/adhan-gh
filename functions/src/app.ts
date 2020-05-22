import * as express from 'express';
import app from '.';

const {WebhookClient} = require('dialogflow-fulfillment');
const webApp = express();

webApp.get('/', (req, res) => res.send('online'));
webApp.post('/', express.json(), (req, res) => {
    const agent = new WebhookClient({request: req, response: res});

    function welcome() {
        agent.add('Welcome to my agent!')
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    agent.handleRequest(app)
});

export default webApp;
