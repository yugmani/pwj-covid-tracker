var map;
// var infoWindow;



window.onload = () =>{
    getCountryData();
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom:3
  });


}

const getCountryData = ()=>{
    fetch("https://corona.lmao.ninja/v2/countries")
    .then((response)=>{
        // console.log(response);
        return response.json();
    }).then((data)=>{
        console.log(data);
        showDataOnMap(data);
    })
}

const showDataOnMap = (data)=>{
    data.map((country)=>{
        let countryCenter = {
            lat: country.countryInfo.lat,
            lng: country.countryInfo.long
        }

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
// style="${country.countryInfo.flag}"
/* <img src="${country.countryInfo.flag}"></img> */
        var html = `
                <div class="info-container">
                    <div class="country-flag" style="background-image:url(${country.countryInfo.flag});"> 
                    
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

        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            // infoWindow.setContent(html);
            infoWindow.open(map);
          });

        google.maps.event.addListener(countryCircle, "mouseout", function(){
            infoWindow.close();
        })

        //   markers.push(marker);
        
    })
}

