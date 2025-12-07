// RFI Bar
const rfibarnew = document.getElementById('rfi-bar-new');
if (rfibarnew) {
	const bait = document.getElementById('bait');
	const closeForm = document.getElementById('closeForm');
	const rfiExpanded = document.getElementById('rfiExpanded');
// 	const firstNameField = document.getElementById('form_b1262bff-b9cd-498a-b21d-f45d40033027');
	bait.addEventListener('focus', function(e) {
		rfibarnew.classList.add('active');
	})
	closeForm.addEventListener('click', function(e) {
		rfibarnew.classList.toggle('active');
	})
	const heroRequestInformation = document.getElementById('hero-request-information');
	if (heroRequestInformation) {
		heroRequestInformation.addEventListener('click', function(e) {
			e.preventDefault();
			rfibarnew.classList.add('active');
			rfibarnew.scrollIntoView({behavior: "smooth",});
// 			if (firstNameField) {
// 				firstNameField.focus();
// 			}
		})
	}
}


// Omni CMS Personalization Form Data Grabber
function waitForElm(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}   

waitForElm('.form_button_submit').then((elm) => {
	const submit_btn = document.querySelector(".form_button_submit");
	const formPages = document.querySelectorAll(".form_page:not(.form_page_1)");
	const omni_forms = submit_btn.form;

	// Hide Submit Button when no "Person Type" selected
	const callBackTest = (mutationList, observer) => {
		if ([...formPages].every(elem => elem.classList.contains('hidden'))) {
			submit_btn.classList.add('btnHidden');
		} else {
			submit_btn.classList.remove('btnHidden');
		}
	};

	const observer = new MutationObserver(callBackTest);
	formPages.forEach((elem) => {
		observer.observe(elem, { attributes: true })
	});

	function postOmniCMSData(e) {
		let els = Array.from(omni_forms.elements);
		els = els.filter(el => { return el.getAttribute('id') == 'form_b33f79ef-48fc-481a-87e5-2b04ba062cea'; });
		let email;
		els.forEach(el => { email = el.value; });
		if (email) {
			document.cookie = "userId=" + email + "; expires=Thu, 30 Dec 2038 12:00:00 UTC; path=/";
			if (typeof _paq !== 'undefined') {
				_paq.push(['setUserId', email]);
				_paq.push(['trackPageView']);
			}

		}
	}

	submit_btn.addEventListener("click", e => { postOmniCMSData(e); });
});