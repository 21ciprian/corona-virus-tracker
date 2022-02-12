console.log('linked')
const selectCountries = document.querySelector('#select')
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

selectCountries.addEventListener('click', () => console.log('clicked select'))
function createMap() {
	map = L.map('map').setView([40, 40], 3)
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
	//   let country = L.marker([ lat, long ])
	//   country.addTo(map)
}
createMap()
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
	// showOnMap(data, 'cases')
	// populateOptions(countries)
	// populateTable(countries)
	console.log('countries fetched: ', data)
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
//create options for select component
function populateOptions(countries) {
	countries.map(function (country) {
		const option = document.createElement('option')
		option.innerText = country.name
		option.setAttribute('value', country.value)
		selectCountries.appendChild(option)
	})
}
//populate table with county names and covid cases
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
//display all covid cases
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
let latitude = 0
let longitude = 0
//fetch country on change
async function countryChange(event) {
	const countryCode = event.target.value
	console.log('countryCode is: ', countryCode)
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
		// fetchAllCasesForChart()
	} else {
		showOneCountryOnMap(data)
		chartCountryCode = countryCode
		console.log('chartCountryCode inside else:', chartCountryCode)
	}
}
//show single country data on map
function showOneCountryOnMap(data) {
	console.log('one country data: ', data)
	// fetchCasesCountryforChart(chartCountryCode)

	const container = document.createElement('section')
	container.classList.add('info__container')
	const flag = document.createElement('img')
	flag.src = data.countryInfo.flag
	flag.classList.add('info__flag')
	//create function to generate DOM elements
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
	container.append(flag, countryName, cases, recovered, deaths)
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
//show all countries data on map
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

let myChart, country, map

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
//display circles for covid cases
async function setAllCasesCircles() {
	displayLoader()
	console.log('clicked case')
	myChart.destroy()
	map.remove()
	createMap()

	await fetchAllCovidCases()
	await fetchAllCasesForChart(chartCountryCode)
}
async function setRecoveredCircles() {
	displayLoader()
	console.log('clicked recovered')
	myChart.destroy()
	map.remove()
	createMap()

	await fetchAllRecoveredCases()
	await fetchRecoveredForChart(chartCountryCode)
}
async function setDeathsCircles() {
	console.log('clicked deaths')
	myChart.destroy()
	displayLoader()
	map.remove()
	createMap()

	await fetchAllDeathCases()
	await fetchDeathsForChart(chartCountryCode)
}
