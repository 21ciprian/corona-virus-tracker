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
