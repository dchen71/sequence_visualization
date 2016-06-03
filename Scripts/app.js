/*
  D3 Visualization of Fasta sequences
*/

//Setup general chart boundaries
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

//Init the start and end
var start=0, end=1376;

//Read domain data
d3.csv('Input/parsed_sequence.csv')
  .row(function (d) { return d })
  .get(function (error, data) {

    //Error message
    if(error){
      console.log(error);
      d3.select("body").append("p").text("Error loading csv");
    };

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.POS = +d.POS;
      d.SEQ = d.SEQ;
    });

    //Subset data based on start/end
    var subset = data.filter(function(d){return d.POS <= end && d.POS >= start})

    //Find max x value
    var max = d3.max(subset, function(d){return +d.POS})

    var abs_max = max;

    //Init the start and end inputs
    d3.selectAll('#start').attr("max", max)
                          .attr("value", 1)
    d3.selectAll('#end').attr("max", max)
                        .attr("value", max)

    //Add colors
    var colors = d3.scale.category20();


    //Draws the plot
    function draw_plot(start, end){
      /*
        Setup
      */

      //Subset data based on start/end
      subset = data.filter(function(d){return d.POS <= end && d.POS >= start})

      //Find max x value
      max = d3.max(subset, function(d){return +d.POS})

      //Setup x
      var xValue = function(d) { return d.POS ;}, // data -> value
          xScale = d3.scale.linear().range([0, width]), // value -> display
          xMap = function(d) { return xScale(xValue(d));}, // data -> display
          xAxis = d3.svg.axis().scale(xScale).orient("bottom");

      // setup y
      var yValue = 50, // data -> value
          yScale = d3.scale.linear().range([height, 0]), // value -> display
          yMap = function(d) { return yScale(yValue);}, // data -> display
          yAxis = d3.svg.axis().scale(yScale).orient("left");

      // add the graph canvas to the body of the webpage
      var svg = d3.select(".chart-div").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(subset, xValue)-1, d3.max(subset, xValue)+1]);
      yScale.domain([0, yValue * 2 ]);

      //Builds nucleotides
      var nuc = svg.selectAll("g")
          .data(subset)
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0, 50)"; });

      nuc.append("rect")
          .attr("x", xMap)
          .attr("width", 50)
          .attr("height", 50 - 1)
          .attr("stroke", function(d){
            switch(d.SEQ){
              case "A":
                return(colors(1));
                break;
              case "R":
                return(colors(2));
                break;
              case "D":
                return(colors(3));
                break;
              case "N":
                return(colors(4));
                break;
              case "C":
                return(colors(5));
                break;
              case "E":
                return(colors(6));
                break;
              case "Q":
                return(colors(7));
                break;
              case "G":
                return(colors(8));
                break;
              case "H":
                return(colors(9));
                break;
              case "I":
                return(colors(10));
                break;
              case "L":
                return(colors(11));
                break;
              case "K":
                return(colors(12));
                break;
              case "M":
                return(colors(13));
                break;
              case "F":
                return(colors(14));
                break;
              case "P":
                return(colors(15));
                break;
              case "S":
                return(colors(16));
                break;
              case "T":
                return(colors(17));
                break;
              case "W":
                return(colors(18));
                break;
              case "Y":
                return(colors(19));
                break;
              case "V":
                return(colors(20));
                break;
            }
          })
          .attr("fill", function(d){
            switch(d.SEQ){
              case "A":
                return(colors(1));
                break;
              case "R":
                return(colors(2));
                break;
              case "D":
                return(colors(3));
                break;
              case "N":
                return(colors(4));
                break;
              case "C":
                return(colors(5));
                break;
              case "E":
                return(colors(6));
                break;
              case "Q":
                return(colors(7));
                break;
              case "G":
                return(colors(8));
                break;
              case "H":
                return(colors(9));
                break;
              case "I":
                return(colors(10));
                break;
              case "L":
                return(colors(11));
                break;
              case "K":
                return(colors(12));
                break;
              case "M":
                return(colors(13));
                break;
              case "F":
                return(colors(14));
                break;
              case "P":
                return(colors(15));
                break;
              case "S":
                return(colors(16));
                break;
              case "T":
                return(colors(17));
                break;
              case "W":
                return(colors(18));
                break;
              case "Y":
                return(colors(19));
                break;
              case "V":
                return(colors(20));
                break;
            }
          })

      nuc.append("text")
          .attr("x", function(d){return xScale(d.POS) + 13})
          .attr("y", 50 / 2)
          .attr("dy", ".35em")
          .text(function(d) { return d.SEQ })
          .attr("font-size", 40)
    }

    //Draw initial max plot on csv load
    draw_plot(0, max);

    /*
      Data binding for protein location range
    */

    //Find the gene element from datalist
    d3.select("#start").on('change', function(){
        clearGraph();

        //Ensure that it's a positive number/less than max
        if(this.value >= 0 && this.value <= abs_max){
          start = this.value;
          draw_plot(start, end);
          set_min(this.value);
        }
    });

    //Detects the different transcripts element from options
    d3.select("#end").on('change', function(){
        clearGraph();

        //Ensure that it's a positive number/less than max
        if(this.value >= 0 && this.value <= abs_max){
          end = this.value;
          draw_plot(start, end);
          set_max(this.value);
        }
    });

    //Sets new minimum validation based on value of #start
    function set_min(value){
      d3.select("#end")
        .attr("min", value)
    }

    function set_max(value){
      d3.select("#start")
        .attr("max", value)
    }

    //Clears entries
    function clearGraph(){
      d3.selectAll("svg").remove(); //Clean svg on entry
    }

})