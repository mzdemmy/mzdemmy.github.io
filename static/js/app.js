// Visualization Dashboard Homework
//  python -m http.server

// Complete the option change handler for the page
d3.selectAll("#selDataset").on("change", optionChanged);

// This function is called when a dropdown menu item is selected
function optionChanged(sel) {
  // Use D3 to select the dropdown menu
  var dropdown = d3.select("#selDataset");
  
  // Assign the value of the dropdown menu option to a variable
  var sample = dropdown.property("value");
  console.log("menu " + sample);
  buildViz(sample);
};

//build dashboard using data from first sample
function init() {
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        
        sampleNames.forEach((sample) => {
            d3.select("#selDataset")
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        var sample = sampleNames[0];
        console.log("first " + sample);
        buildViz(sample)
    });   
}

function buildViz(sample) {
// Use d3.json() to fetch vizualization data 
    d3.json("data/samples.json").then((data) => {
        // var first = data.names[0];
        var sampleNames = data.names;
        var samples = data.samples;
        // console.log(samples);
        var metadata = data.metadata;
        
        // sampleNames.forEach((sample) => {
        //     d3.select("#selDataset")
        //     .append("option")
        //     .text(sample)
        //     .property("value", sample);
        // });

        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        // console.log(result);
        
        // slice the top 10 objects and everse the array due to Plotly's defaults
        var otu_ids = result.otu_ids.slice(0,10).reverse();
        var sample_values = result.sample_values.slice(0,10).reverse();
        var otu_labels = result.otu_labels.slice(0,10).reverse();
        console.log(otu_ids);

        // Build a bar chart to display the top 10 OTUs for individual 
        // first, use array.map to append "UTO" to elements in the array
        y_values = otu_ids.map(el => 'UTO ' + el)
        console.log(y_values);
        
        var trace = {
            y: y_values,        
            x: sample_values,
            type: "bar",
            text: otu_labels,
            orientation: "h"
        };

        //create the data array for the plot
        var barData = [trace];

        //define the plot layout
        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Build a bubble chart to display sample each sample
        var bubbleLayout = {
            tite: "Bacteria Cultures per Sample",
            marting: {t:0}, 
            hovermode: "closest",
            x_axis: {title: "OTU ID"},
            margin: {t:50}
        };
        var bubbleData = [
            {
                x:result.otu_ids,
                y:result.sample_values,
                text:result.otu_lables,
                mode: "markers",
                marker: {
                    size: result.sample_values,
                    color: result.otu_ids,
                    colorscale: "Rainbow"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // display the sample meta data (individual's demographic information)
        var resultArr = metadata.filter(sampleObj => sampleObj.id == sample);
        var metaresult = resultArr[0];
        var PANEL = d3.select("#sample-metadata");
        console.log(metaresult);

        // use .html("") to clear dashboard
        PANEL.html("");

        // display each key-value pair (object entry) from the metadata
        Object.entries(metaresult).forEach(([key, value]) => {
            // console.log('${key.toUpperCase()}: ${value}')
            PANEL.append("h6").text(key.toUpperCase() + ': ' + value)
        });  
    });
}
//initialize the page
init();



