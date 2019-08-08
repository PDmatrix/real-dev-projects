import config from "../config"

window.onload = () => {
	const calculate = () => {
		console.log("called")
		document.body.style.backgroundColor = "white";
		config.some(([w, h, c]) => {
			if (w >= window.innerWidth && h >= window.innerHeight) {
				document.body.style.backgroundColor = c;
				return true;
			}
			return false;
		})
	};
	calculate();
	window.addEventListener('resize', calculate);
};
