var map;
// var infoWindow;



window.onload = () =>{
    getCountryData();
    // buildChart();
    getHistoricalData();
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.8283, lng: -98.5795},
    zoom:3,
    styles: mapStyle
  });


}

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

        google.maps.event.addListener(countryCircle, 'mouseover', function() {
            // infoWindow.setContent(html);
            infoWindow.open(map);
          });

        google.maps.event.addListener(countryCircle, "mouseout", function(){
            infoWindow.close();
        })
        
    })
}

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


const getHistoricalData = ()=>{
    fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=90")
    .then((response)=>{
        // console.log(response);
        return response.json();
    }).then((data)=>{
        // console.log(data);
        let chartData = buildChartData(data);
        buildChart(chartData);
    })
}

const buildChartData = (data)=>{
    let chartData = [];
    for(let date in data.cases){
        let newDataPoint = {
            x: date,
            y: data.cases[date]
        }
        chartData.push(newDataPoint);
    }
    // console.log(chartData);
    return chartData;
}


const buildChart = (chartData)=>{
    var timeFormat = 'MM/DD/YY';
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                label: 'Total Cases',
                // backgroundColor: '#1d2c4d',
                borderColor: '#00CED1',
                data: chartData
            }]
        },

        // Configuration options go here
        options: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        format: timeFormat,
                        tooltipFormat: "ll"
                    }, 
                    scaleLable: {
                        display: true,
                        lableString: 'Date'
                    }

                }],
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            return numeral(value).format('0, 0');
                        }
                    }
                }]
            }
        }
    });
}