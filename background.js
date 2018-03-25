
chrome.browserAction.onClicked.addListener(function(tab) {
    /* if you click the browser action (the icon for chrome extension) */
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {text:"initFootInMouth"}, function(response) {
			if(response.type == "test"){
				/* stuff happens */
			}
		});
	});
    

});


