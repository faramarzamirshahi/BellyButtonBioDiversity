function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    sampledata = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    sampledatafiltered = sampledata.filter( d => d.id === sample);

    //  5. Create a variable that holds the first sample in the array.
    var displayData = [sampledatafiltered[0]];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otuids = [];
    labels = [];
    values = [];

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topvalues = displayData .sort((a,b) => a.sample_values < b.sample_values)
    otuids = topvalues[0].otu_ids.slice(0,10).reverse();
    otuids = otuids.map(d => `otu_${d}`);
    labels = topvalues[0].otu_labels.slice(0,10).reverse();
    values = topvalues[0].sample_values.slice(0,10).reverse();
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values,
      y: otuids,
      text: labels,
      name: "otu",
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      autosize: false,
      width: 400,
      height: 540,     
      margin: {
        pad: 4
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
   Plotly.newPlot("plotArea",barData,barLayout);
  });

}

