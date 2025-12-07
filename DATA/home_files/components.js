// Remove .no-js class from html tag
document.querySelector("html").classList.remove("no-js");

// BEGIN Fade In On Scroll
function fadeObserverCallback(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("faded-in");
      fadeObserver.unobserve(entry.target);
    }
  });
}

const fadeObserverOptions = {
  root: null,
  rootMargin: "0px 0px -80px 0px",
  threshold: 0,
};

const fadeObserver = new IntersectionObserver(
  fadeObserverCallback,
  fadeObserverOptions,
);
const fadeComponents = document.querySelectorAll(
  ".component:not(.hero-component)",
);
fadeComponents.forEach((el) => fadeObserver.observe(el));
// END Fade In On Scroll

// BEGIN BTT Functionality
const backToTopElem = document.querySelector("#back-to-top");
// Show/Hide based on scroll position
function toggleBackToTop() {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    backToTopElem.classList.toggle("visually-hidden--focusable", false);
  } else {
    backToTopElem.classList.toggle("visually-hidden--focusable", true);
  }
}

if (backToTopElem) {
  // Check scroll position on load
  toggleBackToTop();

  // Add scroll event listener
  window.addEventListener("scroll", toggleBackToTop);
}
// END BTT Functionality

// BEGIN Sidenav Dropdown Functionality
function createSidenavDropdown(dropdownElem, index) {
	const hiddenList = dropdownElem.querySelector('ul');
	// Set states
	dropdownElem.setAttribute('aria-expanded', false);
	
	hiddenList.setAttribute('hidden', true);
	hiddenList.setAttribute('id', `sidenav-list-${index}`);
	hiddenList.setAttribute('aria-labelledby', `sidenav-title-${index}`);
	
	// Move title "a" elem and add button with icon
	const aElem = dropdownElem.firstChild;
	const buttonElem = document.createElement('button');
	const dropdownTitleElem = document.createElement('div');
	
	aElem.setAttribute('id', `sidenav-title-${index}`)
	dropdownTitleElem.setAttribute('name', 'dropdown-title');
	
	buttonElem.innerHTML = '<i class="fa-solid fa-chevron-right fa-lg" aria-hidden="true"></i>';
	buttonElem.setAttribute('aria-controls', `sidenav-list-${index}`);
	buttonElem.addEventListener("click", () => {
		dropdownElem.setAttribute('aria-expanded', dropdownElem.getAttribute('aria-expanded') == 'true' ? false : true);
		hiddenList.toggleAttribute('hidden');
	});
	
	dropdownTitleElem.append(aElem);
	dropdownTitleElem.append(buttonElem);
	
	dropdownElem.prepend(dropdownTitleElem);
}

// Get and create all sidenav dropdowns
document.querySelectorAll('.sidebar ul li.dropdown').forEach((elem, index) => createSidenavDropdown(elem, index));
// END Sidenav Dropdown Functionality

// Element Sorting Function
function sortItems(type, container, selector) {
  const alphabeticalSort = (a, b) => {
    if (selector) {
      return a.querySelector(selector).innerText >
        b.querySelector(selector).innerText
        ? 1
        : -1;
    } else {
      return a.innerText > b.innerText ? 1 : -1;
    }
  };
  if (type === "reverse") {
    for (var i = 1; i < container.childNodes.length; i++) {
      container.insertBefore(container.childNodes[i], container.firstChild);
    }
  } else if (type === "alphabetical") {
    [...container.children]
      .sort(alphabeticalSort)
      .forEach((node) => container.appendChild(node));
  }
}

// Component Sorting Function - uses sortItems()
function sortComponent(
  componentSelector,
  containerSelector,
  alphaSelector,
  ignoredSelector,
) {
  // Find all instances of component and loop through them
  const componentInstances = document.querySelectorAll(componentSelector);
  for (const inst of componentInstances) {
    // Find sort type from classlist
    const sortType = inst.classList.contains("reverse")
      ? "reverse"
      : inst.classList.contains("alphabetical")
        ? "alphabetical"
        : "chrono";
    // Sort instance if sortType is not chronological
    if (sortType !== "chrono") {
      // Select container to sort based on containerSelector value. If null select inst;
      const containerElement =
        containerSelector === null
          ? inst
          : inst.querySelector(containerSelector);
      // Select either First or Last element of inst based on ignoredSelector value.
      let ignoredElement = null;
      if (ignoredSelector === "first") {
        ignoredElement = containerElement.firstElementChild;
      } else if (ignoredSelector === "last") {
        ignoredElement = containerElement.lastElementChild;
      }

      if (ignoredElement) {
        // If exists: clone node and remove
        const ignoredNode = ignoredElement.cloneNode(true);
        ignoredElement.remove();
        // Sort Items
        sortItems(sortType, containerElement, alphaSelector);
        // Add node back
        if (ignoredSelector === "first") {
          containerElement.prepend(ignoredNode);
        } else {
          containerElement.append(ignoredNode);
        }
      } else {
        sortItems(sortType, containerElement, alphaSelector);
      }
    }
  }
}

// Sorting Calls - sortComponent(componentSelector, containerSelector, alphaSelector, ignoredSelector);
sortComponent("#c3", ".feature-thumbnail-list", "h3", null);
sortComponent("#c7", ".feature-tile", ".feature-title", null);
sortComponent("#c8", ".featured-list", null, null);
sortComponent("#c9", "div.fb", ".feature-title", null);
sortComponent("#c14", ".linklist", ".link-list-a", null);
sortComponent("#c155", ".thumbnail-links-parent", "h3", null);
sortComponent("#c18", ".card-grid", "h2", null);
sortComponent("#c19", ".allprofiles", "h3", null);
sortComponent("#c24", ".bio-cards-parent", "h3", null);
sortComponent("#c27", ".ltl-grid", ".ltl-title", null);
sortComponent("#c29", null, ".section-header", "first");
sortComponent("#c30", ".image-link-grid", "a", null);
sortComponent("#flipcards", ".flipcards-parent", "h3", "last");

// TODO: check if this is still needed
//For links where the user does not add a URL
let links = document.getElementsByTagName("a");
for (var i = 0, len = links.length; i < len; i++) {
  if (
    links[i].getAttribute("href") === "" ||
    links[i].getAttribute("href") === "#"
  ) {
    links[i].addEventListener("click", function () {
      event.preventDefault();
    });
  }
}

// BEGIN Breadcrumb Modification
// Show/Hide all but last li after ellipsis in breadcrumbs
function showHideItems(display) {
  // Get all li elements after one with class ellipsis
  const li = document.querySelectorAll(
    ".breadcrumbs .ellipsis ~ li[typeof='ListItem']",
  );
  // Loop through li elements and set aria-hidden
  // Ignore last li by subtracting one from length (because it is the current page and needs to be displayed)
  for (let i = 0; i < li.length - 1; i++) {
    li[i].setAttribute("aria-hidden", display ? "false" : "true");
  }

  // Get ellipsis li
  const ellipsis = document.querySelector(".breadcrumbs .ellipsis");
  // Add event listener
  ellipsis.addEventListener("click", function () {
    showHideItems(true);
  });
  // Set aria-hidden
  ellipsis.setAttribute("aria-hidden", display ? "true" : "false");
}

let breadcrumbElement = document.querySelector(".breadcrumbs");

if (breadcrumbElement) {
	// Set default state to show items
	showHideItems(true);
	
	let breadcrumbSize = breadcrumbElement.offsetWidth;
	let parentSize = breadcrumbElement.parentElement.offsetWidth;
	// Hide items if the breadcrumb size exceeds component size
	if (breadcrumbSize >= parentSize) {
		showHideItems(false);
	}
}
// END Breadcrumbs Modification

// Accordion
var accContainer = document.querySelectorAll("#c20");
// Find all Accordian components and loop through them
for (const acc of accContainer) {
  // Get buttons and add event listener for toggle
  var accButtons = acc.querySelectorAll(".accordion");
  var i;

  for (i = 0; i < accButtons.length; i++) {
    accButtons[i].addEventListener("click", function (e) {
      // e.preventDefault();
      e.currentTarget.classList.toggle("active");
      var panel = e.currentTarget.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }

  // Find sort type from classlist
  const sortType = acc.classList.contains("reverse")
    ? "reverse"
    : acc.classList.contains("alphabetical")
      ? "alphabetical"
      : "chrono";
  if (sortType !== "chrono") {
    // Check for Header Node
    const accHeader = acc.querySelector(".component-header");
    if (accHeader) {
      // If exists: clone node and remove
      const accHeaderNode = accHeader.cloneNode(true);
      accHeader.remove();
      // Sort Items
      sortItems(sortType, acc, ".accordion");
      // Add header node back
      acc.prepend(accHeaderNode);
    } else {
      // Sort Items
      sortItems(sortType, acc, ".accordion");
    }
  }
}
