/* console.log('app.js onload'); */

const actions = '"' + chrome.extension.getURL("js/actions.js") + '"';
const allowedSites = [
	"myfitnesspal.com",
	"seamless.com"
];
console.log('Allowed sites', allowedSites);
for (i in allowedSites) {
	if (window.location.hostname.includes(allowedSites[i])) {
		console.log('We are in ' +allowedSites[i]);
		setTimeout(function(){return autofind(true,allowedSites[i])}, 7000);

	}
}

/* if (window.location.hostname) */





/* clicking on the addon button */
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.text == "initFootInMouth") {
			
			let bodyel = document.querySelector('body');
			console.log('body', bodyel);
			//stuff happens
			if (!document.getElementById('FootInMouth')){
				let extBody = document.createElement('div');
				extBody.setAttribute('id', 'FootInMouth');

				bodyel.appendChild(extBody);

				/* CREATE EXT BODY AND BUTTON TCTIVATE HIGHLIGHT FUNC */



			}

		}

	}
);
