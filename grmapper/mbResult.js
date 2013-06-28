//

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/SingleMbResult.html",
	"dojo/text!./templates/DualMbResult.html",  
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang", 
	"dojox/lang/functional",
	"dojo/on", 
	"dojo/mouse", 
	"dojo/query",  
	"esri/layers/graphics", 
	"esri/tasks/gp", 
	"dojo/_base/array", 
	"dojox/charting/Chart", 
	"dojox/charting/axis2d/Default", 
	"dojox/charting/plot2d/Default", 
	"dojox/charting/plot2d/Bars", 
	"dojox/charting/themes/Wetland", 
	"dojox/charting/plot2d/StackedBars",
	"dojox/charting/plot2d/Pie",
	"dojox/charting/widget/Legend",
	"dojo/aspect",
	"dijit/form/CheckBox",
	"dojo/parser",
	"esri/toolbars/draw",
	"dojox/charting/action2d/Tooltip",
	"bootstrap/Tooltip",
	"bootstrap/Popover"
	],
   function(
    declare, 
    WidgetBase, 
    TemplatedMixin, 
    singletemplate, 
    dualtemplate,
    domStyle, 
    domClass, 
    baseFx, 
    lang,
    functional, 
    on, 
    mouse, 
    query, 
    esrigraphics, 
    esrigp, 
    array, 
    Chart, 
    axisDefault, 
    plotDefault, 
    Bars, 
    Wetland, 
    StackedBars,
    Pie,
    Legend,
    aspect,
    CheckBox,
    parser,
    esridraw,
    dc,
    Tooltip,
    Popover
    ){
        return declare([WidgetBase, TemplatedMixin], {
        	
        	constructor: function(a){
        	this.inherited(arguments);
        	if (a.resultSet instanceof Array) {
        	   this.templateString = dualtemplate;
        	   this.dual = true;
        	 } else {
        	   this.templateString = singletemplate;
        	   this.dual = false;
        	 } 
        	
        	 
        	  
        	},
           
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            // Our template - important!
            templateString: singletemplate,
 
            // A class to be applied to the root node in our template
            baseClass: "mbResult",
            
            stype: "none",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
            landCoverClasses: {"1":{title:"Urban, Highways",lctype:"Other"},"2":{title:"Developed, Herbaceous",lctype:"Other"},"3":{title:"Agriculture",lctype:"Other"},"4":{title:"Forest",lctype:"Natural"},"5":{title:"Wetland",lctype:"Natural"},"6":{title:"Open Water",lctype:"Natural"},"7":{title:"Bare Earth, Shore",lctype:"Natural"},"8":{title:"Unclassified",lctype:"Other"}},
            
            destroy: function(){
            
              this.inherited(arguments);
            	
            },
            
            
            postCreate: function(){
            
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			 
			    // Run any parent postCreate processes - can be done at any point
			    
			    this.inherited(arguments);
			    
		   },
		   
		   startup: function() {
		   
		   	this.inherited(arguments);
		   		   
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 
			 this.map.reposition();
			 
			 iac = query("#" + this.domNode.id + " .inputareacheck");
			 
			 if (this.dual == true) {
		     cbs = dojo.query(iac[0]).children();
		        
		    this.inputAreacheckBox = new dijit.form.CheckBox({
			   name: "checkBox",
			   //value: "agreed",
			   checked: true,
			   onChange: lang.hitch(this,function(b){ if (b == true) {this.inputLayer[0].show()} else {this.inputLayer[0].hide()}})
			   }, cbs[0]);
			   			   

		     cbs = dojo.query(iac[1]).children();
		        
		    this.inputAreacheckBox = new dijit.form.CheckBox({
			   name: "checkBox",
			   //value: "agreed",
			   checked: true,
			   onChange: lang.hitch(this,function(b){ if (b == true) {this.inputLayer[1].show()} else {this.inputLayer[1].hide()}})
			   }, cbs[0]);
			   			   

			  } else {
			  
		     cbs = dojo.query(iac[0]).children();
		        
		    this.inputAreacheckBox = new dijit.form.CheckBox({
			   name: "checkBox",
			   //value: "agreed",
			   checked: true,
			   onChange: lang.hitch(this,function(b){ if (b == true) {this.inputLayer.show()} else {this.inputLayer.hide()}})
			   }, cbs[0]);
			   			   
			 }  			   
			   			   			 
			   query("#" + this.domNode.id + " ." + this.stype + "Results").show()
			   
			   if (this.stype == "model") {
			   	 if (this.dual) {
			   		this.displayModelResults(this.resultSet[0],"leftSide");
			   		this.displayModelResults(this.resultSet[1],"rightSide");
			   		} else {
				   	this.displayModelResults(this.resultSet);	
			   		}
			   } else {
			   	 if (this.dual) {
			   		this.displayHabitatResults(this.resultSet[0],"leftSide");
			   		this.displayHabitatResults(this.resultSet[1],"rightSide");
			   		} else {
				   	this.displayHabitatResults(this.resultSet);	
			   		}
			   }
		        
			 
		   },
		  
		   
		   _close: function() {
            
           this.map.removeLayer(this.inputLayer);
           
           //this.destroy();
			   
			   
		   },

		   
		   displayHabitatResults: function(rs, side) {
		   
		   if (side == undefined) {
			   
			   useSide = "";
			   
		   } else {
			   
			   useSide = "." + side;
		   }
		  
		   //You need to just keep this all in the same file.
		   
		   //console.log(side)
		   //console.log(rs)
		   
		   functional.forIn(rs, lang.hitch(this,function(outp,pname){
			     
			  results = outp.results;
			  color = outp.color; 
			  
				   
		   	if (results.paramName != "LandCoverSummary") {
		   	
		   		lcolor = lighterColor(color, .4);
			   
			   dataarray = []
			   protecteddataarray = []
			   labelarray = []
			   
			   i = 0;
			   for (att in results.value.features[0].attributes) {
			   
			   				if (att.indexOf("VALUE_") == 0) {
				   				labelarray.push({value:i+1, text:att});
				   		
				   				dataarray.push(0);
				   				protecteddataarray.push(0);
				   				i = i + 1;
			   				}
			   				
			   };
			   
			   
			   dojo.forEach(results.value.features, function(item, i){
			   
			   		dojo.forEach(labelarray, function(lab, j){
			   			  //alert(lab.text + " " + item.attributes[lab.text])
			   			  if (item.attributes["PROT_MECH"] == " ") {
			   			      dataarray[j] = dataarray[j] + (item.attributes[lab.text] / 10000);
			   			  } else {
				   		  	  protecteddataarray[j] = protecteddataarray[j] + (item.attributes[lab.text] / 10000);  
			   			  }
			   		});
			   		
			   });
			   	
			   
			   lookup = {}
			   dojo.forEach(labelarray, function(lab, j){
				   		//vtofind = parseInt(lab.text.replace("VALUE_", ""));
				   		//dvals[vtofind] = dataarray[j];
				   		//pvals[vtofind] = protecteddataarray[j];
				   		//if (j == 0) {labelarray[j] = "Nonbitat"}
				   		
				   		val = (parseFloat(lab.text.replace("VALUE_", "")) / 100)
				   		
				   		//alert(val)
				   		
				   		labelarray[j].text =  "" + val;
				   		
				   		lookup[labelarray[j].text] = [dataarray[j],protecteddataarray[j]]
				   		//}
				   		
				   });
			
			projectarr = []
			dataarr = []
			lablearr = []
			
			  dojo.forEach(outp.habtable, function(val, j){ 
			  		
			  		i = outp.habtable.length - j - 1
			  		inval = outp.habtable[i]
			  
			  		lablearr.push({text:inval,value:j+1})	
			  		lval = lookup[inval]
			  			if (lval == undefined) {
				  			projectarr.push(0)
				  			dataarr.push(0)
			  			} else {
				  			dataarr.push(lval[0])
				  			projectarr.push(lval[1])
			  			}
			  		
			  });	 
			  
			   labelarray = lablearr;
			   dataarray = dataarr;
			   protecteddataarray = projectarr;
			   
			   //make tables
			      
			   tnodes = query("#" + this.domNode.id + " ." + results.paramName + "HTable.totarea" + useSide);
			   pnodes = query("#" + this.domNode.id + " ." + results.paramName + "HTable.poftotal" + useSide);
			   cnodes = query("#" + this.domNode.id + " ." + results.paramName + "HTable.cpercent" + useSide);
			   ppnodes = query("#" + this.domNode.id + " ." + results.paramName + "HTable.percentp" + useSide);
			   
			   
			   tota = 0
			   
			   high = tnodes.length - 1;
			   
			   dojo.forEach(tnodes, function(n, j) {
				   
				   pa = dataarray[high-j] + protecteddataarray[high-j];
				   tota = tota + pa;
				   n.innerHTML = pa;
				   
				   ppval = ((protecteddataarray[high-j] / pa) * 100).toFixed(2)
				   if (ppval == "NaN") {
					ppnodes[j].innerHTML = ""  
				   } else {
				   	ppnodes[j].innerHTML = ((protecteddataarray[high-j] / pa) * 100).toFixed(2)
				   }
				   

				   
			   });
			   
			   totp = 0
			   dojo.forEach(pnodes, function(n, j) {
				   
				   pa = (((dataarray[high-j] + protecteddataarray[high-j]) / tota) * 100);
				   totp = totp + pa;
				   outpa = pa;
				   n.innerHTML = outpa.toFixed(2);
				   
				   outtotp = totp;
				   cnodes[j].innerHTML = outtotp.toFixed(2);
				   
			   });
			   
			   //make graphs
			   
			   
			   cloc = query("#" + this.domNode.id + " ." + results.paramName.replace("Summary","HabitatSummary") + useSide);
			   
			   var chart1 = new Chart(cloc[0], {stroke: "black"});
			   //chart1.addPlot("default", { type: "Bars", gap: 2});
			   chart1.addPlot("default", {type: "StackedBars", gap: 2});
			   chart1.addAxis("x", {minorTicks: false, title:"Area (Hectares)", titleOrientation:"away"});
			   chart1.addAxis("y", {vertical: true, leftBottom: true, labels: labelarray, minorTicks: false});

			   //chart1.setTheme(Wetland);
			   chart1.addSeries("Protected",protecteddataarray,{stroke: {color:color}, fill: color});
			   chart1.addSeries("Unprotected",dataarray,{stroke: {color:lcolor}, fill: lcolor});
			  
			   var anim3b = new dc(chart1, "default");
			  
			   chart1.render();	
			   
			   }
			   
			       }));
		   
		   },
		   
		   
		   
		   displayModelResults: function(rs, side) {
		   
		   if (side == undefined) {
			   
			   useSide = "";
			   
		   } else {
			   
			   useSide = "." + side;
		   }
		   
		   
		   	 functional.forIn(rs, lang.hitch(this,function(outp,pname){
			     
			  results = outp.results;
			  color = outp.color; 
		   		
		   		lcolor = lighterColor(color, 0.4);
			   
			   dataarray = []
			   protecteddataarray = []
			   labelarray = []
			   
			   //PROT_MECH
			   
			   i = 0;
			   for (att in results.value.features[0].attributes) {
			   
			   				if (att.indexOf("VALUE_") == 0) {
				   				labelarray.push({value:i+1, text:att});
				   		
				   				dataarray.push(0);
				   				protecteddataarray.push(0);
				   				i = i + 1;
			   				}
			   				
			   };
			   
			   
			   //alert(labelarray)
			   
			   dojo.forEach(results.value.features, function(item, i){
			   
			   		dojo.forEach(labelarray, function(lab, j){
			   			  //alert(lab.text + " " + item.attributes[lab.text])
			   			  if (item.attributes["PROT_MECH"] == " ") {
			   			      dataarray[j] = dataarray[j] + (item.attributes[lab.text] / 10000);
			   			  } else {
				   		  	  protecteddataarray[j] = protecteddataarray[j] + (item.attributes[lab.text] / 10000);  
			   			  }
			   		});
			   		
				   		//dataarray.push((item.attributes["Count"] * (30 * 30)) / 10000)
				   		//labelarray.push({value:i+1, text:item.attributes["LandCover"]})
			   });
			   
			   //alert(labelarray.length)
			   
			   if (results.paramName != "LandCoverSummary") {
				 tlabs = [];
				 dvals = [];
				 pvals = [];   
				 
				 for (att in [0,1,2,3,4,5]) {
				 		ch = parseInt(att) + 1
				 		tlabs.push({text:String(att),value:ch});
				 		dvals.push(0);
				 		pvals.push(0);
				 }
				 
				 
				   dojo.forEach(labelarray, function(lab, j){
				   		vtofind = parseInt(lab.text.replace("VALUE_", ""));
				   		dvals[vtofind] = dataarray[j];
				   		pvals[vtofind] = protecteddataarray[j];
				   		//if (j == 0) {labelarray[j] = "Nonbitat"}
				   }); 
				
			    labelarray = tlabs;
			    dataarray = dvals;
			    protecteddataarray = pvals;	    			   
			      
			   };
			   
			   natTable = {"Natural":0,"Other":0}
			   
		// make tables
			 if (results.paramName != "LandCoverSummary") {
			   
			   tnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.totarea" + useSide);
			   pnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.poftotal" + useSide);
			   cnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.cpercent" + useSide);
			   ppnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.percentp" + useSide);
			   
			   tota = 0
			   dojo.forEach(tnodes, function(n, j) {
				   
				   pa = dataarray[5-j] + protecteddataarray[5-j];
				   tota = tota + pa;
				   n.innerHTML = pa;
				   
				   ppval = ((protecteddataarray[5-j] / pa) * 100).toFixed(2)
				   if (ppval == "NaN") {
					ppnodes[j].innerHTML = ""  
				   } else {
				   	ppnodes[j].innerHTML = ((protecteddataarray[5-j] / pa) * 100).toFixed(2)
				   }
				   

				   
			   });
			   
			   
			   totp = 0
			   dojo.forEach(pnodes, function(n, j) {
				   
				   pa = (((dataarray[5-j] + protecteddataarray[5-j]) / tota) * 100);
				   totp = totp + pa;
				   outpa = pa;
				   n.innerHTML = outpa.toFixed(2);
				   
				   outtotp = totp;
				   cnodes[j].innerHTML = outtotp.toFixed(2);
				   
			   });
			   
			   
			  } 
			   
			  
			  //Make Charts
			   dojo.forEach(labelarray, lang.hitch(this, function(lab, j){
			   
			   		lab.text = lab.text.replace("VALUE_", "")
			   		if (lab.text == "0") {lab.text = "Non Habitat"}
			   		
			   		
			   		if (results.paramName == "LandCoverSummary") {
			   		
			   		  //alert(this.landCoverClasses[lab.text])
			   		  	textin = lab.text;
				   		lab.text = this.landCoverClasses[textin].title;
				   		totalamount = dataarray[j] + protecteddataarray[j];
				   		natTable[this.landCoverClasses[textin].lctype] = natTable[this.landCoverClasses[textin].lctype] + totalamount;
			   		}
			   
			   }));
			   
			   cloc = query("#" + this.domNode.id + " ." + results.paramName  + useSide);
			   
			   
			   var chart1 = new Chart(cloc[0], {stroke: "black", htmlLabels: false});
			   //chart1.addPlot("default", { type: "Bars", gap: 2});
			   chart1.addPlot("default", {type: "StackedBars", gap: 2});
			   chart1.addAxis("x", {minorTicks: false, title:"Area (Hectares)", titleOrientation:"away", htmlLabels: false});
			   chart1.addAxis("y", {vertical: true, leftBottom: true, labels: labelarray, minorTicks: false, htmlLabels: false});

			   //chart1.setTheme(Wetland);
			   chart1.addSeries("Protected",protecteddataarray,{stroke: {color:color}, fill: color});
			   chart1.addSeries("Unprotected",dataarray,{stroke: {color:lcolor}, fill: lcolor});
			  
			   var anim3b = new dc(chart1, "default");
			   //chart1.addPlot("default2", {type: "Bars", gap: 2, vAxis: "y2"});
			     
			   //dojo.forEach(dataarray, function(item, i){
			   		//alert(labelarray[i].text)
			   	   //chart1.addSeries(labelarray[i].text,[item]);
			   	//});
			  // chart1.addPlot("grid", { type: "Grid" });
			  
			   chart1.render();	
			   
			   //on(cloc[0],"mouseover",function() { f = chart1.getAxis("y");  f.opt.font = "35px arial,sans-serif;"; console.log(f); chart1.resize(1000, 700); chart1.fullGeometry().fullRender()})
			   
			   if (results.paramName == "LandCoverSummary") {
				 
				   cloc2 = query("#" + this.domNode.id + " .NaturalLandCoverChart" + useSide);
						 			   
				   chartTwo = new Chart(cloc2[0], {stroke: "black"});
						    
				   chartTwo.addPlot("default", {
				        type: Pie,
				        //font: "normal normal 11pt Tahoma",
				        //labels: false,
				        fontColor: "black",
				        labelOffset: -40,
				        radius: 100
				    })
				    
				    natpercent = ((natTable["Natural"] / (natTable["Other"] + natTable["Natural"]))*100).toFixed(1);
				    opercent = ((natTable["Other"] / (natTable["Other"] + natTable["Natural"]))*100).toFixed(1)
				    
				    chartTwo.addSeries("Series A", [
				        {y: natTable["Natural"], text: "Natural<br>(" + natpercent + "%)", stroke: "black", tooltip: "Natural (" + natpercent + "%)", fill: "#081", htmlLabels: false},
				        {y: natTable["Other"], text: "Other<br>(" + opercent + "%)", stroke: "black", tooltip: "Other (" + opercent + "%)" , fill: "#811", htmlLabels: false},
				    ]);
				    
				    chartTwo.render(); 
				    //legendTwo = new Legend({chart: chartTwo}, "legendTwo");  
				  
			  }
			 
			 }));  
			      
		   }
		   
        });
        

});




var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
        num = pad + num;
    }
    return num;
};

// Ratio is between 0 and 1
var changeColor = function(color, ratio, darker) {
    // Trim trailing/leading whitespace
    color = color.replace(/^\s*|\s*$/, '');

    // Expand three-digit hex
    color = color.replace(
        /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
        '#$1$1$2$2$3$3'
    );

    // Calculate ratio
    var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
        // Determine if input is RGB(A)
        rgb = color.match(new RegExp('^rgba?\\(\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '\\s*,\\s*' +
            '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
            '(?:\\s*,\\s*' +
            '(0|1|0?\\.\\d+))?' +
            '\\s*\\)$'
        , 'i')),
        alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

        // Convert hex to decimal
        decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
            /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
            function() {
                return parseInt(arguments[1], 16) + ',' +
                    parseInt(arguments[2], 16) + ',' +
                    parseInt(arguments[3], 16);
            }
        ).split(/,/),
        returnValue;

    // Return RGB(A)
    return !!rgb ?
        'rgb' + (alpha !== null ? 'a' : '') + '(' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ) + ', ' +
            Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ) +
            (alpha !== null ? ', ' + alpha : '') +
            ')' :
        // Return hex
        [
            '#',
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[0], 10) + difference, darker ? 0 : 255
            ).toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[1], 10) + difference, darker ? 0 : 255
            ).toString(16), 2),
            pad(Math[darker ? 'max' : 'min'](
                parseInt(decimal[2], 10) + difference, darker ? 0 : 255
            ).toString(16), 2)
        ].join('');
};
var lighterColor = function(color, ratio) {
    return changeColor(color, ratio, false);
};
var darkerColor = function(color, ratio) {
    return changeColor(color, ratio, true);
};

function polygonArea(ptevs) 
{
  numPoints = ptevs.length;
  area = 0;         // Accumulates area in the loop
  j = numPoints-1;  // The last vertex is the 'previous' one to the first

  for (i=0; i<numPoints; i++)
    { 
      area = area +  (ptevs[j].x+ptevs[i].x) * (ptevs[j].y-ptevs[i].y); 
      j = i;  //j is previous vertex to i
    }
  return Math.abs(area/2);
}

