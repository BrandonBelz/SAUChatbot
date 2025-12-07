// Stat counter
var statAnimate = function(containerItem, index) {
	var countelements = containerItem.querySelectorAll('span.count');
	if (inView(containerItem)) {
		if( fired[index] ) return;
		fired[index] = true;
		for (var i = 0; i < countelements.length; ++i) {
			var count = countelements[i];
			// counter("count"+(i+1), 0, parseInt(count.innerHTML), 3000);
			var countUp = new CountUp(count, count.innerHTML, {decimalPlaces: count.innerHTML.includes('.') ? 1 : 0});
			if (!countUp.error) {
				countUp.start();
			} else {
				console.error(countUp.error);
			}
		}
	}
}

// check if element is in view
var inView = function(containerItem) {
	
	// get element height
	var elementHeight = containerItem.clientHeight;
	// get window height
	var windowHeight = window.innerHeight;
	// get number of pixels that the document is scrolled
	var scrollY = window.scrollY || window.pageYOffset;
	// get current scroll position (distance from the top of the page to the bottom of the current viewport)
	var scrollPosition = scrollY + windowHeight;
	// get element position (distance from the top of the page to the bottom of the element)
	var elementPosition = containerItem.getBoundingClientRect().top + scrollY + elementHeight;
	// is scroll position greater than element position? (is element in view?)
	if (scrollPosition > elementPosition) {
		return true;
	}
	return false;
}


const statList = document.querySelectorAll('.stat-counter');
import {CountUp} from 'https://sauassetsaws-c897.kxcdn.com/framework/js-libraries/countUp.min.js';
var fired = new Array();
statList.forEach(function(statListItem, index){
	fired.push(false);
	statAnimate(statListItem, index);
	window.addEventListener('scroll', function() { statAnimate(statListItem, index); } );
});