// // Import jQuery module (npm i jquery)
// import $ from 'jquery'
// window.jQuery = $
// window.$ = $
// import 'jquery-ui'

// // Import vendor jQuery plugin example (not module)
// require('~/app/libs/mmenu/dist/mmenu.js')

document.addEventListener('DOMContentLoaded', () => {

	const slider = document.querySelector(".slider")
	const base = slider.querySelector(".slider-base")
	const connect = slider.querySelector(".slider-connect")
	const sliderLower = slider.querySelectorAll(".slider-origin")[0]
	const tooltipMin = sliderLower.querySelector(".slider-tooltip")
	const sliderUpper = slider.querySelectorAll(".slider-origin")[1]
	const tooltipMax = sliderUpper.querySelector(".slider-tooltip")
	const sliderWidth = slider.querySelector(".slider-handler").offsetWidth
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