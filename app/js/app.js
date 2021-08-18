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

	function addClass(el, className) {
		if (el.classList) {
			el.classList.add(className)
		} else {
			el.className += " " + className
		}
	}

	function removeClass(el, className) {
		if (el.classList) {
			el.classList.remove(className)
		} else {
			el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ")
		}
	}

	function hasClass(el, className) {
		return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b")
	}

	function removeElement(el) {
		el.parentElement.removeChild(el)
	}

	function createAndPaste(className, ParentElement) {
		let d = document.createElement("div")
		addClass(d, cssClasses.cssPrefix + className)
		ParentElement.append(d)
		return d
	}

	const MVC = {}

	MVC.Model = function () {
		let that = this

		let minRange = 0 // начальное значение диапазона
		let maxRange = 100 // конечное значение диапазона
		let lowerRange = 0 // значение бегунка минимума
		let upperRange = 100 // значение бегунка максимума
		let step = 4 // размер шага
		let tooltip = true // ярлыки над бегунками
		let pips = true // шкала со значениями
		let orientation = "horizontal" // ориентация "horizontal" & "vertical"
		let typeRange = "double" // для одного значения "single" для диапазона "double"
		let typeConnect = "lower" // если "lower" то прогресс бар с левой стороны, а если "upper" с правой стороны

		this.setLowerRange = function (value) {
			this.getProps.lowerRange = value
		}

		this.setUpperRange = function (value) {
			this.getProps.upperRange = value
		}

		this.getProps = {
			minRange: minRange,
			maxRange: maxRange,
			lowerRange: lowerRange,
			upperRange: upperRange,
			tooltip: tooltip,
			orientation: orientation,
			typeRange: typeRange,
			typeConnect: typeConnect,
			step: step,
			pips: pips,
		}

	}

	MVC.View = function (model, rootObject) {
		let that = this

		let minRange = that.minRange = model.getProps.minRange
		let maxRange = that.maxRange = model.getProps.maxRange
		let range = that.range = maxRange - minRange
		let lowerRange = that.lowerRange = model.getProps.lowerRange
		let upperRange = that.upperRange = model.getProps.upperRange
		let tooltip = that.tooltip = model.getProps.tooltip
		let orientation = that.orientation = model.getProps.orientation
		let typeRange = that.typeRange = model.getProps.typeRange
		let typeConnect = that.typeConnect = model.getProps.typeConnect
		let pipsM = that.pipsM = model.getProps.pips

		let originMin, originMax, handleMin, handleMax
		let tooltipMin, tooltipMax, tooltipConnect, touchAreaMin, touchAreaMax
		let percentage

		let target = that.target = createAndPaste(cssClasses.target, rootObject)
		let base = that.base = createAndPaste(cssClasses.base, target)
		let connects = that.connects = createAndPaste(cssClasses.connects, base)
		let connect = that.connect = createAndPaste(cssClasses.connect, connects)

		function addOrientation(orientation) {
			if (orientation === "horizontal") {
				addClass(target, cssClasses.cssPrefix + cssClasses.horizontal)
				percentage = that.percentage = base.offsetWidth / range // процентное соотношение длины линии относительное заданного диапазона
			} else {
				addClass(target, cssClasses.cssPrefix + cssClasses.vertical)
				percentage = that.percentage = base.offsetHeight / range // процентное соотношение высоты линии относительное заданного диапазона
			}
		}

		addOrientation(orientation)

		function AddHandle(typeRange) {
			if (typeRange === "double") {
				originMin = that.originMin = createAndPaste(cssClasses.origin, base)
				originMax = that.originMax = createAndPaste(cssClasses.origin, base)
				handleMin = that.handleMin = createAndPaste(cssClasses.handle, originMin)
				addClass(handleMin, cssClasses.cssPrefix + cssClasses.handleLower)
				handleMax = that.handleMax = createAndPaste(cssClasses.handle, originMax)
				addClass(handleMax, cssClasses.cssPrefix + cssClasses.handleUpper)
				// touchAreaMin = that.touchAreaMin = createAndPaste(cssClasses.touchArea, handleMin)
				// touchAreaMax = that.touchAreaMax = createAndPaste(cssClasses.touchArea, handleMax)

			} else {
				originMin = that.originMin = createAndPaste(cssClasses.origin, base)
				handleMin = that.handleMin = createAndPaste(cssClasses.handle, originMin)
				addClass(handleMin, cssClasses.cssPrefix + cssClasses.handleLower)
				// touchAreaMin = that.touchAreaMin = createAndPaste(cssClasses.touchArea, handleMin)
			}
		}

		AddHandle(typeRange)

		function addTooltip(tooltip, typeRange) {
			if (tooltip) {
				if (typeRange === "double") {
					tooltipMin = that.tooltipMin = createAndPaste(cssClasses.tooltip, handleMin)
					tooltipMax = that.tooltipMax = createAndPaste(cssClasses.tooltip, handleMax)
					tooltipConnect = that.tooltipConnect = createAndPaste(cssClasses.tooltip, connect)
				} else {
					tooltipMin = that.tooltipMin = createAndPaste(cssClasses.tooltip, handleMin)
				}
			}
		}

		addTooltip(tooltip, typeRange)

		let minValue, maxValue

		let setPosition = that.setPosition = function (lowerRange, upperRange = null) { // функция установки  бегунков в заданное положение
			if (typeRange === "double") {
				orientation === "horizontal" ? originMin.style.left = (lowerRange - minRange) * percentage + "px" : originMin.style.top = (lowerRange - minRange) * percentage + "px"
				orientation === "horizontal" ? originMax.style.left = (upperRange - minRange) * percentage + "px" : originMax.style.top = (upperRange - minRange) * percentage + "px"
				minValue = that.minValue = (lowerRange - minRange) * percentage // относительное значение минимального бегунка
				maxValue = that.maxValue = (upperRange - minRange) * percentage // относительное значение максимального бегунка
				return minValue, maxValue
			} else {
				orientation === "horizontal" ? originMin.style.left = (lowerRange - minRange) * percentage + "px" : originMin.style.top = (lowerRange - minRange) * percentage + "px"
				minValue = that.minValue = (lowerRange - minRange) * percentage // относительное значение минимального бегунка
				return minValue
			}
		}

		setPosition(lowerRange, upperRange)


		let setConnect = that.setConnect = function (connect, minValue, maxValue, orientation) { // функция изменяющая внутреннюю полосу минимума и максимума
			if (orientation === "horizontal") {
				if (typeConnect === "lower" && typeRange === "single") {
					connect.style.width = minValue + 'px'
				} else {
					connect.style.left = minValue + 'px'
					connect.style.width = maxValue - minValue + 'px'
				}
			} else {
				connect.style.top = minValue + 'px'
				connect.style.height = maxValue - minValue + 'px'
			}
			if (tooltip && typeRange === "double" && connect.offsetWidth < tooltipMin.offsetWidth && connect.offsetHeight < tooltipMin.offsetHeight) {
				tooltipConnect.style.visibility = "visible"
				tooltipMin.style.visibility = tooltipMax.style.visibility = "hidden"
			} else {
				tooltipConnect.style.visibility = "hidden"
				tooltipMin.style.visibility = tooltipMax.style.visibility = "visible"
			}
		}

		setConnect(connect, minValue, maxValue, orientation)

		let setTooltip = that.setTooltip = function (tooltip, typeRange, tooltipMin, tooltipMax, tooltipConnect, lowerRange, upperRange) {
			if (tooltip) {
				if (typeRange === "double") {
					tooltipMin.innerText = lowerRange // запись значения в ярлык над минимальным бегунком
					tooltipMax.innerText = upperRange // запись значения в ярлык над максимальным бегунком
					tooltipConnect.innerHTML = lowerRange + " - " + upperRange
				} else {
					tooltipMin.innerText = lowerRange // запись значения в ярлык над минимальным бегунком
				}
			}
		}

		setTooltip(tooltip, typeRange, tooltipMin, tooltipMax, tooltipConnect, lowerRange, upperRange)

		let markers = that.markers = []
		let values = that.values = []
		let createMarkers = that.createMarkers = function () {
			let pips = createAndPaste(cssClasses.pips, target)

			if (orientation === "horizontal") {
				addClass(pips, cssClasses.cssPrefix + cssClasses.pipsHorizontal)
			} else {
				addClass(pips, cssClasses.cssPrefix + cssClasses.pipsVertical)
			}

			for (let i = 0; i < 26; i++) { // создание делений на шкале и добавление их массив
				d = document.createElement("div")
				markerNormal = d
				markerLarge = d

				addClass(markerNormal, cssClasses.cssPrefix + cssClasses.marker)
				addClass(markerNormal, cssClasses.cssPrefix + cssClasses.markerNormal)

				if (hasClass(pips, cssClasses.cssPrefix + cssClasses.pipsHorizontal)) {
					addClass(markerNormal, cssClasses.cssPrefix + cssClasses.markerHorizontal)
					markerNormal.style.left = i * 4 + "%"
				} else {
					addClass(markerNormal, cssClasses.cssPrefix + cssClasses.markerVertical)
					markerNormal.style.top = i * 4 + "%"
				}
				markers[i] = markerNormal

				if (i % 5 == 0) {
					addClass(markerLarge, cssClasses.cssPrefix + cssClasses.marker)
					addClass(markerLarge, cssClasses.cssPrefix + cssClasses.markerLarge)
					removeClass(markerLarge, cssClasses.cssPrefix + cssClasses.markerNormal)

					if (hasClass(pips, cssClasses.cssPrefix + cssClasses.pipsHorizontal)) {
						addClass(markerLarge, cssClasses.cssPrefix + cssClasses.markerHorizontal)
						markerLarge.style.left = i * 4 + "%"
					} else {
						addClass(markerLarge, cssClasses.cssPrefix + cssClasses.markerVertical)
						markerLarge.style.top = i * 4 + "%"
					}
					markers[i] = markerLarge

				}
			}

			for (let i = 0; i < 7; i++) { // создание значений для делений и добавление их в массив 
				d = document.createElement("div")
				valueLarge = d
				valueSub = d

				addClass(valueLarge, cssClasses.cssPrefix + cssClasses.value)
				addClass(valueLarge, cssClasses.cssPrefix + cssClasses.valueLarge)

				if (hasClass(pips, cssClasses.cssPrefix + cssClasses.pipsHorizontal)) {
					addClass(valueLarge, cssClasses.cssPrefix + cssClasses.valueHorizontal)
					valueLarge.style.left = i * 20 + "%"
				} else {
					addClass(valueLarge, cssClasses.cssPrefix + cssClasses.valueVertical)
					valueLarge.style.top = i * 20 + "%"
				}

				valueLarge.innerText = minRange + (range / 5 * i)
				values[i] = valueLarge
			}

			for (let i = 0; i < markers.length; i++) { // вставка в HTML делений и значений 
				const marker = markers[i]
				const value = values[i / 5]
				pips.append(marker)
				if (i % 5 == 0) {
					pips.append(value)
				}
			}

			return values

		}

		if (pipsM) createMarkers()

	}

	MVC.Controller = function (model, view) {

		const actions = {
			start: "mousedown",
			move: "mousemove",
			end: "mouseup",
			touchstar: "touchstart",
			touchmove: "touchmove",
			touchend: "touchend"
		}

		view.values.forEach((e) => {
			e.addEventListener("click", (e) => {

				// console.log(e.clientX - getCoords(view.base).left)
				
				let lowerRange = view.minValue / view.percentage
				let upperRange = view.maxValue / view.percentage

				if (e.target.innerText - lowerRange > e.target.innerText - upperRange) {
					model.setLowerRange(parseInt(e.target.innerText))
					view.setPosition(lowerRange, upperRange)
				} else {
					model.setUpperRange(parseInt(e.target.innerText))
					view.setPosition(lowerRange, upperRange)
				}
				view.setTooltip(view.tooltip, view.typeRange, view.tooltipMin, view.tooltipMax, view.tooltipConnect, lowerRange, upperRange)
				view.setConnect(view.connect, lowerRange, upperRange, view.orientation) // изменение внутренней полосы

				console.log(lowerRange)
				console.log(upperRange)
			})
		})

		let eventStart = function (e) { // событие нажатия на бегунок
			let handleCoords, shiftX, shiftY, step, stepCount, stepPxW, stepPxH
			let handle = this
			step = model.getProps.step
			console.log(step)
			if (step) {
				stepCount = (model.getProps.maxRange - model.getProps.minRange) / step
				stepPxW = view.base.offsetWidth / stepCount
				stepPxH = view.base.offsetHeight / stepCount
			}

			addClass(handle, cssClasses.cssPrefix + cssClasses.active)

			if (handle === view.handleMin) {
				handleCoords = getCoords(view.originMin) // координаты бегунка
				shiftX = e.pageX - handleCoords.left // отступ слева
				shiftY = e.pageY - handleCoords.top // отступ сверху
			} else {
				handleCoords = getCoords(view.originMax) // координаты бегунка
				shiftX = e.pageX - handleCoords.left // отступ слева
				shiftY = e.pageY - handleCoords.top // отступ сверху
			}

			let eventMove = function (e) { // событие перемещения бегунка
				let newLeft = e.pageX - shiftX - getCoords(view.base).left // положение относительно страницы слева
				let newTop = e.pageY - shiftY - getCoords(view.base).top // положение относительно страницы сверху
				let stepLeft, stepTop
				if (step) {
					stepLeft = Math.round(newLeft / stepPxW) * stepPxW
					stepTop = Math.round(newTop / stepPxH) * stepPxH
				}

				if (handle === view.handleMin) {

					if (step) {
						stepLeft < 0 ? stepLeft = 0 : stepLeft
						stepTop < 0 ? stepTop = 0 : stepTop
						if (view.typeRange === "double") {
							stepLeft > view.maxValue ? stepLeft = view.maxValue : stepLeft
							stepTop > view.maxValue ? stepTop = view.maxValue : stepTop
						} else {
							stepLeft > view.base.offsetWidth ? stepLeft = view.base.offsetWidth : stepLeft
							stepTop > view.base.offsetHeight ? stepTop = view.base.offsetHeight : stepTop
						}
						if (view.orientation === "horizontal") {
							view.originMin.style.left = stepLeft + 'px' // изменение положения бегунка
							view.minValue = stepLeft // присвоение положения бегунка
						} else {
							view.originMin.style.top = stepTop + 'px'
							view.minValue = stepTop
						}
					} else {
						newLeft < 0 ? newLeft = 0 : newLeft // если бегунок уперся в начало диапазона
						newTop < 0 ? newTop = 0 : newTop
						if (view.typeRange === "double") {
							newLeft > view.maxValue ? newLeft = view.maxValue : newLeft // если бегунок уперся в другой 
							newTop > view.maxValue ? newTop = view.maxValue : newTop
						} else {
							newLeft > view.base.offsetWidth ? newLeft = view.base.offsetWidth : newLeft // если бегунок уперся в конец диапазона
							newTop > view.base.offsetHeight ? newTop = view.base.offsetHeight : newTop
						}
						if (view.orientation === "horizontal") {
							view.originMin.style.left = newLeft + 'px' // изменение положения бегунка
							view.minValue = newLeft // присвоение положения бегунка
						} else {
							view.originMin.style.top = newTop + 'px'
							view.minValue = newTop
						}
					}

				} else {
					if (step) {
						stepLeft < view.minValue ? stepLeft = view.minValue : stepLeft
						stepTop < view.minValue ? stepTop = view.minValue : stepTop
						stepLeft > view.base.offsetWidth ? stepLeft = view.base.offsetWidth : stepLeft
						stepTop > view.base.offsetHeight ? stepTop = view.base.offsetHeight : stepTop
						if (view.orientation === "horizontal") {
							view.originMax.style.left = stepLeft + 'px' // изменение положения бегунка
							view.maxValue = stepLeft // присвоение положения бегунка
						} else {
							view.originMax.style.top = stepTop + 'px'
							view.maxValue = stepTop
						}
					} else {
						newLeft < view.minValue ? newLeft = view.minValue : newLeft // если бегунок уперся в другой бегунок
						newTop < view.minValue ? newTop = view.minValue : newTop
						newLeft > view.base.offsetWidth ? newLeft = view.base.offsetWidth : newLeft // если бегунок уперся в конец диапазона
						newTop > view.base.offsetHeight ? newTop = view.base.offsetHeight : newTop
						if (view.orientation === "horizontal") {
							view.originMax.style.left = newLeft + 'px' // изменение положения бегунка
							view.maxValue = newLeft // присвоение положения бегунка
						} else {
							view.originMax.style.top = newTop + 'px'
							view.maxValue = newTop
						}
					}

				}

				let newLowerRange = Math.round(view.minValue / view.percentage) + view.minRange // новое нижнее значение
				let newUpperRange = Math.round(view.maxValue / view.percentage) + view.minRange // новое верхнее значение

				view.setTooltip(view.tooltip, view.typeRange, view.tooltipMin, view.tooltipMax, view.tooltipConnect, newLowerRange, newUpperRange)

				model.setLowerRange(newLowerRange) // передача измененного значения в модель
				model.setUpperRange(newUpperRange) // передача измененного значения в модель

				view.setConnect(view.connect, view.minValue, view.maxValue, view.orientation) // изменение внутренней полосы

			}

			document.addEventListener(actions.move, eventMove)

			let eventEnd = function () {
				document.removeEventListener(actions.start, eventStart)
				document.removeEventListener(actions.move, eventMove)
				removeClass(handle, cssClasses.cssPrefix + cssClasses.active)
				// if (handle === view.handelMin) {
				// 	console.log(handleCoords.left, "координата минимуна")
				// 	console.log(Math.round(view.minValuePercentage / view.percentage) + view.minRange, "Значение минимума")
				// } else {
				// 	console.log(handleCoords.left, "координата максимума")
				// 	console.log(Math.round(view.maxValuePercentage / view.percentage) + view.minRange, "Значение максимума")
				// }
			}

			document.addEventListener(actions.end, eventEnd)

			return false
		}

		window.onresize = function () { // при изменении ширины экрана изменяет положение бегунков
			view.percentage = view.base.offsetWidth / view.range
			model.lowerRange = model.getProps.lowerRange
			model.upperRange = model.getProps.upperRange
			if (model.getProps.typeRange === "double") {
				view.minValuePercentage = (model.lowerRange - view.minRange) * view.percentage
				view.maxValuePercentage = (model.upperRange - view.minRange) * view.percentage
				view.setPositionLower(model.lowerRange, view.orientation, view.originMin, view.minRange, view.percentage)
				view.setPositionUpper(model.upperRange, view.orientation, view.originMax, view.minRange, view.percentage)
			} else {
				view.minValuePercentage = (model.lowerRange - view.minRange) * view.percentage
				view.setPositionLower(model.lowerRange, view.orientation, view.originMin, view.minRange, view.percentage)
			}
			view.setConnect(view.connect, view.minValuePercentage, view.maxValuePercentage, view.orientation)
		}

		if (model.getProps.typeRange === "double") {
			view.handleMin.addEventListener(actions.start, eventStart)
			view.handleMax.addEventListener(actions.start, eventStart)
			view.handleMin.ondragstart = () => false
			view.handleMax.ondragstart = () => false
		} else {
			view.handleMin.addEventListener(actions.start, eventStart)
			view.handleMin.ondragstart = () => false
		}

		function getCoords(elem) { // функция получения координат элемента
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



	//старый код без разделения на слои
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