let data;
let points = [];
let yearSlider;

function preload() {
  data = loadTable('assets/combined_stations.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a slider for selecting the year
  yearSlider = createSlider(2000, 2023, 2000);
  yearSlider.position(20, height + 40);
  yearSlider.style('width', '200px');

  // Parse the data and create Point objects
  for (let i = 0; i < data.getRowCount(); i++) {
    let row = data.getRow(i);
    let enterococcusCount = row.getNum('Enterococcus');
    let rainfallIntensity = row.getNum('Logan_rainfall_in');
    let color = getColor(enterococcusCount); // Get color based on Enterococcus count
    let year = getYearFromDate(row.get('sample_date')); // Adjust this function based on your date format

    let point = new Point(rainfallIntensity, enterococcusCount, color, year);
    points.push(point);
  }
}

function draw() {
  background(255);
  drawAxes();

  // Display the selected year number
  fill(0);
  textAlign(LEFT);
  textSize(16);
  text('Selected Year: ' + yearSlider.value(), 20, height + 40);

  // Display points for the selected year
  let selectedYear = yearSlider.value();
  for (let i = 0; i < points.length; i++) {
    points[i].display(selectedYear);
  }
}

function getColor(enterococcusCount) {
  // Return red for counts above 61, gray otherwise
  return enterococcusCount > 61 ? color(255, 0, 0) : color(150);
}

function drawAxes() {
  stroke(0);
  line(0, height / 2, width, height / 2); // Horizontal line for x-axis
  line(width / 2, 0, width / 2, height); // Vertical line for y-axis

  // Display rain intensity ranges on the x-axis
  fill(0);
  textAlign(CENTER);
  textSize(12);
  text("0.01 - 0.25", width * 0.2, height / 2 + 20);
  text("0.51 - 0.75", width * 0.4, height / 2 + 20);
  text("0.76 - 1.0", width * 0.6, height / 2 + 20);
  text("1.01 - 1.5", width * 0.8, height / 2 + 20);
  text("1.51 - 3.0", width - 20, height / 2 + 20);
}

function getYearFromDate(dateString) {
  // You may need to adjust this function based on your date format
  let date = new Date(dateString);
  return date.getFullYear();
}

class Point {
  constructor(x, y, color, year) {
    this.x = map(x, 0, 2, 0, width); // Adjust this mapping range based on your data
    this.y = map(y, 0, 320, height, 0); // Adjust this mapping range based on your data
    this.color = color;
    this.year = year;
  }

  display(selectedYear) {
    if (this.year == selectedYear) {
      noStroke();
      fill(this.color);
      ellipse(this.x, this.y, 10, 10);
    }
  }
}
