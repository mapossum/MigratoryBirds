//

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/CompareByUnit.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang", 
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
    template, 
    domStyle, 
    domClass, 
    baseFx, 
    lang, 
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
           
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "compareunit",
            
            stype: "none",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
            landCoverClasses: {"1":{title:"Urban, Highways",lctype:"Other"},"2":{title:"Developed, Herbaceous",lctype:"Other"},"3":{title:"Agriculture",lctype:"Other"},"4":{title:"Forest",lctype:"Natural"},"5":{title:"Wetland",lctype:"Natural"},"6":{title:"Open Water",lctype:"Natural"},"7":{title:"Bare Earth, Shore",lctype:"Natural"},"8":{title:"Unclassified",lctype:"Other"}},
            
            destroy: function(){
  	   	
			 item = this.domNode;
					   	
				b = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "none");this.map.reposition();this.inherited(arguments);}),
				   		properties: {
					   		opacity: { start: 1, end: 0 }
					   		},
					   		duration: 400
					   	});
					   	
            	b.play();
            	
            },
            
            
            postCreate: function(){
            
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			 
			    // Run any parent postCreate processes - can be done at any point
			    
			    this.inherited(arguments);
			    
			    //this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/SummarizeAllLayersByArea/GPServer/SummarizeLayersByArea");
			    
			    if (this.stype == "model") {
			    	this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/MBSummarize/GPServer/SummarizeLayersByArea");
			    } else {
			    	this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/MBSummarize/GPServer/SummarizeHabitatByArea");
			    }
			    
			    //this.gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/SummarizeAreaSync/GPServer/SummarizeArea");
			    
		   },
		   
		   startup: function() {
		   
		   	this.inherited(arguments);
		   		   
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 
			 this.map.reposition();
			 
			 this.inputLayer = new esri.layers.GraphicsLayer();
			 
			 this.map.addLayer(this.inputLayer);
			 
			 usesites = query("#" + this.domNode.id + " .usesite");	
			 		 
			 on(usesites[0], "click", lang.hitch(this,this.dosite, {data:"out"})); 
			 
			 usepolys = query("#" + this.domNode.id + " .usepoly");
			 
			 //on(usepolys[0], "click", lang.hitch(this,this.dopoly));
			 dojo.forEach(usepolys, lang.hitch(this,function(item, i){
			 	
			 	on(item, "click", lang.hitch(this,this.dopoly,item)); 
			 }));
			 
			 subfeats = query("#" + this.domNode.id + " .submit-features");
			 on(subfeats[0], "click", lang.hitch(this,this.submitFeatures)); 
			 
			 subfeats = query("#" + this.domNode.id + " .submit-features2");
			 on(subfeats[0], "click", lang.hitch(this,this.submitFeatures2));
			 
			 
			 this.map.tip.setContent({title:"Select a Summary Level Above", text: "There is nothing to do on the map now.  You will be able to choose a location to summarize after you choose an option form the Summary Level dropdown.  Map navigation (pan and zoom) continue to work as normal."});
			 
			 //minusbuts = query("#" + this.domNode.id + " .minimize");
			 //on(minusbuts[0], "click", lang.hitch(this,this.minimize,minusbuts[0]));
			 
			 //closebuts = query("#" + this.domNode.id + " .closeit");
			 //on(closebuts[0], "click", lang.hitch(this,this.closeit));
			 
			 //query('#example').popover({title:"Hello",placement:"bottom",trigger:"hover",content:"You can put a lot of stuff here"}) 
			 
		   },
		   
		   _close: function() {
            
           this.map.removeLayer(this.inputLayer);
           
           //this.destroy();
			   
			   
		   },
		   		   
		   hidesteps: function(nohide) {
			   
			   steps = query("#" + this.domNode.id + " .step")
			   
			   dojo.forEach(steps, function(item, i){
			   
			   if (item.className.indexOf(nohide) < 0) {
			   		a = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "none");this.map.reposition();}),
				   		properties: {
					   		opacity: { start: 1, end: 0 }
					   		},
					   		duration: 600
					   	});
       
        	} else {
	        	
	        		//alert("found " + nohide)
	        		domStyle.set(item, "display", "");
	        		domStyle.set(item, "opacity", 0);
	        		
			   		a = baseFx.animateProperty({
				   		node: item,
				   		onEnd: lang.hitch(this, function(item) {domStyle.set(item, "display", "");this.map.reposition();}),
				   		properties: {
					   		opacity: { start: 0, end: 1 }
					   		},
					   		duration: 600
					   	});	        	
	        	
        	}
        	
        	a.play(); 
				   		   
				   //domStyle.set(item, "display", "none");
				   
			   });
			   
			   //stepshow = query("#" + this.domNode.id + " ." + nohide)
			   
			   //	domStyle.set(stepshow[0], "display", "");
			   
		   },
		   
		   dopoly: function(item) {
		   
		   	//alert(item.rel)
		   	this.hidesteps("step-step2area")
		   	
		   	this.UnitMapService = new esri.layers.ArcGISDynamicMapServiceLayer("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/Units/MapServer",
		   		{useMapImage:true});
		   		
		   	this.UnitMapService.setVisibleLayers([item.rel])
		   	
		   	this.map.addLayer(this.UnitMapService);
		   	
		   	this.inputLayer = new esri.layers.FeatureLayer("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/Units/MapServer/" + item.rel,{
			   						mode:esri.layers.FeatureLayer.MODE_SELECTION
			   						});

		   	symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 250, 30]), 2), new dojo.Color([230, 230, 20, 0.25]));
		   				   						
			this.inputLayer.setSelectionSymbol(symbol)
			   						
			this.map.addLayer(this.inputLayer);
			
			this.UnitClickHandle = dojo.connect(this.map,"onClick", this, this.SelectUnit);
			   				
		   
		   },
		   
	SelectUnit: function(evt) {
	

	      var query = new esri.tasks.Query();
		  
		  toleranceInPixel = 1;
		  point = evt.mapPoint;
		  var pixelWidth = this.map.extent.getWidth() / this.map.width;
       	  var toleraceInMapCoords = toleranceInPixel * pixelWidth;
		  query.geometry = new esri.geometry.Extent(point.x - toleraceInMapCoords,
                    point.y - toleraceInMapCoords,
                    point.x + toleraceInMapCoords,
                    point.y + toleraceInMapCoords,
                    this.map.spatialReference );
                    
           
		  //query.where = this.maplayer.layerDefinitions[1];	
          
		  thing = this;
		  
          this.inputLayer.selectFeatures(query,esri.layers.FeatureLayer.SELECTION_ADD,function(f,sm) {thing.featureSelector(f,sm,thing)});
			 
			 
			 //alert(evt.mapPoint)  
			   
		},
		 
		   
	featureSelector: function(features, selectionMethod) {
		
		//alert(features)
		//this.removeAll();
		
		//feats = this.featureLayer.getSelectedFeatures()
		
	},
		   
		   dosite: function(e) {
		   
		   	//alert(e.data)
		   	
		   	this.map.tip.setContent({title:"Click to draw a polygon on the map",text:"Click a location on the map to start drawing a polygon shape that represents the site you would like to create.  You will click the map several times each click will be a vertex on polygon.  Map navigation (pan and zoom) continue to work as normal."})
		   	
		   	this.hidesteps("step-step2site")

		   	this.toolbar = new esri.toolbars.Draw(map);

		   	this.toolbar.activate(esri.toolbars.Draw.POLYGON, {showTooltips:true});
		   	
		   	//on(this.toolbar, this.toolbar.onDrawEnd, function() {alert('')});
		   	
		   	//dojo.connect(this.toolbar, "onDrawEnd", this, this.addToMap);
		   	
		   	dojo.connect(this.toolbar, "onDrawEnd", this, this.addToMap);
		   	
		   	this.clicklisten = dojo.connect(map, "onClick", this, this.addPoint);
		   	
		   	this.clicks = [];
			   
			   
		   },
		   
		   
		   addPoint: function(evt) {
		   
		   	this.clicks.push(evt.mapPoint)
		   	//console.log(evt.mapPoint);
		   
		   	areatext = "";
		   	
		   	if (this.clicks.length > 2) {
		   	
		   	   parea = polygonArea(this.clicks);
		   	   
		   	   harea = parea / 10000;
		   	   
		   	   acres = parea / 4046.86;
			   	
			   areatext = "  <br>The area of the polygon you are currently drawing is: " + harea.toFixed(2) + " ha or " + acres.toFixed(2) + " acres";	
			   	
		   	}
		   	
		   	this.map.tip.setContent({title:"Click to add another vertex to your site polygon.",text:"Click on another location that represents another vertex on the site polygon you are drawing.  When you are done drawing the polygon <b>double click to finish</b> it." + areatext})
		   
		   },
		   
		   addToMap: function(geometry) {
		   
		   	this.clicks = [];
		   
		   	this.map.tip.setContent({title:"Submit Site, or draw <i>another</i> polygon on the map",text:"If you would like you can draw multiple polygons on the map to represent a single non-continuous site.  If you are <b>done</b>, just click the <b>submit</b> button above.  Map navigation (pan and zoom) continue to work as normal."})
		   	
		   	
		   	symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([250, 250, 30]), 2), new dojo.Color([230, 230, 20, 0.25]));
		   	graphic = new esri.Graphic(geometry, symbol);
		   	graphic.setAttributes( {"Name":"UserPolygon"});
		   	this.inputLayer.add(graphic);		   	
		   	
		   },
		   
		   
		   processAnimationStart: function() {
		   
		   	  color1 =  "rgb(217, 237, 247)"
              color2 =  "rgb(175, 205, 230)"
              
              ccolor = dojo.getStyle(this.domNode, "backgroundColor");
              
              if (ccolor == color1) {
	              outcolor = color2
              } else {
	              outcolor = color1
              }
			  
			  this.processAnimation = baseFx.animateProperty({
		        node: this.domNode,
		        duration: 900,
		        properties: {
		            backgroundColor: outcolor,
		        },
		        onEnd: lang.hitch(this, function() {
		            // Clean up our mouseAnim property
		            //this.mouseAnim = null;
		            this.processAnimationStart();
		        })
		    }).play(); 
			   
		   },
		   
		   processAnimationEnd: function() {
		   
		   
		   this.processAnimation.stop();
		   
		   this.processAnimation = null;
		   
		   },
		   
		   
		   changecheck: function(e,cb) {
			   
			   cbs = dojo.query(cb).children();
			   
			   if (cbs[0].checked == true) {
				   
				   this.inputLayer.show()
				   
			   } else {
				   
				   this.inputLayer.hide() 
			   }
			   
		   },
		   
		   
		   submitFeatures2: function(e) {
		   		
		   		this.map.tip.setContent()
		   		
		   		dojo.disconnect(this.UnitClickHandle);
		   		dojo.disconnect(this.clicklisten);
		   		
		   		this.container.processAnimationStart();
		   
		   	 	this.hidesteps("step-processing");
		   	 	
				features = this.inputLayer.getSelectedFeatures();
		        //features.push(graphic);
		        featureSet = new esri.tasks.FeatureSet();
		        featureSet.features = features;
		        
		        iac = query("#" + this.domNode.id + " .inputareacheck");
		        
		        cbs = dojo.query(iac[0]).children();
		        
		    this.inputAreacheckBox = new dijit.form.CheckBox({
			   name: "checkBox",
			   //value: "agreed",
			   checked: true,
			   onChange: lang.hitch(this,function(b){ if (b == true) {this.inputLayer.show()} else {this.inputLayer.hide()}})
			   }, cbs[0]);
		        
		        
		        //on(iac[0], "click", lang.hitch(this,function(e) {this.changecheck(e,iac[0])})); 
		
		
		        params = {"InputFeatures": featureSet};
		        
		        
		        //runsub = dojo.hitch(this, this.gp.submitJob);
		        
		        //runsub(params, function(jobInfo) {this.getTable(jobInfo,this)} , function(jobInfo) {console.log(jobInfo.jobStatus)},function(error){alert(error);});
		        
		        //this.gp.submitJob(params, function(jobInfo) {thing.getTable(jobInfo,thing)} , function(jobInfo) {console.log(jobInfo.jobStatus)});
		        
		        
		        this.gp.submitJob(params, lang.hitch(this,this.getTable));
		        
		        
		        FeatureExtent = esri.graphicsExtent(features);
		
		        this.map.setExtent(FeatureExtent, true);
				
				//this.gp.execute(params, function(result, mess) {thing.displayTable(result,thing)}, function(error){alert(error)}) 	
		   
		   },

		   
		   submitFeatures: function(e) {
		   	
		   		this.toolbar.deactivate();
		   		
		   		this.map.tip.setContent()
		   		
		   		dojo.disconnect(this.UnitClickHandle);
		   		dojo.disconnect(this.clicklisten);
		   		
		   		this.container.processAnimationStart();
		   
		   	 	this.hidesteps("step-processing");
		   	 	
				features = this.inputLayer.graphics;
		        //features.push(graphic);
		        featureSet = new esri.tasks.FeatureSet();
		        featureSet.features = features;
		        
		        iac = query("#" + this.domNode.id + " .inputareacheck");
		        
		        cbs = dojo.query(iac[0]).children();
		        
		    this.inputAreacheckBox = new dijit.form.CheckBox({
			   name: "checkBox",
			   //value: "agreed",
			   checked: true,
			   onChange: lang.hitch(this,function(b){ if (b == true) {this.inputLayer.show()} else {this.inputLayer.hide()}})
			   }, cbs[0]);
		        
		        
		        //on(iac[0], "click", lang.hitch(this,function(e) {this.changecheck(e,iac[0])})); 
		
		
		        params = {"InputFeatures": featureSet};
		        
		        
		        //runsub = dojo.hitch(this, this.gp.submitJob);
		        
		        //runsub(params, function(jobInfo) {this.getTable(jobInfo,this)} , function(jobInfo) {console.log(jobInfo.jobStatus)},function(error){alert(error);});
		        
		        //this.gp.submitJob(params, function(jobInfo) {thing.getTable(jobInfo,thing)} , function(jobInfo) {console.log(jobInfo.jobStatus)});
		        
		        
		        this.gp.submitJob(params, lang.hitch(this,this.getTable));
		        
		        
		        FeatureExtent = esri.graphicsExtent(features);
		
		        this.map.setExtent(FeatureExtent, true);
				
				//this.gp.execute(params, function(result, mess) {thing.displayTable(result,thing)}, function(error){alert(error)}) 	
		   
		   },
		   
		   getTable: function(jobInfo) {
		   
		   	   this.container.processAnimationEnd("success")
		   	 
		   	   //this.container.mouseBackgroundColor = "rgb(70,136,71)";
		   	   //this.container.baseBackgroundColor = "rgb(236, 252, 236)";
			   
			   //Change these functions up!!!
			   
			   outputs = [{name:"LandCoverSummary",color:"#081"},{name:"WaterBirdSummary",color:"#018"},{name:"ShoreBirdSummary",color:"#F60"},{name:"LandBirdSummary",color:"#811"}]

			   query("#" + this.domNode.id + " ." + this.stype + "Results").show()
			   
			   if (this.stype == "model") {
			   		displayFunction = this.displayModelResults;
			   	} else {
			   		displayFunction = this.displayHabitatResults;
			   		}
			   
			 dojo.forEach(outputs, lang.hitch(this,function(outp, i){
			     
			   this.gp.getResultData(jobInfo.jobId, outp.name, lang.hitch(this, function(results) { 
				   
				   a = lang.hitch(this, displayFunction, results, outp.color);
				   
				   a();
				   
			    }));			   

			   
			   }));		
			      
		   },
		   
		   displayHabitatResults: function(results, color) {
		   
		   	if (results.paramName != "LandCoverSummary") {
		   		lcolor = lighterColor(color, .4);
		   		
		   		this.hidesteps("step-result")
			   
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
			   
			   
			   dojo.forEach(labelarray, function(lab, j){
				   		//vtofind = parseInt(lab.text.replace("VALUE_", ""));
				   		//dvals[vtofind] = dataarray[j];
				   		//pvals[vtofind] = protecteddataarray[j];
				   		//if (j == 0) {labelarray[j] = "Nonbitat"}
				   		
				   		val = (parseFloat(lab.text.replace("VALUE_", "")) / 100)
				   		
				   		//alert(val)
				   		
				   		labelarray[j].text =  "" + val;
				   		
				   		//}
				   		
				   }); 	   
			   
			   
			   cloc = query("#" + this.domNode.id + " ." + results.paramName.replace("Summary","HabitatSummary"));
			   
			   var chart1 = new Chart(cloc[0], {stroke: "black"});
			   //chart1.addPlot("default", { type: "Bars", gap: 2});
			   chart1.addPlot("default", {type: "StackedBars", gap: 2});
			   chart1.addAxis("x", {minorTicks: false, title:"Area (Hectares)", titleOrientation:"away", htmlLabels: false});
			   chart1.addAxis("y", {vertical: true, leftBottom: true, labels: labelarray, minorTicks: false, htmlLabels: false});

			   //chart1.setTheme(Wetland);
			   chart1.addSeries("Protected",protecteddataarray,{stroke: {color:color}, fill: color});
			   chart1.addSeries("Unprotected",dataarray,{stroke: {color:lcolor}, fill: lcolor});
			  
			   var anim3b = new dc(chart1, "default");
			  
			   chart1.render();	
			   
			   }
		   
		   },
		   
		   displayModelResults: function(results, color) {
		   
		   		//result = results[0];
		   		
		   		lcolor = lighterColor(color, .4);
		   		
		   		this.hidesteps("step-result")
			   
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
			   
			   tnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.totarea");
			   pnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.poftotal");
			   cnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.cpercent");
			   ppnodes = query("#" + this.domNode.id + " ." + results.paramName + "Table.percentp");
			   
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
			   
			   cloc = query("#" + this.domNode.id + " ." + results.paramName);
			   
			   
			   var chart1 = new Chart(cloc[0], {stroke: "black"});
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
				 
				   cloc2 = query("#" + this.domNode.id + " .NaturalLandCoverChart");
						 			   
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
				        {y: natTable["Natural"], text: "Natural<br>(" + natpercent + "%)", stroke: "black", tooltip: "Natural (" + natpercent + "%)", fill: "#081"},
				        {y: natTable["Other"], text: "Other<br>(" + opercent + "%)", stroke: "black", tooltip: "Other (" + opercent + "%)" , fill: "#811"},
				    ]);
				    
				    chartTwo.render(); 
				    //legendTwo = new Legend({chart: chartTwo}, "legendTwo");  
				  
			  }
			   
			      
		   },
		   
		   _changeBackground: function(e) {
			    
		   
		   if (e.type == "mouseover") {
		    toCol = this.mouseBackgroundColor;
		    toCol2 = this.mouseTextColor;
		   } else {  
			toCol = this.baseBackgroundColor; 
			toCol2 = this.baseTextColor;
		   }
		   
		   titlenode = query("#" + this.domNode.id + "> h4")
		   
		   
		    // If we have an animation, stop it
		    if (this.mouseAnim) { this.mouseAnim.stop(); }
		 
		    // Set up the new animation
		    this.mouseAnim = baseFx.animateProperty({
		        node: this.domNode,
		        properties: {
		            backgroundColor: toCol
		        },
		        onEnd: lang.hitch(this, function() {
		            // Clean up our mouseAnim property
		            this.mouseAnim = null;
		        })
		    }).play();
		    
		    this.mouseAnim = baseFx.animateProperty({
		        node: titlenode[0],
		        properties: {
		            color: toCol2
		        },
		        onEnd: lang.hitch(this, function() {
		            // Clean up our mouseAnim property
		            this.mouseAnim = null;
		        })
		    }).play();
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

