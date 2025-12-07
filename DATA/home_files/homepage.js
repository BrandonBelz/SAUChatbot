/* Announcement Bar */
const home1 = document.getElementById('home-1');
const announcementBar = document.getElementById('announcementBar');

if (home1 && announcementBar) {
	home1.classList.add('announcing');
}

/* End Announcemnt Bar */

// 03 Godly Purpose Animation
const svgPath = document.getElementById('svgPath');
w = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth;
var targetWidth = 768;
if ( w >= targetWidth) {     
	gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
	const main = gsap.timeline({
		defaults: {
			duration: 6
		},
		scrollTrigger: {
			trigger: '#godly-purpose',
			scrub: true,
			start: "top 15%",
			end: "bottom 20%"
		}
	})
	.fromTo('.theLine', {drawSVG: 0}, {drawSVG: "100%"})

	const transit = document.getElementById('transit');
	if (transit) {
		transit1 = transit.children[0];
		transit2 = transit.children[1];
		transit3 = transit.children[2];

		transit.addEventListener('mouseover', function(e){
			transit.parentElement.parentElement.classList.remove('cycle');
		})
		transit.addEventListener('mouseleave', function(e){
			transit.parentElement.parentElement.classList.add('cycle');
		})

		const circleOne = document.getElementById('circleOne');
		const circleTwo = document.getElementById('circleTwo');
		const circleThree = document.getElementById('circleThree');

		const transits = document.querySelectorAll('.transit-item');
		[].forEach.call(transits, function(tran) {
			tran.addEventListener('mouseover', function(e){
				tran.classList.add('transit-display');
				if (tran === transit1) {
					circleOne.style.fill = '#ced54a';
				} else if (tran === transit2) {
					circleTwo.style.fill = '#ced54a';
				} else if (tran === transit3){
					circleThree.style.fill = '#ced54a';
				}
			})
			tran.addEventListener('mouseleave', function(e){
				tran.classList.remove('transit-display');
				if (tran === transit1) {
					circleOne.style.fill = '#fff';
				} else if (tran === transit2) {
					circleTwo.style.fill = '#fff';
				} else if (tran === transit3) {
					circleThree.style.fill = '#fff';
				}
			})
		})
	}
}

/* Footer Group Request Information button */
const footerGroupButtons = document.getElementById('footer-group-buttons');
if (footerGroupButtons) {
	const rfiBar = document.getElementById('rfi-bar-new');
	const firstField = document.querySelector('#rfiFormBar select');

	footerRFI = footerGroupButtons.children[0];
	footerRFI.addEventListener('click', function(e) {
		rfiBar.classList.add('active');
		rfiBar.scrollIntoView({behavior: "smooth",});

		if (firstField) {
			firstField.focus();
		}
	});
}
/* End Footer Group RFI button */

// Investement Stats Swiper
var swiper = new Swiper(".swiper2", {
  centeredSlides: false,
  slidesPerView: 1,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
  },
  breakpoints: {
    600: {
      slidesPerView: 2,
      centeredSlides: false,
    },
    1440: {
      slidesPerView: 3,
      loop: false,
    },
  },
});