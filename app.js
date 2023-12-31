let newGridSize = '0';
let currentMode = 'color-picker';

//add buttons to choose color
const colorSettings = [
	{ name: 'color-picker', colorSetter: pickColor },
	{ name: 'random', colorSetter: randomColor },
	{ name: 'darken', colorSetter: darkenColor },
	{ name: 'eraser', colorSetter: eraseColor },
	{ name: 'clear', colorSetter: clearGrid },
];

//create h1
const h1 = document.createElement('h1');
h1.textContent = 'Etch A Sketch';
h1.classList.add('h1');
document.body.appendChild(h1);

// create slider for drawGrid input paramter
const gridSizerContainer = document.createElement('div');
document.body.appendChild(gridSizerContainer);
gridSizerContainer.setAttribute('id', 'grid-sizer-container');
gridSizerContainer.setAttribute('class', 'grid-sizer-container');
const gridSizer = document.createElement('input');
gridSizer.setAttribute('type', 'range');
gridSizer.setAttribute('min', '2');
gridSizer.setAttribute('max', '30');
gridSizer.setAttribute('id', 'grid-sizer');
gridSizer.setAttribute('class', 'grid-sizer');
gridSizer.setAttribute('value', '3');
const gridSizerLabel = document.createElement('label');
gridSizerLabel.setAttribute('for', 'grid-sizer');
gridSizerLabel.setAttribute('id', 'grid-sizer-label');
gridSizerLabel.classList.add('grid-sizer-label');
const span = document.createElement('span');
span.textContent = `${gridSizer.value} x ${gridSizer.value}`;
gridSizerLabel.appendChild(span);
gridSizerContainer.appendChild(gridSizer);
gridSizerContainer.appendChild(gridSizerLabel);

//create layout for game (children: gameSettings, gameGrid)
const gameContainer = document.createElement('div');
gameContainer.classList.add('game-container');
document.body.appendChild(gameContainer);

// create game settings section
const gameSettings = document.createElement('section');
gameSettings.classList.add('game-settings');
gameContainer.appendChild(gameSettings);

// create color picker
const colorPicker = document.createElement('input');
colorPicker.setAttribute('type', 'color');
colorPicker.setAttribute('value', '#800080');
colorPicker.setAttribute('class', 'color-picker');
colorPicker.setAttribute('id', `${colorSettings[0].name}`);
gameSettings.appendChild(colorPicker);

// create color picking buttons
for (let i = 1; i < colorSettings.length; i++) {
	const elem = document.createElement('button');
	elem.textContent = colorSettings[i].name;
	elem.classList.add('color-setting');
	elem.setAttribute('id', colorSettings[i].name);
	gameSettings.appendChild(elem);
}

//create initial grid for game

const gameGrid = document.createElement('section');
let initialGridSize = gridSizer.value;
gameGrid.style.setProperty('--cssGridSize', initialGridSize);
gameGrid.classList.add('game-grid');

function drawGrid(initialGridSize) {
	let totalBoxesCount = initialGridSize * initialGridSize;
	for (let i = 1; i <= totalBoxesCount; i++) {
		const box = document.createElement('div');
		box.classList.add('box');
		box.setAttribute('style', 'background-color: rgb(250, 235, 215)');
		gameGrid.appendChild(box);
	}
}
drawGrid(initialGridSize);
gameContainer.appendChild(gameGrid);

// when the slider clicked, the gameGrid gets the new size
gridSizer.addEventListener('click', (e) => {
	newGridSize = e.target.value;
	gameGrid.style.setProperty('--cssGridSize', newGridSize);
	gameGrid.innerHTML = '';
	span.textContent = `${newGridSize} x ${newGridSize}`;
	drawGrid(newGridSize);
});


const buttons = document.querySelectorAll('.color-setting');

colorPicker.addEventListener('input', (e) => {
	if (currentMode != 'color-picker') {
		currentMode = 'color-picker';
		buttons.forEach((button) => button.classList.remove('active'));
	}
});

buttons.forEach((button) =>
	button.addEventListener('click', (e) => {
		currentMode = button.id;
		if (!button.classList.contains('active')) {
			buttons.forEach((otherButton) =>
				otherButton.classList.remove('active')
			);
			button.classList.add('active');
		}
		if (e.target.id === 'clear') {
			clearGrid(initialGridSize, newGridSize);
		}
	})
);

// draw lines in the grid
gameGrid.addEventListener('mouseover', drawLine);
function drawLine(e) {
	const square = e.target;
	const setColor = getColor(currentMode);
	setColor(square);
}

// return the function from the colorSettings array
function getColor(currentMode) {
	if (currentMode !== 'color-picker') {
		for (let i = 1; i < colorSettings.length; i++) {
			if (currentMode === colorSettings[i].name) {
				return colorSettings[i].colorSetter;
			}
		}
	}
	return colorSettings[0].colorSetter;
}

function pickColor(square) {
	square.style.backgroundColor = colorPicker.value;
}

function randomColor(square) {
	r = Math.floor(Math.random() * 255);
	g = Math.floor(Math.random() * 255);
	b = Math.floor(Math.random() * 255);
	square.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function eraseColor(square) {
	if (square.className === 'box' && currentMode === 'eraser') {
		square.style.backgroundColor = 'rgb(250, 235, 215)';
	}
}

function darkenColor(square) {
	let rgb = square.style.backgroundColor;
	let pattern = /(\d{1,3})/gm;
	let matches = rgb.match(pattern);
	const [initialRed, initialGreen, initialBlue] = matches.map(Number);

	let currentRed = initialRed;
	let currentGreen = initialGreen;
	let currentBlue = initialBlue;

	square.addEventListener('click', (e) => {
		// Calculate the new color values based on the percentage reduction
		let percentageValue = 10;
		currentRed -=
			currentRed >= 0 ? initialRed * (percentageValue / 100) : 0; // reduce currentRed value with 10% of the initial color if currentRed greater than or equal 0, otherwise reduce it with 0;
		currentGreen -=
			currentGreen >= 0 ? initialGreen * (percentageValue / 100) : 0;
		currentBlue -=
			currentBlue >= 0 ? initialBlue * (percentageValue / 100) : 0;
		square.style.backgroundColor = `rgb(${Math.round(currentRed)}, ${Math.round(currentGreen)}, ${Math.round(currentBlue)})`;
	});
}

function clearGrid() {
	gameGrid.innerHTML = '';
	const newGridSize = gridSizer.value;
	gameGrid.style.setProperty('--cssGridSize', newGridSize);
	drawGrid(newGridSize);
	span.textContent = `${newGridSize} x ${newGridSize}`;
}

const footer = document.createElement('div');
footer.setAttribute('class', 'footer');
const footerPara = document.createElement('p');
footerPara.innerHTML = `Made by <a href="https://www.linkedin.com/in/mihaly-ale">Mihaly Ale</a> for <a href="https://www.theodinproject.com/">TOP</a> Etch-A-Sketch.`;
footer.appendChild(footerPara);
gameContainer.parentNode.insertBefore(footer, gameContainer.nextSibling);
