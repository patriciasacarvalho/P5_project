let data;
let raindrops = [];
let currentStationID = '012'; // Initial station ID

function preload() {
  data = loadTable('assets/combined_stations.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  createButton('Switch Station ID').mousePressed(switchStationID);

  generateRaindrops(currentStationID);
}

function switchStationID() {
  // Toggle between StationID 012 and StationID 166
  currentStationID = currentStationID === '012' ? '166' : '012';
  generateRaindrops(currentStationID);
}

function generateRaindrops(stationID) {
  raindrops = []; // Clear existing raindrops

  // Filter data for CHARLES RIVER, StationID
  let stationData = data.rows.filter(row => row.get('Region') === 'CHARLES RIVER' && row.get('StationID') === stationID);

  // Group data by year and month
  let groupedData = groupDataByYearAndMonth(stationData);

  // Sort years in ascending order
  let years = Object.keys(groupedData).sort();

  // Parse the grouped data and create Raindrop objects
  for (let year of years) {
    let months = Object.keys(groupedData[year]).sort();
    for (let month of months) {
      let monthData = groupedData[year][month];

      // Calculate radius based on the year (2012 with the smallest radius, increasing outward)
      let radius = map(parseInt(year), 2012, 2022, 300, 500);

      // Calculate angle based on the month
      let angle = map(parseInt(month), 1, 12, 0, TWO_PI);

      for (let i = 0; i < monthData.length; i++) {
        let row = monthData[i];
        let enterococcusCount = row.getNum('Enterococcus');
        let rainfallIntensity = row.getNum('Logan_rainfall_in');
        let dropColor = enterococcusCount > 61 ? color(255, 0, 0, 170) : color(150); // Red if count > 61, gray otherwise

        let raindrop = new Raindrop(enterococcusCount, rainfallIntensity, dropColor, angle, radius);
        raindrops.push(raindrop);
      }
    }
  }
}

function groupDataByYearAndMonth(data) {
  let groupedData = {};

  for (let row of data) {
    let year = new Date(row.get('sample_date')).getFullYear();
    let month = new Date(row.get('sample_date')).getMonth() + 1; // Months are zero-indexed in JavaScript

    if (!groupedData[year]) {
      groupedData[year] = {};
    }

    if (!groupedData[year][month]) {
      groupedData[year][month] = [];
    }

    groupedData[year][month].push(row);
  }

  return groupedData;
}

function draw() {
  background("black");
  translate(width / 2, height / 2);

  // Display raindrops
  for (let i = 0; i < raindrops.length; i++) {
    raindrops[i].display();
  }
}

class Raindrop {
  constructor(enterococcusCount, rainfallIntensity, dropColor, angle, radius) {
    if (isNaN(rainfallIntensity)) {
      this.r = 1; // Default raindrop size for non-numeric values
    } else {
      this.r = map(rainfallIntensity, 0, 2, 5, 15); // Adjusted raindrop size range
    }
    this.dropColor = dropColor;
    this.angle = angle; // Angle based on the month
    this.radius = radius; // Radius based on the year
  }

  display() {
    let x = this.radius * cos(this.angle);
    let y = this.radius * sin(this.angle);

    noStroke();
    fill(this.dropColor);
    ellipse(x, y, this.r * 2, this.r * 2);
  }
}
