const videoCards = document.querySelectorAll('[name="h02"] article');
const mobileQuery = window.matchMedia('(min-width: 0px) and (max-width: 600px)');
const isMobile = mobileQuery.matches;

videoCards.forEach((card) => {
	const videoElement = card.querySelector('video');
	const playButton = card.querySelector('.play-button');
	// Add event listeners
	card.addEventListener('mouseenter', (event) => {
		videoElement.play();
		playButton.classList.add('hide');
	})
	card.addEventListener('mouseleave', (event) => {
		videoElement.pause();
		playButton.classList.remove('hide');
	})

	// Add swiper classes when on mobile (small screen widths)
	if (isMobile) {	
		card.classList.add('swiper-slide');
	}
})

// Initialize Swiper when on mobile (small screen widths)
if (isMobile) {
	const swiper = new Swiper('[name="h02"] .swiper', {
		effect: "cards",
		grabCursor: true,
		loop: true,
	});
}