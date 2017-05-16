var canvas = document.getElementById('canvasFx')
var ctx = canvas.getContext('2d')
var ctxInfo = document.getElementById('canvasInfo').getContext('2d')
var height = canvas.clientHeight
var width = canvas.clientWidth

var array = []
var distributionLaw = []
var Fx = []
var rightLimit = 100
var leftLimit = -rightLimit

var coef = 200
var xLocation = 10
var yLocation = height - coef
var axissLength = width

function drawAxiss() {
	let textCoef = 10
	let counter = Fx.length - 1
	drawLine(0, yLocation, axissLength, yLocation)
	drawLine(xLocation, 0, xLocation, axissLength)
	ctx.font = '16px serif'
	ctx.fillText('y', textCoef*2, textCoef)
	ctx.fillText('x', width - textCoef, yLocation - textCoef)
	ctx.fillText('0', textCoef*2, yLocation + textCoef*2)

	for(let element of Fx)
		counter = drawSegments(element, counter, textCoef)
}

function drawSegments(element, counter, textCoef) {
	let segment = element.segment
	let coef = 20
	let probabilityCoef = 100
	let circleRadius = 5
	console.log(segment)
	drawFxLine(
				   height - segment.begin*coef,
				   height - segment.end*coef,
				   element.p*probabilityCoef + yLocation - coef*5
			  )
	drawCircle(
				 	height - segment.end*coef,
					element.p*probabilityCoef + height - yLocation - coef*2.5,
					circleRadius,
					false
			  )
	drawCircle(
				 	height - segment.begin*coef,
					element.p*probabilityCoef + height - yLocation - coef*2.5,
					circleRadius,
					true
		      )
	ctx.fillText(
					'|' + Fx[counter--].segment.end,
					height - segment.begin*coef,
					yLocation + textCoef*2
				)
	if(element.p != 0)
		ctx.fillText(
						roundPlus(element.p, 1),
						textCoef*2,
						yLocation - element.p*100
					)
	return counter
}

function drawCircle(x, y, circleRadius, fill) {
	ctx.beginPath();
	ctx.arc(x, y, circleRadius, 0, 2*Math.PI, false)
	ctx.fillStyle = 'red'
	fill ? ctx.fill() : ctx.stroke()
	ctx.fillStyle = 'black'
}

function roundPlus(number, decimalPlaces) {
	if(isNaN(number) || isNaN(decimalPlaces))
		return false
	let coef = Math.pow(10, decimalPlaces)
	return Math.round(number*coef)/coef
}

function drawFxLine(beg, end, p) {
	ctx.strokeStyle = 'red'
	ctx.beginPath();
	ctx.moveTo(beg,p);
	ctx.lineTo(end, p);
	ctx.stroke();
}

function drawLine(x0, y0, x1, y1) {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

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
	let addCoef = 20
	let lineY = addCoef
	ctxInfo.font = '16px serif'
	ctxInfo.fillText('Arrays', lineY, addCoef)
	lineY += addCoef
	while(counter < numberSorting) {
		let permutations

		setArray(elementsNumber, min, max)
		ctxInfo.fillText('Unsorted', addCoef, lineY += addCoef)
		drawArray(array, lineY += addCoef)

		ctxInfo.fillText('Sorted', addCoef, lineY += addCoef)
		element = shellSort(array)
		drawArray(array, lineY += addCoef)

		console.log(element.perm)
		permutationsArray.push(element.perm)
		console.log(element.arr)
		array = []
		lineY += addCoef
		counter++
	}
	element = shellSort(permutationsArray)
	combineRepeats(element.arr)
	console.log(distributionLaw)
}

function drawArray(inputArray, lineY) {
	let rowCounter = 10
	for(let number of inputArray) {
		ctxInfo.fillText(number + ' | ', rowCounter += 30, lineY)
	}
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
drawAxiss()
