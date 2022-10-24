
// defining logic for getting the user's ip address , get the informations about an ip address//

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

/* Display on maps */

function showOnMap(lat, lng) {
    var myIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        iconSize: [46, 56], // size of the icon
        iconAnchor: [23, 56], // point of the icon which will correspond to marker's location
    });

    // clear map div:
    document.getElementById('weather-map').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";

    // setting and displaying new map:

    var map = L.map('map',{ zoomControl: false }).setView([lat, lng], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng], { icon: myIcon },{ draggable: true }).addTo(map)
}



// get and store the informations about an ip address from the api :

let infos = {} // infos will be stored in this object

function getIPAddressInfos(targ) { // fetches data from the api

    const ipRgx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    let queryParam;

    if(ipRgx.test(targ)){ // input is ip address
        queryParam = 'ipAddress='+targ;
    } else{ // then the input is domain
        queryParam = 'domain='+targ;
    }

    let getUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=at_M8XSS75lXdqwNXcLH3e4856bUhG8D&${queryParam}`

    getRequestFetch(getUrl).then(
        (data) => { // replaces the info object with the new data
            infos.ipAddress = data['ip'];
            infos.location = `${data['location']['city']},${data['location']['region']} ${data['location']['postalCode']}`;
            infos.timezone = `UTC ${data['location']['timezone']}`;
            infos.isp = data['isp'];
            infos.lat = data['location']['lat'];
            infos.lng = data['location']['lng'];
            // now the info object is changed, we can replace html element ( no loading now)
            replaceElements(false)
            // call the map with the new lat and lng coordinates
            showOnMap(infos.lat, infos.lng)
        }
    )
}



// handling form :
//getting the elements to display info into
const ipAddressElement = document.getElementById('ip-address');
const locationElement = document.getElementById('location');
const timezoneElement = document.getElementById('timezone');
const ispElement = document.getElementById('isp');

const formElement = document.getElementById('form');

// replace elements helper function : 

function replaceElements(reloading) { //reloading could be true of false 
    if(reloading){
        ipAddressElement.innerHTML = 'Loading...'
        locationElement.innerHTML = 'Loading...'
        timezoneElement.innerHTML = 'Loading...'
        ispElement.innerHTML = 'Loading...'
    }else{
    ipAddressElement.innerHTML = infos.ipAddress
    locationElement.innerHTML = infos.location
    timezoneElement.innerHTML = infos.timezone
    ispElement.innerHTML = infos.isp}
}




function handleFormSubmition(e) { // handles the form submission
    e.preventDefault();
    replaceElements(true) // activating reload state on the elements

    const inputfieldValue = document.getElementById('ip-address-input').value

    const ipRgx = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/; 
    const domainRgx = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

    if (!ipRgx.test(inputfieldValue) && !domainRgx.test(inputfieldValue)) { // testing if the input is a valid ip address /domain name pattern
        window.alert('Invalid Domain name / IP address !') // if invalid ip address / domain name pattern we alert the user
        ipAddressElement.innerHTML = ''
        locationElement.innerHTML = ''
        timezoneElement.innerHTML = ''
        ispElement.innerHTML = ''
        return
    } 


    getIPAddressInfos(inputfieldValue);  // fetching data about the iput ip address, then displaying the infos on pannel and showing map

}

formElement.addEventListener('submit', handleFormSubmition)

/* Display the informations on the page */

// display the user's ip address informations, this will happen when the page loads :

getRequestFetch('https://api.ipify.org/?format=json').then( 
    (data) => {
        return data.ip
    }
).then(
    (userip) => {
        getIPAddressInfos(userip)
    }
)