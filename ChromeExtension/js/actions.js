
var responsesJson = {
	lekeys: []
};

const ajaxCall = function(url, el, appnd, successHandler, errorHandler) {
	let xhr = new XMLHttpRequest();
	xhr.open('get', url, true);
	xhr.setRequestHeader('Cache-Control', 'max-age=0');
	xhr.responseType = '';
	xhr.onload = function() {
		let status = xhr.status;
		if (status == 200) {
			successHandler && successHandler(xhr.response);
		} else {
			errorHandler && errorHandler(status);
			if (appnd) document.getElementById(el).innerHTML = '<div>Error receiving data</div>';
		}
	};
	xhr.send();
};


const highlight = function(colour) {
    console.log('highlight function');
    if (window.getSelection) {
        /* IE9 and non-IE */
		let range, sel = window.getSelection();
		if (sel.rangeCount && sel.getRangeAt) {
			range = sel.getRangeAt(0);
		}
		document.designMode = "on";
		if (range) {
			sel.removeAllRanges();
			sel.addRange(range);
		}
		/* DO SOMETHING WITH RANGE */
		console.log('range', range);


    } else if (document.selection && document.selection.createRange) {
        /* IE <= 8 case */
        range = document.selection.createRange();
		/* DO SOMETHING WITH RANGE */
		console.log('range', range);
        
    }
};


const textNodesUnder = function(el) {
	let n, a, walk;
	a = [];
	walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, filterScript, false);
	while (n = walk.nextNode()) {
		a.push(n);
	}
	return a;
};

const filterScript = function(el) {
	
	/*  Don't do replacements under SCRIPT/STYLE tags */
	if (['SCRIPT', 'META', 'STYLE', 'NOSCRIPT', 'TEXTAREA'].indexOf(el.tagName) > -1) {
		return NodeFilter.FILTER_REJECT;
	} else {
		if (el.nodeType == 3) {
			/* Site may have inserted new content under an existing script/style tag */
			if (el.parentNode && (['SCRIPT', 'META', 'STYLE', 'NOSCRIPT'].indexOf(el.parentNode.tagName)) > -1) {
				return NodeFilter.FILTER_REJECT;
				/* Cursor check is to make contenteditable (and FB Messenger) work
				else if (el.closest('[contenteditable="true"]').length) {
					return NodeFilter.FILTER_REJECT;
				} */
			}  else {
				return NodeFilter.FILTER_ACCEPT;
			}
		} else {
			return NodeFilter.FILTER_SKIP;
		}
	}
};

const createFloatbox = function(tempHead, tempText, matchedOne, matchedTwo ) {
	return (tempHead 
	+"<span class='food-match'>" + tempText 
	+"<div class='food-match-info'>"
	+"<div class='food-match-title'>FoodInMouth</div>"
	+"<div>Grams CO2 per Cal: " + matchedOne + "</div>"
	+"<div>Grams CO2 per Serving: " + matchedTwo + "</div>"
	+"</div></span>");
}

const checkForMatches = function(allNodes) {
	
	//let dataArr = ["ALMOND", "APPLE", "APRICOT", "ARTICHOKE", "ASPARAGUS", "AVOCADO", "BANANA", "BARLEY", "BEEF", "BELL PEPPER", "BLACK AND WHITE PEPPER", "BLACKSTRAP MOLASSES", "BLUEBERRIES", "BROCCOLI", "BROILER CHICKEN", "BRUSSEL SPROUT", "BUTTER", "CABBAGE", "CANTALOUPE", "CARROT", "CAULIFLOWER", "CELERY", "CHEESE", "CHOCOLATE LIQUOR", "COCOA BEAN", "COCOA BUTTER", "COCONUT OIL", "CORN", "CORN OIL", "CRANBERRIES", "CUCUMBER", "DRY BEANS", "EGG", "EGGPLANT", "FIG", "FISH", "FLAXSEED", "GARLIC (California)", "GRAPEFRUIT", "HAWAIIAN COFFEE", "HAZELNUT", "HONEY", "HONEYDEW", "HOPS", "KIWI", "LAMB", "LARD", "LETTUCE", "LIMA BEAN", "MACADAMIA NUT", "MILK", "NECTARINE", "OAT", "OLIVE", "OLIVE OIL", "ONION", "ORANGE", "PALM OIL", "PAPAYA", "PEACH", "PEANUT", "PEAR", "PECANS", "PEPPERMINT", "PIG", "PINEAPPLE", "PISTACHIO", "PLUM", "PORK", "POTATO", "RAISIN GRAPE", "RASPBERRIES", "RAW SUGAR", "RETAIL COFFEE", "RICE", "SNAP PEA", "SOYBEAN", "SOYBEAN OIL", "SPEARMINT", "SPINACH", "STRAWBERRIES", "SUNFLOWER OIL", "SWEET CHERRIES", "SWEET CORN", "SWEET POTATO", "TABLE GRAPE", "TOBACCO", "TOMATO", "TURKEY", "WALNUT", "WATERMELON", "WHEAT", "WHEAT FLOUR", "WHOLESALE COFFEE"];
	let dataArr = ["BLACK AND WHITE PEPPER", "BLACKSTRAP MOLASSES", "GARLIC (California)", "CHOCOLATE LIQUOR", "WHOLESALE COFFEE", "BROILER CHICKEN", "HAWAIIAN COFFEE", "BRUSSEL SPROUT", "SWEET CHERRIES", "MACADAMIA NUT", "RETAIL COFFEE", "SUNFLOWER OIL", "SUNFLOWER OIL", "COCOA BUTTER", "RAISIN GRAPE", "STRAWBERRIES", "SWEET POTATO", "BELL PEPPER", "BLUEBERRIES", "CAULIFLOWER", "COCONUT OIL", "CRANBERRIES", "RASPBERRIES", "SOYBEAN OIL", "TABLE GRAPE", "WHEAT FLOUR", "CANTALOUPE", "COCOA BEAN", "GRAPEFRUIT", "PEPPERMINT", "SWEET CORN", "WATERMELON", "ARTICHOKE", "ASPARAGUS", "DRY BEANS", "LIMA BEAN", "NECTARINE", "OLIVE OIL", "PINEAPPLE", "PISTACHIO", "RAW SUGAR", "SPEARMINT", "BROCCOLI", "CORN OIL", "CUCUMBER", "EGGPLANT", "FLAXSEED", "HAZELNUT", "HONEYDEW", "PALM OIL", "SNAP PEA", "APRICOT", "AVOCADO", "CABBAGE", "LETTUCE", "SOYBEAN", "SPINACH", "TOBACCO", "ALMOND", "BANANA", "BARLEY", "BUTTER", "CARROT", "CELERY", "CHEESE", "ORANGE", "PAPAYA", "PEANUT", "PECANS", "POTATO", "TOMATO", "TURKEY", "WALNUT", "APPLE", "HONEY", "OLIVE", "ONION", "PEACH", "WHEAT", "BEEF", "CORN", "FISH", "HOPS", "KIWI", "LAMB", "LARD", "MILK", "PEAR", "PLUM", "PORK", "RICE", "EGG", "FIG", "OAT", "PIG"];
	let matchedArr = [];
	for (n in allNodes) {
		let tempText = allNodes[n].textContent;
		/* compare current page's textmatch to all available server keywords */
		for (let i=0; i<dataArr.length; i++) {
			if (tempText.toLowerCase().indexOf(dataArr[i].toLowerCase()) > -1) {
				if (matchedArr.indexOf(dataArr[i]) == -1) {
					matchedArr.push(dataArr[i]);
				}
			}
		}
	};
	matchedArr.sort(function(a, b){
	  // ASC  -> a.length - b.length
	  // DESC -> b.length - a.length
	  return b.length - a.length;
	});
	console.log('matched arr', matchedArr);
	for (mf in matchedArr) {
		responsesJson.lekeys.push(matchedArr[mf]);
		let matchedUrl = 'https://foodfootprint.azurewebsites.net/api/FoodFootprint/?name=' + matchedArr[mf];
		ajaxCall(matchedUrl, null, false, function(matchedFoodData, lekey) {
			matchedFoodData = matchedFoodData.slice(1, matchedFoodData.length-1);
			let matchedFood = JSON.parse(matchedFoodData);
			console.log('matched food: ', matchedFood);
			console.log('put it into '+matchedFood.RowKey);
			responsesJson[matchedFood.RowKey] = matchedFood;
		});
	};
	

	let fillerFunc = function() {
		console.log('fillerFunc()');
		console.log('responsesJson', responsesJson);
		for (n in allNodes) {
			let tempText = allNodes[n].textContent;
			/* compare current page's textmatch to all available server keywords */
			for (let i=0; i<matchedArr.length; i++) {
				/* if a server keyword is found in a page element text */
				if (tempText.toLowerCase().indexOf(matchedArr[i].toLowerCase()) > -1) {
					console.log('checking against '+matchedArr[i]);
					let indexStart = tempText.toLowerCase().indexOf(matchedArr[i].toLowerCase() );
					let indexEnd = tempText.toLowerCase().indexOf(matchedArr[i].toLowerCase() ) + matchedArr[i].length;
					let tempHead = '';
					if (indexStart > 0) {
						tempHead = tempText.slice(0, indexStart-1);
					}
					let needSpace = tempText.slice(indexEnd, indexEnd + 1) === ' ';
					let matchedFood = responsesJson[matchedArr[i]];
					console.log('matchedfood: ', matchedFood);
					try{
						allNodes[n].parentNode.innerHTML = tempHead
						+"<span class='food-match'>" + tempText.slice(indexStart, indexEnd)
						+"<div class='food-match-info'>"
						+"<div class='food-match-title'>" + matchedArr[i].toLowerCase() + " facts!</div>"
						+"<div>Grams CO2 per Cal: " + matchedFood['GramsCO2ePerCal'] + "</div>"
						+"<div>Grams CO2 per Serving: " + matchedFood['GramsCO2ePerServing'] + "</div>"
						+"</div></span>" + (needSpace ? '&nbsp;' : '') + tempText.slice(indexEnd);
					}
					catch(error){
						break;
					}

				}
			}
		}
	};
	setTimeout(function(){return fillerFunc()}, 4000);

	

};



/* FINDS ALL MATCHING TEXT ELEMENTS */
const autofind = function(bool, foundSite) {
if (bool) {
	console.log('autofind func ', foundSite);
	let potentialParents = [];
	if (foundSite == 'seamless.com') {
		potentialParents = ['searchResults-items-container', 'menuSectionsContainer']; //'globalCart-panel'
	}
	for (i in potentialParents) {
		if (document.querySelectorAll('.'+potentialParents[i]).length > 0) {
			let rootclass = document.querySelectorAll('.'+potentialParents[i])[0];
			let allTextNodes = textNodesUnder(rootclass);
			checkForMatches(allTextNodes);
		}
	}	


}
};