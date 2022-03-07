window.onload = function () {
	document.getElementById('loader').style.display = 'none'
}
function displayLoader() {
	document.getElementById('loader').style.display = 'block'
}
function hideLoader() {
	document.getElementById('loader').style.display = 'none'
}

const selectCountries = document.querySelector('#places')
const todayCases = document.querySelector('#todayCases')
const totalCases = document.querySelector('#totalCases')
const todayRecovered = document.querySelector('#todayRecovered')
const totalRecovered = document.querySelector('#totalRecovered')
const todayDeaths = document.querySelector('#todayDeaths')
const totalDeaths = document.querySelector('#totalDeaths')
const covidCases = document.querySelector('#covidCases')
const covidRecoveries = document.querySelector('#covidRecoveries')
const covidDeaths = document.querySelector('#covidDeaths')
const tableCases = document.querySelector('#table')
const ctx = document.querySelector('#myChart')
let chartCountryCode = 'worldwide'
let myChart, map

const countryData = {
	varLongitude: 0,
	varLatitude: 0,
	varCountryName: '',
	varCountryFlag: '',
	varDeaths: 0,
	varAllCases: 0,
	varRecovered: 0,
}
const casesTypeColors = {
	cases: {hex: '#0066ff', rgba: 'rgba(0, 102, 255, 0.4)', multiplier: 300},
	recovered: {
		hex: '#008000',
		rgba: 'rgba(0, 128, 0, 0.4)',
		multiplier: 300,
	},
	deaths: {
		hex: '#fb4443',
		rgba: 'rgba(251, 67, 67, 0.4)',
		multiplier: 600,
	},
}

//fetch all covid cases
async function fetchAllCovidCases() {
	const response = await fetch(`https://disease.sh/v3/covid-19/countries`)
	const data = await response.json()

	// loop over data and get the country name and country iso2 "uk, us ..."
	const countries = data.map(function (country) {
		return {
			name: country.country,
			value: country.countryInfo.iso2,
			cases: country.cases,
		}
	})
	showOnMap(data, 'cases')
	populateOptions(countries)
	populateTable(countries)
	// console.log('countries fetched: ', data)
}

fetchAllCovidCases()
//show all recovered cases
async function fetchAllRecoveredCases() {
	const response = await fetch(`https://disease.sh/v3/covid-19/countries`)
	const data = await response.json()

	// loop over data and get the country name and country iso2 "uk, us ..."
	const countries = data.map(function (country) {
		return {
			name: country.country,
			value: country.countryInfo.iso2,
			cases: country.cases,
		}
	})
	showOnMap(data, 'recovered')
	populateOptions(countries)
	populateTable(countries)
	// console.log('countries fetched: ', data)
}

//fetch all death cases
async function fetchAllDeathCases() {
	const response = await fetch(`https://disease.sh/v3/covid-19/countries`)
	const data = await response.json()

	// loop over data and get the country name and country iso2 "uk, us ..."
	const countries = data.map(function (country) {
		return {
			name: country.country,
			value: country.countryInfo.iso2,
			cases: country.cases,
			flag: country.countryInfo.flag,
		}
	})
	showOnMap(data, 'deaths')
	populateOptions(countries)
	populateTable(countries)
	// console.log('countries fetched: ', data[0].countryInfo.flag)
}

//create options
function populateOptions(countries) {
	countries.map(function (country) {
		const option = document.createElement('option')
		option.innerText = country.name
		option.setAttribute('value', country.value)
		selectCountries.appendChild(option)
	})
}
//populate table
function populateTable(countries) {
	countries.map(function (country) {
		const tableRow = document.createElement('tr')
		const countryName = document.createElement('td')
		countryName.innerText = country.name
		const countryCases = document.createElement('td')
		countryCases.innerText = country.cases
		tableRow.appendChild(countryName)
		tableRow.appendChild(countryCases)
		tableCases.appendChild(tableRow)
	})
}

async function fetchWorldwide() {
	const response = await fetch('https://disease.sh/v3/covid-19/all')
	const data = await response.json()
	todayCases.innerText = `+${data.todayCases}`
	totalCases.innerText = `${data.cases} Total`
	todayRecovered.innerText = `+${data.todayRecovered}`
	totalRecovered.innerText = `${data.recovered} Total`
	todayDeaths.innerText = `+${data.todayDeaths}`
	totalDeaths.innerText = `${data.deaths} Total`
	//console.log('worldwide data: ', data)
}

fetchWorldwide()

async function countryChange(event) {
	const countryCode = event.target.value
	console.log('countryCode is: ', countryCode)
	myChart.destroy()

	const url =
		countryCode === 'worldwide'
			? 'https://disease.sh/v3/covid-19/all'
			: `https://disease.sh/v3/covid-19/countries/${countryCode}`
	//fetch data for each country selected
	const response = await fetch(url)
	const data = await response.json()
	todayCases.innerText = `+${data.todayCases}`
	totalCases.innerText = `${data.cases} Total`
	todayRecovered.innerText = `+${data.todayRecovered}`
	totalRecovered.innerText = `${data.recovered} Total`
	todayDeaths.innerText = `+${data.todayDeaths}`
	totalDeaths.innerText = `${data.deaths} Total`
	if (countryCode === 'worldwide') {
		setAllCasesCircles()
		fetchAllCasesForChart()
	} else {
		showOneCountryOnMap(data)
		chartCountryCode = countryCode
		console.log('chartCountryCode inside else:', chartCountryCode)
	}
	// map.remove()
}
console.log('chartCountryCode:', chartCountryCode)
//show single country on map
function showOneCountryOnMap(data) {
	const container = document.createElement('section')
	container.classList.add('info__container')
	const flag = document.createElement('img')
	flag.src = data.countryInfo.flag
	flag.classList.add('info__flag')
	// create function to generate DOM elements
	const countryName = document.createElement('h4')
	countryName.classList.add('info__name')
	countryName.innerText = data.country

	const cases = document.createElement('p')
	cases.classList.add('info__confirmed')
	cases.innerText = `Cases: ${data.cases}`

	const recovered = document.createElement('p')
	recovered.classList.add('info__recovered')
	recovered.innerText = `Recovered: ${data.recovered}`

	const deaths = document.createElement('p')
	deaths.classList.add('info__deaths')
	deaths.innerText = `Deaths: ${data.deaths}`
	countryData.varLatitude = data.countryInfo.lat
	countryData.varLongitude = data.countryInfo.long
	countryData.varCountryFlag = data.countryInfo.flag
	countryData.varDeaths = data.deaths
	countryData.varAllCases = data.cases
	countryData.varRecovered = data.recovered
	countryData.varCountryName = data.country

	container.append(flag, countryName, cases, recovered, deaths) //flag,
	map.remove()
	createOneCountryMap(data.countryInfo.lat, data.countryInfo.long)
	L.circle([data.countryInfo.lat, data.countryInfo.long], {
		radius: Math.sqrt(data.cases) * casesTypeColors.cases.multiplier,
	})
		.setStyle(
			{color: casesTypeColors.cases.hex},
			{fillColor: casesTypeColors.cases.hex},
			{fillOpacity: 0.4}
		)
		.addTo(map)
		.bindPopup(container)
		.openPopup()
	// .closePopup()
}
console.log('country longitude: ', countryData.varLongitude)
console.log('country latitude: ', countryData.varLatitude)

//show data on map
function showOnMap(data, casesType) {
	const countryPopup = data.map(function (country) {
		const container = document.createElement('section')
		container.classList.add('info__container')
		const flag = document.createElement('img')
		flag.src = country.countryInfo.flag
		flag.classList.add('info__flag')
		//create function to generate DOM elements
		const countryName = document.createElement('h4')
		countryName.classList.add('info__name')
		countryName.innerText = country.country

		const cases = document.createElement('p')
		cases.classList.add('info__confirmed')
		cases.innerText = `Cases: ${country.cases}`

		const recovered = document.createElement('p')
		recovered.classList.add('info__recovered')
		recovered.innerText = `Recovered: ${country.recovered}`

		const deaths = document.createElement('p')
		deaths.classList.add('info__deaths')
		deaths.innerText = `Deaths: ${country.deaths}`
		container.append(flag, countryName, cases, recovered, deaths)
		L.circle([country.countryInfo.lat, country.countryInfo.long], {
			radius:
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier,
		})
			.setStyle(
				{color: casesTypeColors[casesType].hex},
				{fillColor: casesTypeColors[casesType].hex},
				{fillOpacity: 0.4}
			)
			.addTo(map)
			.bindPopup(container)
			.openPopup()
			.closePopup()
	})

	if (!countryPopup) {
		displayLoader()
	}
	hideLoader()
	return countryPopup
}

// *************************map*******

// create initial map
function createMap() {
	map = L.map('map').setView([40, 40], 3)
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
	//   let country = L.marker([ lat, long ])
	//   country.addTo(map)
}
function createOneCountryMap(lat, long) {
	map = L.map('map').setView([lat, long], 3)
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
	//   let country = L.marker([ lat, long ])
	//   country.addTo(map)
}

createMap()

async function setAllCasesCircles() {
	// displayLoader()
	console.log('clicked case')
	myChart.destroy()
	if (chartCountryCode === 'worldwide') {
		map.remove()
		// map.remove()

		createMap()
	} else {
		map.remove()

		console.log(
			'country longitude inside else all cases: ',
			countryData.varLongitude
		)
		console.log(
			'country latitude inside else all cases: ',
			countryData.varLatitude
		)
		createOneCountryMap(countryData.varLatitude, countryData.varLongitude)
	}

	await fetchAllCovidCases()
	await fetchAllCasesForChart()
}
async function setRecoveredCircles() {
	// displayLoader()
	console.log('clicked recovered')
	myChart.destroy()
	// map.remove()
	if (chartCountryCode === 'worldwide') {
		map.remove()

		createMap()
	} else {
		map.remove()

		console.log(
			'country longitude inside else recoveered: ',
			countryData.varLongitude
		)
		console.log(
			'country latitude inside else recoveered: ',
			countryData.varLatitude
		)
		createOneCountryMap(countryData.varLatitude, countryData.varLongitude)
	}

	await fetchAllRecoveredCases()
	await fetchRecoveredForChart()
}
async function setDeathsCircles() {
	console.log('clicked deaths')
	myChart.destroy()
	// displayLoader()
	// map.remove()
	if (chartCountryCode === 'worldwide') {
		map.remove()

		createMap()
	} else {
		createOneCountryMap(countryData.varLatitude, countryData.varLongitude)
		map.remove()

		console.log(
			'country longitude inside else deaths: ',
			countryData.varLongitude
		)
		console.log(
			'country latitude inside else deaths: ',
			countryData.varLatitude
		)
	}
	await fetchAllDeathCases()
	await fetchDeathsForChart()
}

selectCountries.addEventListener('change', countryChange)
covidCases.addEventListener('click', setAllCasesCircles)
covidRecoveries.addEventListener('click', setRecoveredCircles)
covidDeaths.addEventListener('click', setDeathsCircles)

// **************chart*********
//fetch data for chart

//fetch all cases for chart
async function fetchAllCasesForChart() {
	// if (code === 'worldwide') {
	const response = await fetch(
		'https://disease.sh/v3/covid-19/historical/all?lastdays=60'
	)
	const data = await response.json()
	// console.log('data worldwide all cases: ', data)

	convertCaseTypesForChart(data, 'cases')
}
fetchAllCasesForChart()

//fetch recovered cases for chart

async function fetchRecoveredForChart() {
	// if (code === 'worldwide') {
	const response = await fetch(
		'https://disease.sh/v3/covid-19/historical/all?lastdays=60'
	)
	const data = await response.json()
	// console.log('data worldwide recovered: ', data)
	convertCaseTypesForChart(data, 'recovered')
}

//fetch deaths cases for chart

async function fetchDeathsForChart() {
	// if (code === 'worldwide') {
	const response = await fetch(
		'https://disease.sh/v3/covid-19/historical/all?lastdays=60'
	)
	const data = await response.json()
	// console.log('data worldwide deaths: ', data)

	convertCaseTypesForChart(data, 'deaths')
} ////duplicate

function convertCaseTypesForChart(data, casesType) {
	let chartData = []
	let lastDataPoint
	for (let date in data[casesType]) {
		if (lastDataPoint) {
			const newDataPoint = {
				x: date,
				y: data[casesType][date] - lastDataPoint,
			}
			chartData = [...chartData, newDataPoint]
		}
		lastDataPoint = data[casesType][date]
	}

	//create chart

	myChart = new Chart(ctx, {
		type: 'line',

		data: {
			datasets: [
				{
					fill: true,
					backgroundColor: casesTypeColors[casesType].rgba,
					borderColor: casesTypeColors[casesType].hex,
					borderWidth: 3,
					data: chartData,
				},
			],
		},
		options: {
			plugins: {
				legend: {
					display: false,
					label: '',
				},
			},
			elements: {
				point: {
					radius: 0,
				},
			},
			interaction: {
				intersect: false,
			},
		},
	})
}
