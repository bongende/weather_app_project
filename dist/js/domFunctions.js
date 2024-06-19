export const addSpinner = (element) => {
	animateButton(element);
	setTimeout(animateButton, 1000, element);
};

const animateButton = (elt) => {
	elt.classList.toggle("none");
	elt.nextElementSibling.classList.toggle("block");
	elt.nextElementSibling.classList.toggle("none");
};
