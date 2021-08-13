// // Import jQuery module (npm i jquery)
// import $ from 'jquery'
// window.jQuery = $
// window.$ = $
// import 'jquery-ui'

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

document.addEventListener('DOMContentLoaded', () => {

	const cssClasses = {
		cssPrefix: "slider-",
		target: "target",
		base: "base",
		origin: "origin",
		handle: "handle",
		handleLower: "handle-lower",
		handleUpper: "handle-upper",
		touchArea: "touch-area",
		horizontal: "horizontal",
		vertical: "vertical",
		background: "background",
		connect: "connect",
		connects: "connects",
		ltr: "ltr",
		rtl: "rtl",
		textDirectionLtr: "txt-dir-ltr",
		textDirectionRtl: "txt-dir-rtl",
		draggable: "draggable",
		drag: "state-drag",
		tap: "state-tap",
		active: "active",
		tooltip: "tooltip",
		pips: "pips",
		pipsHorizontal: "pips-horizontal",
		pipsVertical: "pips-vertical",
		marker: "marker",
		markerHorizontal: "marker-horizontal",
		markerVertical: "marker-vertical",
		markerNormal: "marker-normal",
		markerLarge: "marker-large",
		markerSub: "marker-sub",
		value: "value",
		valueHorizontal: "value-horizontal",
		valueVertical: "value-vertical",
		valueNormal: "value-normal",
		valueLarge: "value-large",
		valueSub: "value-sub"
	}

	const MVC = {}

	MVC.Model = function () {
		let that = this

		let minRange = 0 // начальное значение диапазона
		let maxRange = 1000 // конечное значение диапазона
		let range = maxRange - minRange // длина диапазона
		let lowerRange = 200 // значение бегунка минимума
		let upperRange = 600 // значение бегунка максимума

		this.getRange = {
			minRange: minRange,
			maxRange: maxRange,
			lowerRange: lowerRange,
			upperRange: upperRange
		}

		this.setLowerRange = function (value) {
			that.lowerRange = value
		}

		this.setUpperRange = function (value) {
			that.upperRange = value
		}

	}

	MVC.View = function (model, rootObject) {
		let that = this

		function createAndPaste(className, ParentElement) {
			let d = document.createElement("div")
			d.classList.add(cssClasses.cssPrefix + className)
			ParentElement.append(d)
			return d
		}

		let target = that.target = createAndPaste(cssClasses.target, rootObject)
		let base = that.base = createAndPaste(cssClasses.base, target)
		let connects = that.connects = createAndPaste(cssClasses.connects, base)
		let connect = that.connect = createAndPaste(cssClasses.connect, connects)
		let originMin = that.originMin = createAndPaste(cssClasses.origin, base)
		let originMax = that.originMax = createAndPaste(cssClasses.origin, base)
		let handleMin = that.handleMin = createAndPaste(cssClasses.handle, originMin)
		handleMin.classList.add(cssClasses.cssPrefix + cssClasses.handleLower)
		let handleMax = that.handleMax = createAndPaste(cssClasses.handle, originMax)
		handleMax.classList.add(cssClasses.cssPrefix + cssClasses.handleUpper)
		let tooltipMin = that.tooltipMin = createAndPaste(cssClasses.tooltip, handleMin)
		let tooltipMax = that.tooltipMax = createAndPaste(cssClasses.tooltip, handleMax)
		let touchAreaMin = that.touchAreaMin = createAndPaste(cssClasses.touchArea, handleMin)
		let touchAreaMax = that.touchAreaMax = createAndPaste(cssClasses.touchArea, handleMax)

		let minRange = that.minRange = model.getRange.minRange
		let maxRange = that.maxRange = model.getRange.maxRange
		let range = that.range = maxRange - minRange
		let lowerRange = that.lowerRange = model.getRange.lowerRange
		let upperRange = that.upperRange = model.getRange.upperRange

		let percentage = that.percentage = base.offsetWidth / range // процентное соотношение длины линии относительное заданной длины диапазона

		function setPosSliderLower(num) { // функция установки минимального бегунка в заданное положение
			originMin.style.left = (num - minRange) * percentage + "px"
			return num
		}

		function setPosSliderUpper(num) { // функция установки маскимального бегунка в заданное положение
			originMax.style.left = (num - minRange) * percentage + "px"
			return num
		}

		let minValue = that.minValue = setPosSliderLower(lowerRange) // задание значения минимального бегунка
		let maxValue = that.maxValue = setPosSliderUpper(upperRange) // задание значения максимального бегунка

		let minValuePercentage = that.minValuePercentage = (minValue - minRange) * percentage // относительное значение минимального бегунка
		let maxValuePercentage = that.maxValuePercentage = (maxValue - minRange) * percentage // относительное значение максимального бегунка

		let setConnect = that.setConnect = function setConnect(connect, minValuePercentage, maxValuePercentage, percentage, range) { // функция изменяющая внутреннюю полосу минимума и максимума
			connect.style.transform = `
					translate(${minValuePercentage / percentage / range * 100}%)
					scale(${(maxValuePercentage / percentage / range) - (minValuePercentage / percentage / range)}, 1)
				`
		}

		setConnect(connect, minValuePercentage, maxValuePercentage, percentage, range)

		tooltipMin.innerText = minValue // запись значения в ярлык над минимальным бегунком
		tooltipMax.innerText = maxValue // запись значения в ярлык над максимальным бегунком

	}



	MVC.Controller = function (model, view) {

		const actions = {
			start: "mousedown",
			move: "mousemove",
			end: "mouseup"
		}

		let handleWidth = view.handleMin.offsetWidth

		let eventStart = function(e) {// событие нажатия на бегунок
			// событие перемещения бегунка
			let handleCoords = getCoords(view.originMin) // координаты бегунка
			let shiftX = e.pageX - handleCoords.left // отступ слева

			let eventMove = function(e) {

				let newLeft = e.pageX - shiftX - getCoords(view.base).left // положение относительно страницы
	
				if (newLeft < 0) { // если бегунок уперся в начало диапазона
					newLeft = 0
				}
	
				if (newLeft > view.maxValuePercentage - handleWidth) { // если бегунок уперся в другой бегунок
					newLeft = view.maxValuePercentage - handleWidth
				}
	
				view.minValuePercentage = newLeft // присвоение положения бегунка
				view.originMin.style.left = view.minValuePercentage + 'px' // изменение положения бегунка
	
				let newLowerRange = view.tooltipMin.innerText = Math.round(view.minValuePercentage / view.percentage) + view.minRange
				// изменение значения в ярлыке

				view.setConnect(view.connect, view.minValuePercentage, view.maxValuePercentage, view.percentage, view.range) // изменение внутренней полосы
	
				model.setLowerRange(newLowerRange) // передача измененного значения в модель
			}

			document.addEventListener(actions.move, eventMove)

			let eventEnd = function() {
				console.log(handleCoords.left, "координата минимуна")
				console.log(Math.round(view.minValuePercentage / view.percentage) + view.minRange, "Значение минимума")
				document.removeEventListener(actions.start, eventStart)
				document.removeEventListener(actions.move, eventMove)
			}

			document.addEventListener(actions.end, eventEnd)

			return false
		}

		view.originMin.addEventListener(actions.start, eventStart)

		

		view.originMin.ondragstart = function () {
			return false
		}

		view.originMax.addEventListener(actions.start, (e) => { // событие нажатия на бегунок
			let handleCoords = getCoords(view.originMax) // координаты бегунка
			let shiftX = e.pageX - handleCoords.left // отступ слева

			document.addEventListener(actions.move, (e) => { // событие перемещения бегунка
				let newLeft = e.pageX - shiftX - getCoords(view.base).left // положение относительно страницы

				if (newLeft < view.minValuePercentage + handleWidth) { // если бегунок уперся в другой бегунок
					newLeft = view.minValuePercentage + handleWidth
				}

				if (newLeft > view.base.offsetWidth) { // если бегунок уперся в конец диапазона
					newLeft = view.base.offsetWidth
				}

				view.maxValuePercentage = newLeft // присвоение положения бегунка
				view.originMax.style.left = view.maxValuePercentage + 'px' // изменение положения бегунка

				let newUpperRange = view.tooltipMax.innerText = Math.round(view.maxValuePercentage / view.percentage) + view.minRange // изменение значения в ярлыке

				view.setConnect(view.connect, view.minValuePercentage, view.maxValuePercentage, view.percentage, view.range) // изменение внутренней полосы

				model.setUpperRange(newUpperRange) // передача измененного значения в модель
			})

			document.addEventListener(actions.end, () => { // событие отжатия кнопки мыши
				console.log(handleCoords.left, "координата максимума")
				console.log(Math.round(view.maxValuePercentage / view.percentage) + view.minRange, "Значение максимума")
				document.onmousemove = document.onmouseup = null
			})

			return false
		})

		function getCoords(elem) { // функция получения координа элемента
			let box = elem.getBoundingClientRect()
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			}
		}
	}

	const container = document.querySelector(".container2")

	const model = new MVC.Model()
	const view = new MVC.View(model, container)
	const controller = new MVC.Controller(model, view)



	const slider = document.querySelector(".slider")
	const base = slider.querySelector(".slider-base")
	const connect = slider.querySelector(".slider-connect")
	const sliderLower = slider.querySelectorAll(".slider-origin")[0]
	const tooltipMin = sliderLower.querySelector(".slider-tooltip")
	const sliderUpper = slider.querySelectorAll(".slider-origin")[1]
	const tooltipMax = sliderUpper.querySelector(".slider-tooltip")
	const sliderWidth = slider.querySelector(".slider-handle").offsetWidth
	const sliderCoords = getCoords(base) // координаты полосы
	const start = parseInt(getComputedStyle(base).left) // координаты начала диапазона
	const end = base.offsetWidth // координаты конца диапазона

	let minRange = 500 // начальное значение диапазона
	let maxRange = 1000 // конечное значение диапазона
	let range = maxRange - minRange // длина диапазона
	let lowerRange = 800 // значение бегунка минимума
	let upperRange = 900 // значение бегунка максимума

	let percentage = base.offsetWidth / range // процентное соотношение длины линии относительное заданной длины диапазона

	function setPosSliderLower(num) { // функция установки минимального бегунка в заданное положение
		sliderLower.style.left = (num - minRange) * percentage + "px"
		return num
	}

	function setPosSliderUpper(num) { // функция установки маскимального бегунка в заданное положение
		sliderUpper.style.left = (num - minRange) * percentage + "px"
		return num
	}

	let minValue = setPosSliderLower(lowerRange) // задание значения минимального бегунка
	let maxValue = setPosSliderUpper(upperRange) // задание значения максимального бегунка

	let minValuePercentage = (minValue - minRange) * percentage // относительное значение минимального бегунка
	let maxValuePercentage = (maxValue - minRange) * percentage // относительное значение максимального бегунка

	function setConnect() { // функция изменяющая внутреннюю полосу минимума и максимума
		connect.style.transform = `
			translate(${minValuePercentage / percentage / range * 100}%)
			scale(${(maxValuePercentage / percentage / range) - (minValuePercentage / percentage / range)}, 1)
		`
	}

	setConnect() // изменение внутренней полосы при заданных начальных значениях

	console.log("Минимум - ", minValue, "; Максимум - ", maxValue)

	tooltipMin.innerText = minValue // запись значения в ярлык над минимальным бегунком
	tooltipMax.innerText = maxValue // запись значения в ярлык над максимальным бегунком

	sliderLower.onmousedown = function (e) { // событие нажатия на бегунок
		let handlerCoords = getCoords(sliderLower) // координаты бегунка
		let shiftX = e.pageX - handlerCoords.left // отступ слева

		document.onmousemove = function (e) { // событие перемещения бегунка

			let newLeft = e.pageX - shiftX - sliderCoords.left // положение относительно страницы

			if (newLeft < 0) { // если бегунок уперся в начало диапазона
				newLeft = 0
			}

			if (newLeft > maxValuePercentage - sliderWidth) { // если бегунок уперся в другой бегунок
				newLeft = maxValuePercentage - sliderWidth
			}

			minValuePercentage = newLeft // присвоение положения бегунка
			sliderLower.style.left = minValuePercentage + 'px' // изменение положения бегунка

			tooltipMin.innerText = Math.round(minValuePercentage / percentage) + minRange
			// изменение значения в ярлыке

			setConnect() // изменение внутренней полосы
		}

		document.onmouseup = function () { // событие отжатия кнопки мыши
			console.log(handlerCoords.left, "координата минимуна")
			console.log(Math.round(minValuePercentage / percentage) + minRange, "Значение минимума")
			document.onmousemove = document.onmouseup = null
		}

		return false
	}

	sliderLower.ondragstart = function () {
		return false
	}

	sliderUpper.onmousedown = function (e) { // событие нажатия на бегунок
		let handlerCoords = getCoords(sliderUpper) // координаты бегунка
		let shiftX = e.pageX - handlerCoords.left // отступ слева

		document.onmousemove = function (e) { // событие перемещения бегунка
			let newLeft = e.pageX - shiftX - sliderCoords.left // положение относительно страницы

			if (newLeft < minValuePercentage + sliderWidth) { // если бегунок уперся в другой бегунок
				newLeft = minValuePercentage + sliderWidth
			}

			if (newLeft > end) { // если бегунок уперся в конец диапазона
				newLeft = end
			}

			maxValuePercentage = newLeft // присвоение положения бегунка
			sliderUpper.style.left = maxValuePercentage + 'px' // изменение положения бегунка

			tooltipMax.innerText = Math.round(maxValuePercentage / percentage) + minRange // изменение значения в ярлыке

			setConnect() // изменение внутренней полосы
		}

		document.onmouseup = function () { // событие отжатия кнопки мыши
			console.log(handlerCoords.left, "координата максимума")
			console.log(Math.round(maxValuePercentage / percentage) + minRange, "Значение максимума")
			document.onmousemove = document.onmouseup = null
		}

		return false
	}

	function getCoords(elem) { // функция получения координа элемента
		let box = elem.getBoundingClientRect()
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		}
	}

})