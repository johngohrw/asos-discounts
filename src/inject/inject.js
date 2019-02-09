chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			
			console.log('injected asos js!');

			articlePriceRegex = /([0-9]+.[0-9]+)/;

			getArticlePercentages();

			getProductHeroPercentage();

			if (Array.from(document.getElementsByTagName('progress')).length > 0) {
				console.log('gotprogress!');
				var progressElem = Array.from(document.getElementsByTagName('progress'))[0];
				if (progressElem.value !== undefined) {
					var currentProgressValue = progressElem.value;
					setInterval(()=> {
						console.log('checking for progressincrease')
						if (progressElem.value !== currentProgressValue){
							console.log('progressincrease!')
							currentProgressValue = progressElem.value
							setTimeout(()=> {
								getArticlePercentages();
							}, 100)
						}
					}, 1000)	
				}
			} else {
				console.log('no progress..');
			}
		}
	}, 10);
});

const getProductHeroPercentage = () => {
	console.log('getting product hero percentage..');
	var productPriceElem = document.getElementById('product-price');
	if (productPriceElem !== null) {
		var heroPrices = productPriceElem.innerText.match(/[0-9]+.[0-9]+/g);
		console.log("hero prices:", heroPrices)
		if (heroPrices.length === 2) {
			heroPrices = heroPrices.map((i) => {
				return parseFloat(i);
			})
			var ori = Math.max(...heroPrices)
			var disc = Math.min(...heroPrices)
			var pctg = Math.round(((ori - disc) / ori) * 100, 0);

			var newSpan = document.createElement("span");
			newSpan.appendChild(document.createTextNode("-" + pctg.toString() + "%"));
			newSpan.classList.add('savings-percentage-hero')

			if (pctg <= 40) {
				newSpan.classList.add('savings-low')
			} else if (pctg <= 70) {
				newSpan.classList.add('savings-med')
			} else if (pctg <= 100) {
				newSpan.classList.add('savings-hi')
			}

			productPriceElem.appendChild(newSpan)

		} else {
			console.log('no hero percentage..');
		}
		
	}
}

const getArticlePercentages = () => {
	console.log('getting article percentages..')
	var articles = Array.from(document.getElementsByTagName('article'))
			articles.forEach((item) => {
				if (item.childNodes[0].childNodes[2].childNodes[0].childNodes[0] === undefined) {
					return;
				}
				var original = item.childNodes[0].childNodes[2].childNodes[1].innerText
				var discounted = item.childNodes[0].childNodes[2].childNodes[0].childNodes[0].innerText
				original = parseFloat(articlePriceRegex.exec(original)[0])
				discounted = parseFloat(articlePriceRegex.exec(discounted)[0])
				var percentage = Math.round(((original - discounted) / original) * 100, 0);
				
				var newSpan = document.createElement("span");
				newSpan.appendChild(document.createTextNode("-" + percentage.toString() + "%"));
				newSpan.classList.add('savings-percentage')

				if (percentage <= 40) {
					newSpan.classList.add('savings-low')
				} else if (percentage <= 70) {
					newSpan.classList.add('savings-med')
				} else if (percentage <= 100) {
					newSpan.classList.add('savings-hi')
				}

				item.childNodes[0].childNodes[2].appendChild(newSpan)

			})
}