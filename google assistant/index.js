 
const functions = require('firebase-functions');
const rp = require('request-promise');

const {
  dialogflow,
  SimpleResponse,
  BasicCard,
  Button,
  Image,
  BrowseCarousel,
  BrowseCarouselItem,
  Suggestions,
  LinkOutSuggestion,
  MediaObject,
  Table,
  List,
  Carousel,
  Permission
} = require('actions-on-google');

const app = dialogflow({debug: true});

app.intent('Default Welcome Intent', conv => {
	conv.ask("Welcome to Though Movability.");
  	const context = `To plan your journey for special needs people.`;
	const permission = ['DEVICE_PRECISE_LOCATION']; // Or DEVICE_COARSE_LOCATION, DEVICE_PRECISE_LOCATION
  	conv.ask(new Permission({context: context, permissions: permission}));
});

app.intent('Default Fallback Intent', conv => {
  conv.ask(`I didn't catch that. Can you tell me something else?`);
});

app.intent('test', conv => {
   if (!conv.screen) {
    conv.ask('Sorry, try this on a screen device or select the ' +
      'phone surface in the simulator.');
    conv.ask('Which response would you like to see next?');
    return;
  }

  conv.ask(`This is the searching result.`);
  conv.ask(new BasicCard({
    text: `Click to Continue`,
    buttons: new Button({
      title: 'Click',
      url: 'https://assistant.google.com/',
    }),
  }));
});

app.intent('Address Intent', (conv, {address}) => {
    conv.ask(`${address} at 5 Parkway, it is 6km away. How would you like to go there?`);
});

app.intent('Transportation Intent', (conv, {transportation}) => {
    conv.ask(`ok, searching a routing ${transportation} routing.`);
    conv.ask(`Which one is your top priority? Safer, faster or closest`);
});

app.intent('Priority Intent', (conv, {priority}) => {
    conv.ask('Based on our users feedback, the cafe currently has an issue with a lift.');
    conv.ask(`ok, I found a perfect route with available disabled parking bay for you. The parking space is 3 minutes away from destination.`);
    conv.ask(new BasicCard({
      text: `Click to Continue`,
      buttons: new Button({
        title: 'Click',
        url: 'https://assistant.google.com/',
      }),
    }));
});


app.intent('Request Permission Intent', (conv) => {
  	conv.ask("Welcome to Movability.");
  	const context = `To plan your journey`;
	const permission = ['DEVICE_PRECISE_LOCATION']; // Or DEVICE_COARSE_LOCATION, DEVICE_PRECISE_LOCATION
  	conv.ask(new Permission({context: context, permissions: permission}));
});

app.intent('Get Permission Intent', (conv, params, confirmationGranted) => {
  const { location } = conv.device;
  if (!location) {
    conv.ask(`something went wrong.`);
    return;
  }
  const { latitude, longitude } = location.coordinates;
  if (confirmationGranted) {
    if (latitude && longitude) {
      conv.ask(`Thank you. I got your current latitude and langitude.`);
      conv.ask(`Could you tell me where would you go?`);
    } else {
      conv.ask(`I can't get your permission?`);
    }
  }
  else {
    conv.ask(`something went wrong.`);
  }
});

const requestPermission = (app) => {
  app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
};
    
const userInfo = (app) => {
  if (app.isPermissionGranted()) {
    const address = app.getDeviceLocation().address;
    if (address) {            
      app.tell(`You are at ${address}`);
    }
    else {
      // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates 
      // and a geocoded address on voice-activated speakers. 
      // Coarse location only works on voice-activated speakers.
      app.tell('Sorry, I could not figure out where you are.');
    }
  } else {
    app.tell('Sorry, I could not figure out where you are.');
  }
};


exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);