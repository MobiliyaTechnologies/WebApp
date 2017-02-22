importScripts("https://www.gstatic.com/firebasejs/3.6.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/3.6.2/firebase-messaging.js");
var config = {
    apiKey: "AIzaSyDOmoRglupPYwYYIr3lihNYKXUsEOVpezw",
    authDomain: "csu-android-app.firebaseapp.com",
    databaseURL: "https://csu-android-app.firebaseio.com",
    storageBucket: "csu-android-app.appspot.com",
    messagingSenderId: "107379564375"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();  
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(self.clients.openWindow('http://localhost:65159/#/login?' + JSON.stringify(event)));
})
messaging.setBackgroundMessageHandler(function (payload) {
    const title = 'CSU Notification';
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const options = {
        body: payload.data.body,
        icon: './Assets/logo.png',               
    }
   
    return self.registration.showNotification(title, options);
})
