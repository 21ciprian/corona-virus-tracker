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
/fetch all death cases
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