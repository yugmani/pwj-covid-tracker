
// TO INITIALIZE GOOGLE MAP WITH COVID-19 DATA

var map;

// INITIALIZING FUNCTIONS WHILE LOADING WINDOW
window.onload = () =>{
    getCountryData();
    // buildChart();
    getHistoricalData();
    getContinentData() ;
}

// INITIALIZE GOOGLE MAP
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.8283, lng: -98.5795},
        zoom:3,
        styles: mapStyle
    });

}

// GETTING DATA COUNTRYWISE COVID-19 DATA FROM API
const getCountryData = ()=>{
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        // console.log(response);
        return response.json();
    }).then((data)=>{
        // console.log(data);
        showDataOnMap(data);
        showDataInTable(data);
    })
}

// SHOWING DATA ON GOOGLE-MAP
const showDataOnMap = (data)=>{
    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

        // CIRCLE-MARKER STYLING
        var countryCircle = new google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
          map: map,
          center: countryCenter,
          radius: country.casesPerOneMillion * 15
        });


        // INSERT DATA INTO INFO-WINDOW AND STYLING
        // style="background-image:url(${country.countryInfo.flag});"
        var html = `
                <div class="info-container">
                    <div class="country-flag" > 
                        <img src="${country.countryInfo.flag}"></img>
                    </div>
                    <div class="info-name">
                        ${country.country}
                    </div>
                    <div class="info-confirmed">
                        Total: ${country.cases}
                    </div>
                    <div class="info-recovered">
                        Recovered: ${country.recovered}
                    </div>
                    <div class="info-deaths">
                        Deaths: ${country.deaths}
                    </div>
                </div>`
        var infoWindow = new google.maps.InfoWindow({
            content: html,
            position: countryCircle.center
        });

        // EVENT LISTENERS ON MOUSEOVER AND MOUSEOUT
        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            // infoWindow.setContent(html);
            infoWindow.open(map);
          });

        google.maps.event.addListener(countryCircle, "mouseout", function(){
            infoWindow.close();
        })
        
    })
}

// CREATING TABLE OF COUNTRYWISE DATA
const showDataInTable = (data) =>{
    var html = "";
    data.forEach((country) => {
        html += `
                <tr>
                    <td>${country.country}</td>
                    <td>${country.cases}</td>
                    <td>${country.recovered}</td>
                    <td>${country.deaths}</td>
                </tr>`
    })
    document.getElementById("table-data").innerHTML = html;
}