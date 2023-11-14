
let table

function preload() {
    table = loadTable('CR_SO1_Enterococcus_Counts.csv', 'csv', 'header') ;
  }

  function setup() {
    createCanvas(800, 600);
    background('black');
    drawBarChart();
    print(table)
  }
  
  function drawBarChart() {
    let barWidth = 50;
    let xOffset = 100;
    let yOffset = 100;
  
    for (let r = 0; r < table.getRowCount(); r++) {
      let RainfallRange = table.getString(r, 'RainfallRange');
      let Above61 = table.getNum(r, 'Above61per100mL');
  
      // Draw a bar for Above61per100mL
      fill('blue');
      rect(xOffset + r * 100, height - yOffset - Above61, barWidth, Above61);
  
      // Display the RainfallRange label below each bar
      fill('white');
      textAlign(CENTER);
      text(RainfallRange, xOffset + r * 100 + barWidth / 2, height - yOffset + 20);
    }
  }