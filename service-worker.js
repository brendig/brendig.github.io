if ('serviceWorker' in navigator) { 
  navigator.serviceWorker.register('service-worker.js').then(function(registration) {
	// Registration was successful 
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
	registration.pushManager.subscribe({userVisibleOnly:true}).then(function(subscription){
		
        isPushEnabled = true;  
		
		console.log("subscription.subscriptionId: ", subscription.subscriptionId);
		console.log("subscription.endpoint: ", subscription.endpoint);

		register();

/*
		// Save the subscription Id - Fetch API FTW!
		var url = 'https://deanhume.azurewebsites.net/push/SaveSubscription?subscriptionId=' + subscription.subscriptionId;
		fetch(url, {
			method: 'get',
			mode: 'cors'
		}).then(function(response) {
			console.log('Subscription saved successfully: ', response.text());
		}).catch(function(err) {
			console.log('There was an issue saving the subscription details: ', err);
		});
*/

	});

/*
navigator.serviceWorker.ready.then(function(reg) {
  reg.pushManager.getSubscription().then(function(subscription) {
    subscription.unsubscribe().then(function(successful) {
  		console.log("You've successfully unsubscribed");
    }).catch(function(e) {
  		console.log("Unsubscription failed");
    })
  })        
});
*/

  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}


function register() {
  var senderId = '561046146208';
  chrome.gcm.register([senderId], registerCallback);

  // Prevent register button from being click again before the registration
  // finishes.
}

function registerCallback(regId) {
  registrationId = regId;
  console.log("registrationId: ", registrationId);

}

self.addEventListener('push', function(event) {  
	debugger;
  console.log('Received a push message', event);

  var title = 'Notification';  
  var body = 'There is newly updated content available on the site. Click to see more.';  
  var icon = 'https://raw.githubusercontent.com/deanhume/typography/gh-pages/icons/typography.png';  
  var tag = 'simple-push-demo-notification-tag';
  
  event.waitUntil(  
    self.registration.showNotification(title, {  
       body: body,  
       icon: icon,  
       tag: tag  
     })  
   );  
});

self.addEventListener('notificationclick', function(event) {  
  console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow('https://deanhume.github.io/typography');  
      }
    })
  );
});