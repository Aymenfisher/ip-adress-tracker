/* get the IP */
// Get the user's ip address //
let loading = true;
async function getRequestFetch(url) { // async get reaquest with fetch boilerplate, assuming json response
    try {
        const response = await fetch(url);
        if (response.ok) {
            const jsonResponse = await response.json()
            return jsonResponse
        }
        throw new Error('request Failed!')
    } catch (error) {
        console.log(error)
    }
}
let clientIP; // client IP  address will be stored here
getRequestFetch('http://api.ipify.org/?format=json').then(
    (data) => {
        clientIP =  data.ip
        loading = false;
    }
)

// get and store the informations about an ip address from the api :

let infos={} // infos will be stored in this object

function getIPAddressInfos(ip){ // fetches data from the api
    const getUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_M8XSS75lXdqwNXcLH3e4856bUhG8D&ipAddress=${ip}`
    console.log(getUrl)
    getRequestFetch(getUrl).then(
        (data) =>{
            infos.ipAddress = data['ip'];
            infos.location = `${data['location']['city']},${data['location']['region']} ${data['location']['postalCode']}`;
            infos.timezone = `UTC ${data['location']['timezone']}`;
            infos.isp = data['isp'];
            infos.lat = data['location']['lat'];
            infos.lng = data['location']['lng'];
        }
    )
}



// handling form :
//getting the elements to display info into
const ipAdressElement = document.getElementById('ip-address');
const locationElement = document.getElementById('location');
const timezoneElement = document.getElementById('timezone');
const ispElement = document.getElementById('isp');

const formElement = document.getElementById('form');

// replace elements :

function replaceElements(){
    ipAddessElement.innerHTML = infos.ipAddress
    locationElement.innerHTML = infos.location
    timezoneElement.innerHTML = infos.timezone
    ispElement.innerHTML = infos.isp
}
console.log(clientIP)
getIPAddressInfos(clientIP) // get the visitor's infos 
if(!loading){
    replaceElements()
}


function handleFormSubmition(e){
    e.preventDefault();

    const inputIP = e.target.value;
    const rgx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/ ; // regex only dots and numbers
    
    if(!rgx.test(inputIP)){
        window.alert('Invalid IP address !')
    }

    getIPAddressInfos(inputIP);


}

formElement.addEventListener('submit',handleFormSubmition)


/* Display on maps */
var myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [46, 56], // size of the icon
    iconAnchor: [23, 56], // point of the icon which will correspond to marker's location
});

let coordinates = [infos.lat, infos.lng]


var map = L.map('map').setView(coordinates, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker(coordinates, { icon: myIcon }).addTo(map)