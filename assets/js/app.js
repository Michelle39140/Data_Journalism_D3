// 1. Set up SVG chart-------------------------------------
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom:100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// 2. Create an SVG wrapper,
// append an SVG group that will hold the SVG chart, and shift it by left and top margins---------------------------
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 3. Import data from csv file and make chart------------
d3.csv("../data/data.csv").then(function(data) {

  console.log(data); // Print the data
  
  // define the x and y used for the initial chart
  var xData = "poverty"
  var yData = "smokes"

  data.forEach(e => {
      e[xData] = +e[xData];
      e[yData]= +e[yData]
  });

  // Create Scales
        // scale y
    var yScale= d3.scaleLinear()
        .domain([d3.min(data, d => d[yData])-1, d3.max(data, d => d[yData])+1])
        .range([height, 0]);
        // scale x
    var xScale =d3.scaleLinear()
        .domain([d3.min(data, d => d[xData])-1, d3.max(data, d => d[xData])+1])
        .range([0, width])

  // Create Axes
    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);

  // Append the axes to the chartGroup
  // Add xAxis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .classed("xAxis",true)
    .call(xAxis);

  // Add yAxis to the left side of the display
  chartGroup.append("g")
    .classed("yAxis",true)  
    .call(yAxis);

  // Setup the tool tip
  var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(d =>`State: ${d.state}<br>${xData}: ${d[xData]}<br>${yData}: ${d[yData]}`);
  svg.call(tool_tip);

    // Append Data to chartGroup
    chartGroup.append("g").selectAll(".stateCircle").data(data).enter().append("circle")
    .classed("stateCircle", true)
    .attr("r",15)
    .attr("cx", d => xScale(d[xData]))
    .attr("cy", d => yScale(d[yData]))
    //   .on('mouseover', tool_tip.show)
    //   .on('mouseout', tool_tip.hide);

  // Append text to chartGroup
  chartGroup.append("g").selectAll(".stateText").data(data).enter().append("text")
  .classed("stateText", true)
  .attr("x", d => xScale(d[xData]))
  .attr("y", d => yScale(d[yData]))
  .attr("dy",5)
  .text(d => d.abbr)
  .on('mouseover', tool_tip.show)
  .on('mouseout', tool_tip.hide);


  // create Axis legends (will be clickable)--------------
  var xlabelgroup = svg.append("g")
  var ylabelgroup = svg.append("g")
  // y1
  ylabelgroup.append("text") 
    .attr("id","y1")
    .attr("style","text-align:center")
    .attr("transform", "rotate(-90)")
    .attr("y",margin.left*3/5) // note that after rotation, x,y exchanged
    .attr("x",-(margin.top+height/2))
    .text("Smokes")
    .style("text-anchor", "middle")
    .classed("ylabel active",true)
    
    // y2
    ylabelgroup.append("text") 
    .attr("id","y2")
    .attr("transform", "rotate(-90)")
    .attr("y",margin.left*2/5) // note that after rotation, x,y exchanged
    .attr("x",-(margin.top+height/2))
    .text("Healthcare")
    .style("text-anchor", "middle")
    .classed("ylabel inactive",true)

    // y3
    ylabelgroup.append("text") 
    .attr("id","y3")
    .attr("transform", "rotate(-90)")
    .attr("y",margin.left*1/5) // note that after rotation, x,y exchanged
    .attr("x",-(margin.top+height/2))
    .text("Obesity")
    .style("text-anchor", "middle")
    .classed("ylabel inactive",true)
    
    //x1
    xlabelgroup.append("text") //x axis legend
    . attr("transform", `translate(${margin.left+width/2}, ${margin.top+height+margin.bottom*4/5})`)
    .text("Age")
    .style("text-anchor", "middle")
    .classed("xlabel inactive",true)
    
    //x2
    xlabelgroup.append("text") //x axis legend
    . attr("transform", `translate(${margin.left+width/2}, ${margin.top+height+margin.bottom*3/5})`)
    .text("Income")
    .style("text-anchor", "middle")
    .classed("xlabel inactive",true)

    //x3
    xlabelgroup.append("text") //x axis legend
    . attr("transform", `translate(${margin.left+width/2}, ${margin.top+height+margin.bottom*2/5})`)
    .text("Poverty")
    .style("text-anchor", "middle")
    .classed("xlabel active",true)
//----------------------------------------------------------
    

// Event listeners with transitions for x labels------------
    d3.selectAll(".xlabel").on("click", function() {
       xData = d3.select(this).text().toLowerCase()
       console.log(xData)

    //dynamically highlight active labels
       d3.selectAll(".xlabel")
        .classed("active",false)
        .classed("inactive",true)
       
       d3.select(this).classed("active",true)
        .classed("inactive",false)  

    //data cleaning
       data.forEach(e => {
        e[xData] = +e[xData];
        });
    
    // redefine xScale function with new xData
       xScale =d3.scaleLinear()
       .domain([d3.min(data, d => d[xData])-1, d3.max(data, d => d[xData])+1])
       .range([0, width])

       xAxis = d3.axisBottom(xScale);
    
    // transit for x Axis
       d3.select(".xAxis")
        .transition()
        .duration(500)
        .call(xAxis)

        // Setup new tool tip
        d3.selectAll(".d3-tip").remove()
        var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(d =>`State: ${d.state}<br>${xData}: ${d[xData]}<br>${yData}: ${d[yData]}`);
        svg.call(tool_tip);

        // transit for circles
        chartGroup.selectAll(".stateCircle")
        .transition()
        .duration(500)
        .attr("cx", d => xScale(d[xData]))
        

        // transit for texts
        chartGroup.selectAll(".stateText")       
        .transition()
        .duration(500)
        .attr("x", d => xScale(d[xData]))
        
        chartGroup.selectAll(".stateText")
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

    });

    
    // Event listeners with transitions for y labels
    d3.selectAll(".ylabel").on("click", function() {
        yData = d3.select(this).text().toLowerCase()
        console.log(yData)
        d3.selectAll(".ylabel")
            .classed("active",false)
            .classed("inactive",true)
        d3.select(this).classed("active",true)
            .classed("inactive",false)  


        data.forEach(e => {
         e[yData] = +e[yData];
         });

         yScale= d3.scaleLinear()
         .domain([d3.min(data, d => d[yData])-1, d3.max(data, d => d[yData])+1])
         .range([height, 0]);

         console.log(([d3.min(data, d => d[yData])-1, d3.max(data, d => d[yData])+1]))
 
        yAxis = d3.axisLeft(yScale);
 
 
        d3.select(".yAxis")
         .transition()
         .duration(500)
         .call(yAxis)
 
         // Setup new tool tip
         d3.selectAll(".d3-tip").remove()

         var tool_tip = d3.tip()
         .attr("class", "d3-tip")
         .offset([-8, 0])
         .html(d =>`State: ${d.state}<br>${xData}: ${d[xData]}<br>${yData}: ${d[yData]}`);
         svg.call(tool_tip);
 
         // transit for circles
         chartGroup.selectAll(".stateCircle")
         .transition()
         .duration(500)
         .attr("cy", d => yScale(d[yData]))
         
 
         // transit for texts
         chartGroup.selectAll(".stateText")       
         .transition()
         .duration(500)
         .attr("y", d => yScale(d[yData]))
         
         chartGroup.selectAll(".stateText")
         .on('mouseover', tool_tip.show)
         .on('mouseout', tool_tip.hide);
 
     });

});

