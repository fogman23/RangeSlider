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
		let lowerRange = 30 // значение бегунка минимума
		let upperRange = 60 // значение бегунка максимума
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
		
		let target = that.target = createAndPaste(cssClasses.target, rootObject)
		let base = that.base = createAndPaste(cssClasses.base, target)
		let baseWidth = that.baseWidth = () => base.offsetWidth
		let baseHeight = that.baseHeight = () => base.offsetHeight
		let connects = that.connects = createAndPaste(cssClasses.connects, base)
		let connect = that.connect = createAndPaste(cssClasses.connect, connects)

		let percentage = that.percentage = function () {
			if (orientation === "horizontal") {
				return base.offsetWidth / range // процентное соотношение длины линии относительное заданного диапазона
			} else {
				return base.offsetHeight / range // процентное соотношение высоты линии относительное заданного диапазона
			}
		}

		function addOrientation(orientation) {
			if (orientation === "horizontal") {
				addClass(target, cssClasses.cssPrefix + cssClasses.horizontal)
			} else {
				addClass(target, cssClasses.cssPrefix + cssClasses.vertical)
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

		let setPosition = that.setPosition = function (lowerRange, upperRange, percentage) { // функция установки  бегунков в заданное положение
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

		setPosition(lowerRange, upperRange, percentage())


		let setConnect = that.setConnect = function (connect, minValue, maxValue, orientation, typeRange, baseWidth, baseHeight) { // функция изменяющая внутреннюю полосу минимума и максимума
			if (orientation === "horizontal") {
				if (typeRange === "double") {
					connect.style.left = minValue + 'px'
					connect.style.width = maxValue - minValue + 'px'
				}
				if (typeRange === "single") {
					if (typeConnect === "lower") {
						connect.style.width = minValue + 'px'
					} else {
						connect.style.left = minValue + 'px'
						connect.style.width = baseWidth - minValue + 'px'
					}
				}
			} else {
				if (typeRange === "double") {
					connect.style.top = minValue + 'px'
					connect.style.height = maxValue - minValue + 'px'
				}
				if (typeRange === "single") {
					if (typeConnect === "lower") {
						connect.style.height = minValue + 'px'
					} else {
						connect.style.top = minValue + 'px'
						connect.style.width = baseHeight - minValue + 'px'
					}
				}
			}

			if (tooltip) {
				if (typeRange === "double") {
					if (connect.offsetWidth < tooltipMin.offsetWidth && connect.offsetHeight < tooltipMin.offsetHeight) {
						tooltipConnect.style.visibility = "visible"
						tooltipMin.style.visibility = tooltipMax.style.visibility = "hidden"
					} else {
						tooltipConnect.style.visibility = "hidden"
						tooltipMin.style.visibility = tooltipMax.style.visibility = "visible"
					}
				} else {
					tooltipMin.style.visibility = "visible"
				}
			}
		}

		setConnect(connect, minValue, maxValue, orientation, typeRange, baseWidth(), baseHeight())

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

		let minValue = view.minValue
		let maxValue = view.maxValue
		let percentage = view.percentage()
		let connect = view.connect
		let tooltip = view.tooltip
		let tooltipMin = view.tooltipMin
		let tooltipMax = view.tooltipMax
		let tooltipConnect = view.tooltipConnect
		let maxRange = model.getProps.maxRange
		let minRange = model.getProps.minRange
		let lowerRange = model.getProps.lowerRange
		let upperRange = model.getProps.upperRange
		let typeRange = view.typeRange
		let orientation = view.orientation
		let base = view.base
		let baseWidth = view.baseWidth()
		let baseHeight = view.baseHeight()
		let step = model.getProps.step
		let originMin = view.originMin
		let originMax = view.originMax

		function getCoords(elem) { // функция получения координат элемента
			let box = elem.getBoundingClientRect()
			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			}
		}

		function whichHandle(handle) { // функция определения бегунка
			if (hasClass(handle, cssClasses.cssPrefix + cssClasses.handleLower)) return 1
			if (hasClass(handle, cssClasses.cssPrefix + cssClasses.handleUpper)) return 2
		}

		function limitMove(coords, handle) { // функция ограничения перемещения бегунка в пределах рабочей области
			coords < 0 ? coords = 0 : coords
			if (typeRange === "double") {
				if (whichHandle(handle) === 1) coords > maxValue ? coords = maxValue : coords
				if (whichHandle(handle) === 2) coords < minValue ? coords = minValue : coords
			} else {
				coords > baseWidth ? coords = baseWidth : coords
			}
			if (orientation === "horizontal") {
				coords > baseWidth ? coords = baseWidth : coords
			} else {
				coords > baseHeight ? coords = baseHeight : coords
			}
			return coords
		}

		function handleMove(coords, handle) { // функция перемещения бегунка
			if (orientation === "horizontal") {
				if (whichHandle(handle) === 1) {
					originMin.style.left = coords + 'px'
				} else {
					originMax.style.left = coords + 'px'
				}
			} else {
				if (whichHandle(handle) === 1) {
					originMin.style.top = coords + 'px'
				} else {
					originMax.style.top = coords + 'px'
				}
			}
			return coords
		}

		function getOffset (e, step) {
			let stepPxW = baseWidth / ((maxRange - minRange) / step)
			let stepPxH = baseHeight / ((maxRange - minRange) / step)
			let move, moveStep
			if (orientation === "horizontal") {
				move = e.pageX - getCoords(base).left
				step ? moveStep = Math.round(move / stepPxW) * stepPxW : moveStep = null
			} else {
				move = e.pageY - getCoords(base).top
				step ? moveStep = Math.round(move / stepPxH) * stepPxH : moveStep = null
			}
			return step ? moveStep : move
		}

		function convertValue (value) {
			return Math.round(value / percentage) + minRange
		}

		// view.values.forEach((e) => {
		// 	e.addEventListener("click", (e) => {
		// 		console.log(e.target) 
		// 	})
		// })

		let eventStart = function (e) { // событие нажатия на бегунок
			let handle = this

			addClass(handle, cssClasses.cssPrefix + cssClasses.active)

			let eventMove = function (e) { // событие перемещения бегунка
				let move = getOffset(e, step)

				if (whichHandle(handle) === 1) {
					move = limitMove(move, handle)
					minValue = handleMove(move, handle)
				}

				if (whichHandle(handle) === 2) {
					move = limitMove(move, handle)
					maxValue = handleMove(move, handle)
				}

				let newLowerRange = convertValue(minValue) // новое нижнее значение
				let newUpperRange = convertValue(maxValue) // новое верхнее значение

				model.setLowerRange(newLowerRange) // передача измененного значения в модель
				model.setUpperRange(newUpperRange) // передача измененного значения в модель

				view.setTooltip(tooltip, typeRange, tooltipMin, tooltipMax, tooltipConnect, newLowerRange, newUpperRange)
				view.setConnect(connect, minValue, maxValue, orientation, typeRange, baseWidth, baseHeight) // изменение внутренней полосы

				view.minValue = minValue
				view.maxValue = maxValue
			}

			document.addEventListener(actions.move, eventMove)

			let eventEnd = function () {
				document.removeEventListener(actions.start, eventStart)
				document.removeEventListener(actions.move, eventMove)
				removeClass(handle, cssClasses.cssPrefix + cssClasses.active)
			}

			document.addEventListener(actions.end, eventEnd)

			return false
		}

		window.onresize = function () { // при изменении ширины экрана изменяет положение бегунков
			let lowerRange = model.getProps.lowerRange
			let upperRange = model.getProps.upperRange
			let connect = view.connect
			let minValue = view.minValue
			let maxValue = view.maxValue
			let typeRange = view.typeRange
			let orientation = view.orientation
			let percentage = view.percentage()
			let baseWidth = view.baseWidth()
			let baseHeight = view.baseHeight()

			view.setPosition(lowerRange, upperRange, percentage)
			view.setConnect(connect, minValue, maxValue, orientation, typeRange, baseWidth, baseHeight)
			console.log()
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

	}



	const container = document.querySelector(".container")

	const model = new MVC.Model()
	const view = new MVC.View(model, container)
	const controller = new MVC.Controller(model, view)

})