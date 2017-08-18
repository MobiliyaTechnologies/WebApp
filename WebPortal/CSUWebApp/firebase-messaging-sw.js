importScripts("https://www.gstatic.com/firebasejs/3.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/3.6.2/firebase-messaging.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/localforage/1.5.0/localforage.js");

var config = {
    apiKey: localforage.getItem("ApiKey"),
    authDomain: localforage.getItem("AuthDomain"),
    databaseURL: localforage.getItem("DatabaseURL"),
    storageBucket: localforage.getItem("StorageBucket"),
    messagingSenderId: localforage.getItem("NotificationSender")
};
localforage.getItem("ApiKey").then(function (value) {
    config.apiKey = value;
    localforage.getItem("NotificationSender").then(function (value) {
        config.messagingSenderId = value;
        intiateFirebase();
    });
});
function intiateFirebase() { 
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function (payload) {
        const title = 'Energy Management Notification';
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        const options = {
            body: payload.data.body,
            icon: './Assets/logo.png',
            sound: 'default'
        }

        return self.registration.showNotification(title, options);
    });
}

