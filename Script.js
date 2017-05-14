var canvas = document.getElementById('canvasId');
var ctx = canvas.getContext('2d');
var height = canvas.clientHeight
var width = canvas.clientWidth

var array = []
var distributionLaw = []
var Fx = []
var rightLimit = 100
var leftLimit = -rightLimit;

var coef = 200
var xLocation = 10
var yLocation = height - coef
var axissLength = height

function drawFx() {

}

function drawAxiss() {
	drawLine(0, yLocation, axissLength, yLocation)
	drawLine(xLocation, 0, xLocation, axissLength)
}

function drawLine(x0, y0, x1, y1) {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

drawAxiss()

function fillFx() {
	let length = distributionLaw.length
	Fx.push({p: 0, segment: {begin: leftLimit, end: distributionLaw[0].x}})
	for(i = 1; i < length; i++) {
		let element = {}
		element.p = 0
		for(j = 0; j <= i - 1; j++) {
			element.p += distributionLaw[j].p
		}
		element.segment = {}
		element.segment.begin = distributionLaw[i - 1].x
		element.segment.end = distributionLaw[i].x
		Fx.push(element)
	}
	Fx.push( {
				p: 1,
				segment: {
							begin: distributionLaw[length - 1].x,
							end: rightLimit
						 }
			 }
		   )
	console.log(Fx)
}

function fillDistribution(numberSorting, elementsNumber, min, max) {
	let counter = 0
	let permutationsArray = []
	let element
	while(counter < numberSorting) {
		let permutations
		setArray(elementsNumber, min, max)
		element = shellSort(array)
		console.log(element.perm)
		permutationsArray.push(element.perm)
		console.log(element.arr)
		array = []
		counter++
	}
	element = shellSort(permutationsArray)
	combineRepeats(element.arr)
	console.log(distributionLaw)
}

function combineRepeats(permutationsArray) {
	let length = permutationsArray.length
	let empty = -1
	for(i = 0; i < length; i++) {
		let repeats = 1
		for(j = i; j < length; j++) {
			if(permutationsArray[i] == permutationsArray[j] &&
			   permutationsArray[j] != empty && i != j) {
				   permutationsArray[j] = empty
				   repeats++
			   }
		}
		if(permutationsArray[i] != empty)
			distributionLaw.push({x: permutationsArray[i], p: repeats/length})
	}
}

function setArray(number, min, max) {
	for(index = 0; index < number; index++)
		array.push(randFor(min, max))
}

function randFor(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function shellSort(inputArray) {
	let length = inputArray.length
	let coef = length / 2
	let permutations = 0
	while (coef > 0) {
		for (i = coef; i < length; i++) {
			let j = i
			let temp = inputArray[i]

			while (j >= coef && inputArray[j-coef] > temp) {
				inputArray[j] = inputArray[j-coef]
				permutations++
				j = j - coef
			}

			inputArray[j] = temp
		}
		coef = coef == 2 ? 1 : parseInt(coef*5 / 11)
	}
	return { perm: permutations, arr: inputArray }
}

fillDistribution(5, 10, 0, 10)
fillFx()
