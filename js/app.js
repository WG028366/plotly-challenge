//make sure we can get the json, create variables for data we will need to use in charts
function getSamplesData(id){
  d3.json("samples.json").then((d) =>{
    console.log(d)

    var samples = d.samples.filter(s => s.id.toString() === id)[0];
    console.log(samples);

    var values = samples.sample_values.slice(0,10).reverse();
    
    var labels = samples.otu_labels.slice(0,10);

    var topTen = samples.otu_ids.slice(0,10).reverse();

    var topTenID = topTen.map(string => `OTU ${string}`);

//create trace and format layout for bar graph

    var trace_bar = {
      x: values,
      y: topTenID,
      text: labels,
      marker: {color: "green"},
      type: "bar",
      orientation: "h"

    };
    var data_bar = [trace_bar];

    var layout_bar = {
      title: "OTU TOP 10",
      xaxis: {title: "Sample Values"},
      yaxis: {
        title: "OTU ID"
      },
      height: 500,
      width: 800,
      margin: {
        r: 100,
        l: 100,
        t: 100,
        b: 100
      }

    };

    Plotly.newPlot("bar", data_bar, layout_bar);

//create new trace and format layout for bubble graph

    var trace_bubble = {
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: "markers",
      marker: {
        size: samples.sample_values,
        color: samples.otu_ids
      },
      text: samples.otu_labels

    };

    var layout_bubble = {
      xaxis:{title: "OTU ID"},
      yaxis:{title: "Sample Values"},
      height: 500,
      width: 800,
      margin: {
        r: 0,
        l: 300,
        t: 100,
        b: 100
      }
    };

    data_bubble = [trace_bubble];

    Plotly.newPlot("bubble", data_bubble, layout_bubble);

  });
};

//now pull info for demographic section

function getSamplesInfo(id) {
  d3.json("samples.json").then((d) =>{

    var metaData = d.metadata;
    console.log(metaData);

    var row = metaData.filter(m => m.id.toString() === id)[0];

    var demographicData = d3.select("#sample-metadata");

    demographicData.html("");

    Object.entries(row).forEach((key) =>{
      demographicData.append("h5").text(`${key[0]}: ${key[1]} \n`);
    })
  })
}

//allows dropdown menu to change

function optionChanged(id) {
  getSamplesData(id);
  getSamplesInfo(id);
}

//execute the dashboard

function init () {

  var dropdownMenu = d3.select("#selDataset");

  d3.json("samples.json").then((d)=>{
    console.log(d)
    d.names.forEach(function(name){
      dropdownMenu.append("option").text(name).property("value");
    });

    getSamplesData(d.names[0]);
    getSamplesInfo(d.names[0]);


  });



}

init();