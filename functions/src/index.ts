import * as functions from 'firebase-functions';
import { dialogflow, Permission, SimpleResponse } from "actions-on-google";

const app = dialogflow();

app.intent("Default Welcome Intent", (conv: any) => {
    conv.data.requestedPermission = "DEVICE_PRECISE_LOCATION";
    conv.ask(new SimpleResponse('Assalamo Alaykom wa rahmato allah taala wa barakatoho'));
    return conv.ask(
        new Permission({
            context: "Permission de localisation",
            permissions: 'DEVICE_PRECISE_LOCATION'
        })
    );
});
app.intent("get_current_location", (conv: any, params: any, permissionGranted: any) => {
    conv.ask(new SimpleResponse('Wait we will check'));
    if (permissionGranted) {
        console.log('DATA PERRR', {conv, params, permissionGranted});
        const { requestedPermission } = conv.data;
        let address;
        if (requestedPermission === "DEVICE_PRECISE_LOCATION") {
            const { coordinates } = conv.device.location;
            console.log('coordinates are', coordinates);

            if (coordinates && address) {
                return conv.close(new SimpleResponse(`Your Location details ${address}`));
            } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
                return conv.close("Sorry, I could not figure out where you are.");
            }
        }
    } else {
        return conv.close("Sorry, permission denied.");
    }
});
export const fulfillment = functions.https.onRequest(app);