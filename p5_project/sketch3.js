let data;
let charlesRiver012Data;
let charlesRiver166Data;

function preload() {
  // Load the data
  data = loadTable('assets/combined_stations.csv', 'csv', 'header');
}

function setup() {
  createCanvas(1200, 400);
  processData();
}

function processData() {
  // Filter data for Charles River, Station 012
  charlesRiver012Data = data.rows.filter(row => {
    let region = row.get('Region');
    let stationID = parseInt(row.get('StationID'));
    return (region === 'CHARLES RIVER' && stationID === 12);
  });

  // Filter data for Charles River, Station 166
  charlesRiver166Data = data.rows.filter(row => {
    let region = row.get('Region');
    let stationID = parseInt(row.get('StationID'));
    return (region === 'CHARLES RIVER' && stationID === 166);
  });

  // Draw scatter plots
  drawScatterPlot(charlesRiver012Data, color(0, 0, 255), 0.01, 0.25); // Blue
  drawScatterPlot(charlesRiver166Data, color(255, 0, 0), 0.01, 0.25); // Red
}

function drawScatterPlot(dataset, dotColor, minRainfall, maxRainfall) {
  // Draw axes
  stroke(0);
  line(50, height - 50, width / 2 - 50, height - 50);
  line(50, height - 50, 50, 50);

  // Draw points
  noStroke();
  for (let row of dataset) {
    let x = map(parseFloat(row.get('Logan_rainfall_in')), 0, 0.25, 50, width / 2 - 50);
    let y = map(parseInt(row.get('Enterococcus')), 0, 100, height - 50, 50);

    if (parseInt(row.get('Enterococcus')) > 61) {
      fill(255, 0, 0); // Red
    } else {
      fill(dotColor); // Blue
    }

    ellipse(x, y, 10, 10);
  }
}

function draw() {
  // Additional drawing logic goes here if needed
}
