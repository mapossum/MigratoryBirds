

Ext.define('CrProfileTool', {
    //extend: 'Ext.menu.Item',
    extend: 'Ext.Button',
	//requires: ['GrMapper.GrMap'],
	alias: 'widget.crprofile',
	
	windowopen: false,
	
	text: "Nearshore Waves",
	defaultDistance: 30,
	AlongDist: 0,
	
	
	distext: "Thank you for exploring the Nearshore Waves tool that is provided subject to the Terms of Use (http://www.nature.org/aboutus/governance/terms-of-use/index.htm).<br>This website contains a compilation of data for informational purposes. The Nature Conservancy nor the Natural Capital Project warrant or guarantee the quality of the content on this website. By choosing to close this window you acknowledge these terms. Please also refer to our Privacy Policy (http://www.nature.org/aboutus/governance/privacy-policy.xml) for more information.<br><br><b>Nearshore Waves</b><br>Via its GIS-based decision support tool named InVEST, the Natural Capital Project has been building models to illustrate nature’s benefits backed by robust scientific research.  We are now integrating portions of Marine InVest models with the Gulf of Mexico Coastal Resilience tool.  In particular, we are incorporating InVest wave modeling capabilities to calculate the potential of natural oyster reefs for reducing wave height, and wave energy, in coastal areas.  This model is called Nearshore Waves.<br><br>Whilst every effort was made to ensure the Nearshore Waves model and Coastal Resilience tool is free of errors, we do not warrant, guarantee or make any assumptions regarding the use, availability, reliability, or results of the software. This includes the accuracy, correctness or completeness of any element of Nearshore Waves or of information provided within Gulf of Mexico Coastal Resilience.<br><br><b>The Nature Conservancy, Natural Capital Project and the University of Southern Mississippi</b><br>The Nature Conservancy (http://nature.org/marine), the Natural Capital Project (http://www.naturalcapitalproject.org) and the University of Southern Mississippi (http://www.usm.edu) are collaborating on innovative models and decision support tools that allow planners and managers evaluate how restored oyster reefs can protect shorelines from erosion while stimulating a recovering fisheries economy.<br><br><b>Coastal Resilience</b><br>The Coastal Resilience network is a community of practitioners around the world who are applying planning innovations to coastal hazard and adaptation issues. The network provides access to tools, information and training focused on nature-based solutions in a consistent and cost effective manner.",
	
	helptext: {
					height: "Height of your reef, from base to crest",
					bwidth: "Cross-shore footprint (along the direction of wave propagation) of the reef",
					units: "Specify units in Feet or Meters",
					cwidth: "Cross-shore width (along the direction of wave propagation) of the reef",
					dshore: "Distance offshore from the shoreline where the reef will be placed.",
					ashore: "The reef length along the shore.",
					shape: "Your reef can either be trapezoidal or a concrete dome.  Click on the image below for a visual representation of trapezoidal or concrete dome reefs as well as definitions of the inputs that you’ll enter in the cells below. <br><br><a href='resources/images/Oyst_hiRes_small.png' target='_blank'> <img src='resources/images/Oyst_hiRes_small_thumb.png' width=100></a>",
					wave: "Choose from 4 categories of wave that can reach the shore:<br><br> <ul><li><b>Maximum</b> wave is the average wave height computed using maximum wind speed values,</li><li><br><br><b>Strong</b> wave is the average wave height computed from winds speed above the 90th percentile speed value,<br><br> </li><li><b>Average</b> wave is the average wave height computed from average wind speed values,<br><br> </li><li><b>Most common</b> wave is the average wave height computed from most common (modal) wind speed values.</li></ul>"
			},

	
	
	config: {
        map: {}
    },
	
    initComponent: function() {
		
		this.callParent();

	    //Ext.data.JsonP.request({url:this.url,params:{f:'json'},success: this.loadInitial, scope: this});
														   										   
		//this.on('click', this.showToolWindow, this);
		
		this.on('click', this.showdisclaimer, this);
		
		//this.showToolWindow();
	
		},
		
		
	showdisclaimer: function() {
		
	
		this.disclaimer = new Ext.Window({
                			layout      : 'fit',
               				closeAction :'close',
							title: 'Nearshore Waves Tool',
							autoScroll : true,
                			plain       : true,
							resizable   : false,
							width: 600,
							constrain: true,
							bodyPadding: 10,
							collapsible: false,
						//	listeners: {beforeclose:removesuitlayer},
							closable: true,
							modal: true,
							html: this.distext  
            			});	
            			
        this.disclaimer.show();  
        
        this.disclaimer.on('close', this.showToolWindow, this); 
		
		
	},
	
	
	showToolWindow: function() {
	
	try {
	Ext.Array.each(this.map.layerIds, function(it, index, allits){
			
				if (it.indexOf("base_" + map.id + "_") > -1) {	
					this.map.removeLayer(this.map.getLayer(it))
											   }
											   }, this);
			} catch(err) {
				
			}
	
	veTileLayer2 = new esri.virtualearth.VETiledLayer({
	  bingMapsKey: "Ah29HpXlpKwqVbjHzm6mlwMwgw69CYjaMIiW_YOdfTEMFvMr5SNiltLpYAcIocsi",
	  mapStyle: esri.virtualearth.VETiledLayer.MAP_STYLE_AERIAL,
	  title: "Bing Maps Imagery"
	});
	
	veTileLayer2.id = "base_" + this.map.id + "_bmi"
	
	this.map.addLayer(veTileLayer2);

Ext.Array.each(this.map.layerIds, function(it, index, allits){
		
			if (it.indexOf("base_" + map.id + "_") > -1) {	
				this.map.reorderLayer(this.map.getLayer(it),0);
										   }
										   }, this);


	thing = this;
	
	if (this.windowopen == false) {	
		
var wavestore = Ext.create('Ext.data.Store', {
    fields: ['value', 'name'],
    data : [
		{"value":"Maximum wave conditions", "name":"Maximum wave conditions"},
        {"value":"Strong wave conditions", "name":"Strong wave conditions"},
        {"value":"Average wave conditions", "name":"Average wave conditions"},
        {"value":"Most common wave conditions", "name":"Most common wave conditions"}
    ]
});

// Create the combo box, attached to the states data store
wavefield = Ext.create('Ext.form.ComboBox', {
    fieldLabel: 'Wave ',
    store: wavestore,
    queryMode: 'local',
    displayField: 'name',
    valueField: 'value',
	name: 'wave',
	editable: false,
	listeners: {'focus': function() {thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name])}},
	forceSelection: true
});

wavefield.setValue("Average wave conditions");
	
	thing = this;
	
	this.mainForm = Ext.create('Ext.form.Panel', {
    bodyPadding: 5,
    //width: 395,

    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120
    },
    // The fields
    defaultType: 'textfield',
    items: [{
            xtype      : 'fieldcontainer',
            fieldLabel : 'Units',
            defaultType: 'radiofield',
            defaults: {
                flex: 1
            },
            layout: 'hbox',
            items: [
			    {
                    boxLabel  : 'Meters',
                    checked: true,
                    name      : 'units',
                    inputValue: 'meters',
					listeners: {'focus': function() {console.log(thing.helptext[this.name])}},
                    handler: function() {if (this.value == true) {this.up('form').getForm().findField('cwidth').show()} else {this.up('form').getForm().findField('cwidth').hide()}; thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name]) }
                    //this.up('form').getForm().getFieldValues().depth
                },
                {
                    boxLabel  : 'Feet',
                    name      : 'units',
                    inputValue: 'feet'
                } 
            ]
        },{
            xtype      : 'fieldcontainer',
            fieldLabel : 'Reef Shape',
            defaultType: 'radiofield',
            defaults: {
                flex: 1
            },
            layout: 'hbox',
            items: [
			    {
                    boxLabel  : 'Trapezoidal',
                    checked: true,
                    name      : 'shape',
                    inputValue: 'trap',
                    handler: function() {if (this.value == true) {this.up('form').getForm().findField('cwidth').show()} else {this.up('form').getForm().findField('cwidth').hide()} ; thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name]) }
                    //this.up('form').getForm().getFieldValues().depth
                },
                {
                    boxLabel  : 'Dome',
                    name      : 'shape',
                    inputValue: 'ball'
                } 
            ]
        },{
        fieldLabel: 'Height',
        name: 'height',
        allowBlank: false,
		listeners: {'focus': function() {thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name])}},
            value: 0.3
    },{
        fieldLabel: 'Base Width',
        name: 'bwidth',
        allowBlank: false,
		listeners: {'focus': function() {thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name])}},
        value: 10
    },{
        fieldLabel: 'Crest Width',
        name: 'cwidth',
        allowBlank: false,
		listeners: {'focus': function() {thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name])}},
        value: 4
    },wavefield,{
        fieldLabel: 'Distance from Shore',
        name: 'dshore',
        allowBlank: false,
		listeners: {'focus': function() {thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name])}},
        value: this.defaultDistance
	},{
	    fieldLabel: 'Reef Length',
	    name: 'ashore',
	    allowBlank: false,
		listeners: {'focus': function() {thing.mainForm.up('panel').items.get(1).items.get(0).update(thing.helptext[this.name])}},
	    value: this.AlongDist
	},{
	  //          xtype: 'button',
	  //          text : 'Refresh Reef Location(s) on Map',
	   //         listeners: {click:this.reprocessPoint}
	     //   },{
	                    xtype: 'button',
	                    text : 'Refresh Reef Location(s) on Map',
	                    style: {background: "#ff8888"},
	                    hidden: true,
	                    listeners: {click:this.reprocessPoint}
	                },
	                
	                {
                    boxLabel  : 'Bathymetry (Check to Turn On)',
                    checked: false,
                    width: 200,
                    name      : 'bathy',
                    xtype: 'checkboxfield',
                    handler: function(checked) {if (this.getValue( ) == true) {thing.bathylays.show()} else {thing.bathylays.hide()}}

                },
//    },{
//        xtype      : 'fieldcontainer',
//        html: "Distance From Shore:",
//        padding: '5'
//    },{
//    xtype: 'sliderfield',
//    value: 30,
//    increment: 1,
//    name: 'dshore',
//    minValue: 10,
//    maxValue: 500
//    }
	],
    // Reset and Submit buttons
    buttons: [{
     //   text: 'Choose A Different Point',
     //   handler: function() {
     //       this.up('form').getForm().reset();
    //    }
    //},{
        text: 'Reset Form',
        handler: function() {
        

			
            this.up('form').getForm().reset();
            thing.mainForm.getForm().findField('wave').setValue("Average wave conditions");
        //thing.toolWindow.items.get(0).show();
		//thing.toolWindow.items.get(1).hide();
            
        }
    }, {
	    
	    text: 'New Reef Location',
	    //scope: this,
        handler: function() {
        
            thing.map.graphics.clear()
			thing.map.removeLayer(thing.landpoints);
			thing.map.removeLayer(thing.reefpoint);
		
			//thing.clickhandle = dojo.connect(thing.map,"onClick", thing.processPoint, thing);
			thing.reint();
               
        }
    
    }, {
        text: 'Submit',
        formBind: true, //only enabled once the form is valid
        disabled: true,
        handler: this.runProfile,
		scope: this
    }],
	region:'center'
});
		
		this.resultspan = {xtype:'panel', html:'', bodyPadding: '15 10 10 10', width: 450, height: 150, hidden: true}
		
		
		this.helppan = {
			  region:'west',
			  xtype: 'panel',
			  margins: '0 0 0 0',
			  width: 150,
			  layout: "fit",
			  title: "Help",
			  bodyPadding: 5,
			  collapsible: true,
			  autoScroll: true,
			  collapsed: false,
			  html: this.helptext.shape
		  }

		this.legpan = {
			  region:'south',
			  xtype: 'panel',
			  margins: '0 0 0 0',
			  width: 435,
			  height:140,
			  layout: "fit",
			  title: "Legend",
			  bodyPadding: 5,
			  collapsible: true,
			  autoScroll: true,
			  collapsed: false,
			  html: "<table border='0' WIDTH='100%'><tr><td width='33%'><img src='resources/images/oystersideorange.png' width=40></td><td width='33%'><img src='resources/images/oystersideblue.png' width=40></td><td width='33%'><img src='resources/images/dashline.png' width=40></td></tr><tr><td><span style='font-size:10px'>Reef Centerline Point</span></td><td><span style='font-size:10px'>Reef Point <br>(~250m from centerline)</span></td><td><span style='font-size:10px'>Reef footprint </br>(reef length)</span></td></tr></table><br><span style='font-size:10px'>Above oyster symbols courtesy of the Integration and Application Network, University of Maryland Center for Environmental Science (<a href='http://ian.umces.edu/symbols/' target='_blank'>ian.umces.edu/symbols/</a></span>)"
		  } 			
            				
		
		this.toolWindow = new Ext.Window({
                			layout      : 'fit',
               				closeAction :'close',
							title: 'Nearshore Waves Tool',
							autoScroll : true,
                			plain       : true,
							resizable   : true,
							constrain: true,
							collapsible: false,
							renderTo: this.map.id,
						//	listeners: {beforeclose:removesuitlayer},
							closable: true,
							modal: false,
							items:     [{xtype:'panel', html:'<br> Please click a location along the shoreline of Mobile Bay.  <br><br>The location that you click represents the location directly inland from where the modeled reef will be located.  <br><br>After you choose a point, you will enter the modeled reef characteristics, including the distance from shore.', bodyPadding: '15 10 10 10', width: 450, height: 180},{xtype:'container', layout: 'border', width: 450, height: 450, hidden: true, items: [this.helppan,this.mainForm, this.legpan]		
										},this.resultspan]
		  
            			});
	
		
		this.on('click', this.showToolWindow, this)
		
		this.mainForm.getForm().findField('dshore').on("change", this.locDirty, this);
		this.mainForm.getForm().findField('ashore').on("change", this.locDirty, this);
		
		//this.mainForm.getForm().findField('dshore').on("change", this.distChange, this);
		//this.mainForm.getForm().findField('ashore').on("change", this.reprocessPoint, this);
		
		//this.mainForm.getForm().findField('height').on("click", function() {alert('height')}, this);
		//this.mainForm.getForm().findField('units').on("change", this.distChange, this);
					
		
		initExtent = new esri.geometry.Extent({"xmin":-9832697.143725,"ymin":3529878.509505,"xmax":-9762729.803975,"ymax":3594815.302195,"spatialReference":{"wkid":102100}});
		this.map.setExtent(initExtent);
		
		this.toolWindow.show();
		this.toolWindow.alignTo(this.map.id,"tr-tr", [-2, 30]);
			
		this.reint();
		
		this.toolWindow.on('beforeclose',this.closetool, this);
		
		this.windowopen = true;
		
		}
		
	},
	
	reint: function() {
	
	
	this.bathylays = new esri.layers.ArcGISDynamicMapServiceLayer("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/ReefProfile/MapServer", {opacity:0.7});
	this.bathylays.setVisibleLayers([3,4]);
	this.map.addLayer(this.bathylays);
	this.bathylays.hide();

		thing = this;
		//alert(this.xtype)
		this.clickhandle = dojo.connect(this.map,"onClick", function(evt) {thing.processPoint(evt,thing)}, this);
		

		var symbol = new esri.symbol.SimpleMarkerSymbol();
		symbol.style = esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE;
		symbol.setOutline(0)
		symbol.setSize(8); 
		symbol.setColor(new dojo.Color([255,0,0,0])); 

		var renderer = new esri.renderer.SimpleRenderer(symbol);
//		
//		
		this.landpoints = new esri.layers.FeatureLayer("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/ReefProfile/MapServer/0",{
	          mode: esri.layers.FeatureLayer.MODE_SELECTION,
         outFields: ["*"]
        });
//		
		this.landpoints.setRenderer(renderer);
//        
        this.map.addLayer(this.landpoints);
		
 		//Height and Width are specified in points
  var symbolreef =  new esri.symbol.PictureMarkerSymbol({
    "url":"resources/images/oystersideblue.png",
    "height":50,
    "width":50,
    "type":"esriPMS"
  });

		var renderer2 = new esri.renderer.SimpleRenderer(symbolreef);
		
		this.reefpoint = new esri.layers.FeatureLayer("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/ReefProfile/MapServer/1",{
          mode: esri.layers.FeatureLayer.MODE_SELECTION,
         outFields: ["*"]
        });
		
		this.reefpoint.setRenderer(renderer2);
		
		this.map.addLayer(this.reefpoint);
		
		

		
	},
	
	locDirty: function() {
	
	  //alert(this.mainForm.id);
	  buts = Ext.ComponentQuery.query('#' + this.mainForm.id + ' button');
	  buts[0].show();
	 
	  //buts[2].setDisabled(false);
	  
	},
	
	reprocessPoint: function(o,nval) {
		
		nval = (thing.mainForm.getForm().findField('ashore').value) / 2;
		
		if (thing.mainForm.getForm().findField('units').value == false) {
			nval = Math.round(nval * 0.3048)
		}


		var pointSymbol = new esri.symbol.SimpleMarkerSymbol();
		pointSymbol.setOutline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 1);
		pointSymbol.setSize(5);
		pointSymbol.setColor(new dojo.Color([0,255,0,0.25]));
		
		thing.AlongDist = nval;
        var graphic = new esri.Graphic({"geometry":{"x":thing.xval,"y":thing.yval,"spatialReference" : {"wkid" : 102100}}},pointSymbol);
        //map.graphics.add(graphic);

        var features= [];
        features.push(graphic);
        var featureSet = new esri.tasks.FeatureSet();
        featureSet.features = features;
        var params = { "ClickLocation":featureSet, "AlongShoreDistance":nval};
		
		gp = new esri.tasks.Geoprocessor("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/OysterReefProfileTool/GPServer/FindClosestPoints");
		gp.execute(params, thing.closestPoint, function(error) {alert(error)});

		thing.toolWindow.items.get(0).update("<center>Please wait a moment for the point data to load...<br><img src='resources/images/loading.gif'></center>")
		
		buts = Ext.ComponentQuery.query('#' + thing.mainForm.id + ' button');
		buts[0].hide();
		
	},
	
	processPoint: function(evt, thing) {
	
		dojo.disconnect(thing.clickhandle);
		
		map.graphics.clear();
 		var pointSymbol = new esri.symbol.SimpleMarkerSymbol();
        pointSymbol.setOutline = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 1);
        pointSymbol.setSize(5);
        pointSymbol.setColor(new dojo.Color([0,255,0,0.25]));

        var graphic = new esri.Graphic({"geometry":{"x":evt.mapPoint.x,"y":evt.mapPoint.y,"spatialReference" : {"wkid" : 102100}}},pointSymbol);
        //map.graphics.add(graphic);

        var features= [];
        features.push(graphic);
        var featureSet = new esri.tasks.FeatureSet();
        featureSet.features = features;
        var params = { "ClickLocation":featureSet, "AlongShoreDistance":thing.AlongDist};
		
		gp = new esri.tasks.Geoprocessor("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/OysterReefProfileTool/GPServer/FindClosestPoints");
		gp.execute(params, thing.closestPoint, function(error) {alert(error)});


		//alert(thing.xtype)
		
		thing.toolWindow.items.get(0).update("<center>Please wait a moment for the point data to load...<br><img src='resources/images/loading.gif'></center>")
		
		thing.distChange(thing.mainForm.getForm().findField('dshore'),thing.mainForm.getForm().findField('dshore').value);

		buts = Ext.ComponentQuery.query('#' + thing.mainForm.id + ' button');
		buts[0].hide();		
	},
	
	closestPoint: function(results, messages) {
		
		//alert(results[1].value);
		//alert(results[2].value);
		
		thing.landpoint = new esri.geometry.Point( {"x": results[1].value, "y": results[2].value," spatialReference": {" wkid": 102100 } });
		
		//thing.tranNumber = results[0].value;
		
		thing.tranNumber = eval(results[4].value);
		
		thing.tranNumber.sort(function(a,b){return a-b});
		
		thing.xval = results[1].value;
		thing.yval = results[2].value;
		
		thing.toolWindow.items.get(0).hide();
		thing.toolWindow.items.get(1).show();
		
		strout = ""
		Ext.Array.forEach(thing.tranNumber, function(it,ind,all) {

		if (ind != 0) {strout = strout + " OR "}
			strout = strout + "PTID = " + it;

				}, thing)
			
		var query1 = new esri.tasks.Query();
		query1.outFields = ['*'];
		query1.returnGeometry = true;
		query1.where = strout;
	
		
		thing.landpoints.selectFeatures(query1,esri.layers.FeatureLayer.SELECTION_NEW,function(f,sm) {});
		
		thing.distChange(thing.mainForm.getForm().findField('dshore'),thing.mainForm.getForm().findField('dshore').value);
	},
	
	distChange: function(form, newValue, oldValue, eOpts) {

	if (this.mainForm.getForm().findField('units').value == true) {
			pid = newValue;
	} else {
		
			pid = Math.round(newValue * 0.3048)
	}
	
	
	if (newValue != "") {
		
		strout = ""
		thing = this;
		Ext.Array.forEach(this.tranNumber, function(it,ind,all) {
		
			if (ind != 0) {strout = strout + " OR "}
				strout = strout + "Id = " + it;
		
						}, thing)
		
		var query2 = new esri.tasks.Query();
		query2.outFields = ['*'];
		query2.returnGeometry = true;
		query2.where = "PT_ID = " + pid + " AND ( " + strout + " )";
		
		
		thing = this;
		this.reefpoint.selectFeatures(query2,esri.layers.FeatureLayer.SELECTION_NEW, function(f,sm) {thing.zoomtoselectedfeatures(f,sm,thing, oldValue)});
		
	}
		//getSelectedFeatures()
	},
	
	zoomtoselectedfeatures: function(f, sm, thing,oldValue) {
	
	landp = thing.landpoints.getSelectedFeatures()

	thing.map.graphics.clear()

	if (f.length != 0) {
	
		zoomfac=400;
		
		//symbolreef = []
		
		var uvrJson = {"type": "uniqueValue",
		  "field1": "Id",
		  "defaultSymbol": {
		    "color": [0, 0, 0, 64],
		    "outline": {
		      "color": [0, 0, 0, 255],
		      "width": 1,
		      "type": "esriSLS",
		      "style": "esriSLSNull"
		    },
		    "type": "esriSFS",
		    "style": "esriSFSNull"
		  }
		}
		
		
		rends = [];
		xmin = 999999999999999;
		xmax = -99999999999999;
		ymin = 999999999999999;
		ymax = -99999999999999;	
			
		var len=f.length;
		centeri = Math.round((len / 2) + 0.5);
		
		par = {}
			for(var i=0; i<len; i++) {
					//alert(landp[i].geometry.x + "   " + f[i].geometry.x);
					//console.log('*****' + landp[i])
					//alert(landp[i].attributes["PTID"] + ' ' + f[i].attributes["Id"]);
				
				par[f[i].attributes["Id"]] = ([f[i].geometry.x, f[i].geometry.y])
					
					if (xmin > f[i].geometry.x) {xmin = f[i].geometry.x}
					if (ymin > f[i].geometry.y) {ymin = f[i].geometry.y}
					if (xmax < f[i].geometry.x) {xmax = f[i].geometry.x}
					if (ymax < f[i].geometry.y) {ymax = f[i].geometry.y}
		
					x1 = f[i].geometry.x;
					x2 = landp[i].geometry.x;
					
					y1 = f[i].geometry.y;
					y2 = landp[i].geometry.y;
					
					dy = (y1-y2)
					dx = (x1-x2)
					
					angle=Math.atan2(dy,dx)
					//var angle=Math.atan2((5),(0))
					//if (angle<0) {
					//angle +=3
					//}
					dangle=angle*(180/Math.PI)
					
					pangle = dangle;
					dangle = (dangle - 90) * -1
					
					if (dangle<0) {
						dangle = 360 + dangle;
					}
					
			 if (f[i].attributes["Id"] == thing.tranNumber[centeri -1]) {iurl = "resources/images/oystersideorange.png"} else {iurl = "resources/images/oystersideblue.png"};
			 
							//Height and Width are specified in points
			  var symbolreef = new esri.symbol.PictureMarkerSymbol({
			    "url":iurl,
			    "height":30,
			    "width":30,
			    "type":"esriPMS" //,
				//angle: dangle
			  });
			  
			  rends.push({
			    "value": f[i].attributes["Id"],
			    "symbol": symbolreef
			  })


			}
			
		uvrJson["uniqueValueInfos"] = rends;
		
		renderer2 = new esri.renderer.UniqueValueRenderer(uvrJson);
		
		firsttime = true;
		pin = [];
		totdist = 0;
		for (tr in thing.tranNumber) {
			cpoint = par[thing.tranNumber[tr]];
			pin.push(cpoint);
			
			if (firsttime != true) {
				xs = cpoint[0] - lpoint[0];
  				xs = xs * xs;
 
  				ys = cpoint[1] - lpoint[1];
  				ys = ys * ys;
 
  				dist = Math.sqrt( xs + ys );
  				totdist = totdist + dist
			} else {
				firsttime = false;
			}
			
			lpoint = cpoint;
		}
		
		dshould = thing.mainForm.getForm().findField('ashore').value
		
		if (totdist < dshould) {
		      remaindist = dshould - totdist
		      remaindist = (remaindist / 2)
				if (thing.tranNumber.length > 1) {
					
				firstone = pin[0];
				secondone = pin[1];
				
				pin.reverse()
				
				lastone = pin[0]
				penulone = pin[1]
				
				pin.reverse()
				
				xs = firstone[0] - secondone[0];
  				xss = xs * xs;
 
  				ys = firstone[1] - secondone[1];
  				yss = ys * ys;
 
  				dist = Math.sqrt( xss + yss );
  				
  				rat = (dist+remaindist) / dist;
  				
  				pin[0][0] = pin[1][0] + (xs * rat);
  				pin[0][1] = pin[1][1] + (ys * rat);
  				
  				pin.reverse()
  				
				xs = lastone[0] - penulone[0];
  				xss = xs * xs;
 
  				ys = lastone[1] - penulone[1];
  				yss = ys * ys;
 
  				dist = Math.sqrt( xss + yss );
  				
  				rat = (dist+remaindist) / dist;
  				
  				pin[0][0] = pin[1][0] + (xs * rat);
  				pin[0][1] = pin[1][1] + (ys * rat);  				
  			
  				pin.reverse()
				
				} else {
			
				  angle1 = (angle + 1.5708); //((pangle - 90));
				  //alert(angle1)
				  //angle2 = dangle + 90;
				  
				  ydis = Math.sin(angle1)*remaindist;
				  xdis = Math.cos(angle1)*remaindist;
				  
				  nx = pin[0][0] + xdis;
				  ny = pin[0][1] + ydis;
				  
				  ydis2 = (Math.sin(angle1)*remaindist) * -1;
				  xdis2 = (Math.cos(angle1)*remaindist) * -1;
				  
				  nx2 = pin[0][0] + xdis2;
				  ny2 = pin[0][1] + ydis2;
				  
				  pin.push([nx,ny])
				  
				  pin.reverse()
				  
				  pin.push([nx2,ny2])
				  
				  pin.reverse()
				
				}
		}
		
  		myLine ={geometry:{"paths":[pin],"spatialReference":{"wkid":102100}},"symbol":{"color":[200,200,100,255],"width":5,"type":"esriSLS","style":"esriSLSDash"}};
		gra= new esri.Graphic(myLine);
  
  		thing.map.graphics.add(gra);

			
		//renderer2 = new esri.renderer.SimpleRenderer(symbolreef);
		
		//renderer2.setAngle(angle)
		
		thing.reefpoint.setRenderer(renderer2);
	
		//if (x1 > x2) { xmax = x1 + zoomfac; xmin = x2 - zoomfac } else { xmax = x2 + zoomfac; xmin = x1 - zoomfac }
		//if (y1 > y2) { ymax = y1 + zoomfac; ymin = y2 - zoomfac } else { ymax = y2 + zoomfac; ymin = y1 - zoomfac }
		
		xmax = xmax + zoomfac; xmin = xmin - zoomfac ;
		ymax = ymax + zoomfac; ymin = ymin - zoomfac ;
		
				
		curExtent = new esri.geometry.Extent({"xmin":xmin,"ymin":ymin,"xmax":xmax,"ymax":ymax,"spatialReference":{"wkid":102100}});
		thing.map.setExtent(curExtent);
		
		} else {
		
			Ext.Msg.alert('Invalid Distance', 'The distance value you have entered is outside the range of valid values.');
			
			thing.mainForm.getForm().findField('dshore').setValue(oldValue);
			
		}
		
	},
	
	closetool: function() {
	
	this.map.graphics.clear()
	
	dojo.disconnect(this.clickhandle);
	
	this.windowopen = false;
	
		this.map.removeLayer(this.landpoints);
		this.map.removeLayer(this.reefpoint);
		this.map.removeLayer(this.bathylays);
		
		 
		
	try {
		this.map.removeLayer(this.profilepoints);
		this.map.removeLayer(this.fetches);
		this.map.removeLayer(this.bathylays);
		} catch (err) {
		
		}
		
	
	},
	
	runProfile: function() {
		
		thing = this.mainForm.getForm();
		
		rfc = 0;
		
		if (thing.findField('cwidth').hidden == false) {
			rfc = thing.findField('cwidth').value;
		}
		
	if (this.mainForm.getForm().findField('units').value == true) {
			rfc = rfc;
			dshort = thing.findField('dshore').value;
			hvalue = thing.findField('height').value;
			bwval = thing.findField('bwidth').value;
	} else {
		
			rfc = rfc * 0.3048;
			dshort = Math.round(thing.findField('dshore').value * 0.3048);
			hvalue = thing.findField('height').value * 0.3048;
			bwval = thing.findField('bwidth').value * 0.3048;
	}
	
	
	    var params = { "Distance_from_shore": dshort, "Reef_height": hvalue, "Reef_base_width": bwval, "Reef_crest_width": rfc, "Wave_type": thing.findField('wave').value, "Profile_Numbers": this.tranNumber.join()};
		
		thing = this;
		gp = new esri.tasks.Geoprocessor("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/OysterReefProfileTool/GPServer/generateProfileMulti");
		gp.execute(params, function(results, messages) {thing.profileResults(results, messages, thing)}, function(error) {
		
		Ext.MessageBox.alert('profile Error', "profile Error, please try again.");
		
		thing.toolWindow.items.get(0).hide();
		thing.toolWindow.items.get(1).show();
		
		
		});

		this.toolWindow.items.get(0).update("<center>Please wait a moment for the profile to process on the server...<br><img src='resources/images/loading.gif'></center>")
		
		this.toolWindow.items.get(1).hide();
		this.toolWindow.items.get(0).show();
		
	},
	
	profileResults: function(results, messages, thing) {
	
	
	if (results[0].value.indexOf("http") == -1) {
	Ext.MessageBox.alert('Error', results[0].value);
		
	this.toolWindow.items.get(0).hide();
	this.toolWindow.items.get(1).show();
		
	} else {
	//this.aVals = eval(results[1].value.replace( /\s\s+/g, ' ' ).replace(/ /g,",").replace("[,","[").replace(",]","]"))
	
	this.waveVals = eval("(" + results[1].value + ")");
	
	this.energyVals = eval("(" + results[2].value + ")");
	
		firsttime = true;
		sumwave = [];
		meanwave = [];
		totwave = [];
		sumeng = [];
		meaneng = [];
		toteng = [];
		
	len=this.tranNumber.length;

			for(var i=0; i<len; i++) {
			
			     if (firsttime == true) {
			     	sumwave = []
			     	meanwave = []
			     	totwave = []
			     	
			     	farw = this.waveVals[this.tranNumber[i]]
			     	lenin = farw.length;
			     	for(var p=0; p<lenin; p++) {
			     		sumwave.push(farw[p])
			     		meanwave.push(farw[p])
			     		totwave.push(1)
			     	}
			    	//sumwave = this.waveVals[this.tranNumber[i]].map( function(item) { return (item); } );;
			    	//meanwave = this.waveVals[this.tranNumber[i]].map( function(item) { return (item); } );;
			    	//totwave = this.waveVals[this.tranNumber[i]].map( function(item) { return (item * 0) + 1; } );
			    	
			    	fare = this.energyVals[this.tranNumber[i]]
			     	lenin = fare.length;
			     	for(var p=0; p<lenin; p++) {
			     		sumeng.push(fare[p])
			     		meaneng.push(fare[p])
			     		toteng.push(1)
			     	}
			    	
			    	//alert(sumeng)
					//sumeng = this.energyVals[this.tranNumber[i]].map( function(item) { return (item); } );;
					//meaneng = this.energyVals[this.tranNumber[i]].map( function(item) { return (item); } );;
					//toteng = this.energyVals[this.tranNumber[i]].map( function(item) { return (item * 0) + 1; } );
			    	
			    	firsttime = false;			     
			     } else {
			     	len2=sumwave.length;
			     	for(var y=0; y<len2; y++) {
			     		sumwave[y] = sumwave[y] + this.waveVals[this.tranNumber[i]][y];
			     		totwave[y] = totwave[y] + 1;
			     		meanwave[y] = sumwave[y] / totwave[y];

						sumeng[y] = sumeng[y] + this.energyVals[this.tranNumber[i]][y];
						toteng[y] = toteng[y] + 1;
						meaneng[y] = sumeng[y] / toteng[y];
			     	}
			     	
			     
			     }
			};
	
	
this.waveMeans = meanwave;
this.energyMeans = meaneng;	
		

//	
//	Ext.Object.each(this.waveVals, function(key, value, obj) {
//		console.log(key);
//		if (firsttime == true) {
//	    	sumwave = sumwave.map( function(item) { return (item); } );;
//	    	meanwave = value;
//	    	totwave = sumwave.map( function(item) { return (item * 0) + 1; } );
//	    	firsttime = false;
//	    	console.log("****");
//		} else {
//			
//			var len=sumwave.length;
//			for(var i=0; i<len; i++) {
//			    console.log("####");
//				sumwave[i] = sumwave[i] + value[i];
//				totwave[i] = totwave[i] + 1;
//				meanwave[i] = sumwave[i] / totwave[i];
//				}
//			firsttime = false;
//		}
//		console.log(sumwave)
//		
//	}, this);
		
	//alert(sumwave)
	//alert(totwave)
	//alert(meanwave)
		
	strnums = this.tranNumber.join(" OR PTID = ");

	//add fetchlayer
	this.fetches = new esri.layers.ArcGISDynamicMapServiceLayer("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/ReefProfile/MapServer");
	layerDefinitions = [];
	layerDefinitions[2] = "PTID = " + strnums // this.tranNumber[0];
	this.fetches.setLayerDefinitions(layerDefinitions);
	this.fetches.setVisibleLayers([2]);
	this.map.addLayer(this.fetches);


	//change profile points to show attenuation
	fm = this.mainForm.getForm();
	dshort = fm.findField('dshore').value;
			
			
	if (this.mainForm.getForm().findField('units').value == true) {
			pid = dshort;
	} else {
		
			pid = Math.round(dshort * 0.3048)
	}
	
	var infoTemplate = new esri.InfoTemplate("Profile of percent wave height attenuation", "Average attenuation is ${Attenuation}%");
	
	this.profilepoints = new esri.layers.FeatureLayer("http://dev.gulfmex.coastalresilience.org/ArcGIS/rest/services/OysterReefProfile/ReefProfile/MapServer/1",{
          mode: esri.layers.FeatureLayer.MODE_SELECTION,
         outFields: ["*"],
		 infoTemplate: infoTemplate
        });
		
		this.map.addLayer(this.profilepoints);
	
	strout = ""
	thing = this;
	Ext.Array.forEach(this.tranNumber, function(it,ind,all) {
	
		if (ind != 0) {strout = strout + " OR "}
			strout = strout + "Id = " + it;
	
					}, thing)
	
	var query2 = new esri.tasks.Query();
	query2.outFields = ['*'];
	query2.returnGeometry = true;
	//query2.where = "PT_ID < " + pid + " AND Id = " + this.tranNumber;
	query2.where = "PT_ID < " + pid + " AND ( " + strout + " )";
	
	this.profilepoints.selectFeatures(query2,esri.layers.FeatureLayer.SELECTION_NEW, function(f,sm) {thing.updateProfile(f,sm,thing)});

	wavedata = []
	
	toter = 0;
	len2=this.waveMeans.length;
	
	for(var y=0; y<20; y++) {
	
	wavedata.push({"dist":y, "wavemean":100, "enmean":100})	
	console.log(y);
	}
	
	//wavedata.push({"dist":0, "wavemean":100 - (this.waveMeans[len2]), "enmean":100 - (this.energyMeans[len2])})
	
	for(var y=1; y<len2; y++) {
			wavedata.push({"dist":y+20, "wavemean":100 - (this.waveMeans[len2-y]), "enmean":100 - (this.energyMeans[len2-y])});
			
			console.log(100 - this.waveMeans[len2-y] + " ******");
			
	}
	
	toter = len2
	//wavedata.push({"dist":toter, "wavemean":this.waveMeans[toter-1], "enmean":this.energyMeans[toter-1]})
	wavedata.push({"dist":(20.01), "reef":0});
	wavedata.push({"dist":20, "reef":100});

	wavedata.push({"dist":(toter+20-.01), "shore":0});
	wavedata.push({"dist":toter+20, "shore":100});
		
	var store = Ext.create('Ext.data.JsonStore', {
    fields: ['dist','wavemean', "enmean", "shore", "reef"],
    data: wavedata});
    
    pp = (len2 + 20)
    perc = 1 - (len2 / pp)
    disty = 64 + ((420 - 63) * perc);
  

linechart = Ext.create('Ext.chart.Chart', {
    width: 440,
    height: 260,
    animate: true,
    legend: {
        position: 'bottom'
    },
    items: [{
      type  : 'text',
      text  : len2 + 20,
      font  : '10px Arial',
      x : 55, //the sprite x position
      y : 185  //the sprite y position
    },{
      type  : 'text',
      text  : len2,
      font  : '10px Arial',
      x : disty, //the sprite x position
      y : 185  //the sprite y position
    },{
      type  : 'text',
      text  : 0,
      font  : '10px Arial',
      x : 417, //the sprite x position
      y : 185  //the sprite y position
    }],
    store: store,
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: ['wavemean', "enmean"],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0'),
                font: "10px Arial, sans-serif"
            },
            title: 'Percent of Original',
            font: "10px Arial, sans-serif",
            grid: true,
            minimum:0,
            maximum:100
        },
        {
            type: 'Numeric',
            position: 'bottom',
            fields: ['dist'],
            label: {
                color: '#F00',
                font: "0px Arial, sans-serif"
            },
            title: 'Distance from Shore (m)'
        }
    ],
    series: [
        {
            type: 'line',
//            highlight: {
//                size: 10,
//                radius: 7,
//                'stroke-width': 5
//            },
			style: {
			    stroke: '#0000ff',
			    'stroke-width': 2
			},
            axis: 'left',
            xField: 'dist',
            title: 'Wave Height',
            yField: 'wavemean',
            markerConfig: {
                type: 'circle',
                size: 0,
                radius: 0,
                'stroke-width': 0
            }
        },{
            type: 'line',
//            highlight: {
//                size: 10,
//                radius: 7
//            },
            style: {
                stroke: '#ff0000',
                'stroke-width': 2
            },
            axis: 'left',
            xField: 'dist',
            title: 'Wave Energy',
            yField: 'enmean',
            markerConfig: {
                type: 'circle',
                size: 0,
                radius: 0,
                'stroke-width': 0
            }
        },{
                    type: 'line',
        //            highlight: {
        //                size: 10,
        //                radius: 7
        //            },
                    style: {
                        stroke: '#00ff00',
                        'stroke-width': 2
                    },
                    axis: 'left',
                    xField: 'dist',
                    title: 'Reef',
                    yField: 'reef',
                    markerConfig: {
                        type: 'circle',
                        size: 0,
                        radius: 0,
                        'stroke-width': 0
                    }
                },{
                    type: 'line',
        //            highlight: {
        //                size: 10,
        //                radius: 7
        //            },
                    style: {
                        stroke: '#dddd44',
                        'stroke-width': 2
                    },
                    axis: 'left',
                    xField: 'dist',
                    title: 'Shore',
                    yField: 'shore',
                    markerConfig: {
                        type: 'circle',
                        size: 0,
                        radius: 0,
                        'stroke-width': 0
                    }
                }
        
    ]
});
	
	titleportion = Ext.create('Ext.panel.Panel', {bodyPadding: 0,html:"<center>Wave Attenuation Profile</center>",layout: 'anchor', border:'0px',bodyStyle: {
     'font-size': '22px',
     border:'0px'
    }})
    
    
    textportion = Ext.create('Ext.panel.Panel', {bodyPadding: 0,html:"The figure shows the average profiles of percent of wave height and energy attenuation computed from all Reef Points along your reef.  Attenuation is defined as the ratio of wave height (energy) in the presence of the reef over wave height (energy) in the absence of the reef.<br><br>",layout: 'anchor', border:'0px',bodyStyle: {
     'font-size': '10px',
     border:'0px'
    }})
    
		
	fp = Ext.create('Ext.form.Panel', {
    bodyPadding: 5,
	width: 450, height: 460,
	html: 'Link to the output (turn off popup blocker): <a target="_blank" href="' + results[0].value +  '"> ' + "Results Link" + '</a>',
    //width: 395,

    // Fields will be arranged vertically, stretched to full width
    layout: 'anchor',
    defaults: {
        anchor: '100%'
    },
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 40
    },
    // The fields
    defaultType: 'textfield',
    items: [titleportion, linechart,textportion,{
            xtype      : 'fieldcontainer',
            fieldLabel : 'Layers',
            defaultType: 'checkboxfield',
            defaults: {
                flex: 1
            },
            //layout: 'hbox',
            items: [ 
			    {
                    boxLabel  : 'Wave Attenuation - (Click a profile point for attenuation detail.)',
                    checked: false,
                    name      : 'wave',
                    inputValue: 'wa',
                    width: 400,
                    handler: function(checked) {if (this.getValue( ) == true) {thing.profilepoints.show()} else {thing.profilepoints.hide()}}
                    //this.up('form').getForm().getFieldValues().depth
                },
                {
                    boxLabel  : 'Fetch Distances',
                    name      : 'fetch',
					checked: false,
					width: 300,
					handler: function(checked) {if (this.getValue( ) == true) {thing.fetches.show()} else {thing.fetches.hide()}},
                    inputValue: 'fd'
                },
                {
                    boxLabel  : 'Bathymetry',
                    checked: false,
                    width: 200,
                    name      : 'bathy',
                    xtype: 'checkboxfield',
                    handler: function(checked) {if (this.getValue( ) == true) {thing.bathylays.show()} else {thing.bathylays.hide()}}

                },
                {		xtype: 'button',
	                    text: 'Choose a New Reef Location (Start Over)',
	                    handler: function() {
        
		                thing.map.graphics.clear();
		                thing.map.removeLayer(thing.landpoints);
		                thing.map.removeLayer(thing.reefpoint);
		                thing.map.removeLayer(thing.fetches);
		                thing.map.removeLayer(thing.profilepoints);
		                thing.map.removeLayer(thing.bathylays);
		
						//thing.clickhandle = dojo.connect(thing.map,"onClick", thing.processPoint, thing);
						thing.reint();
						thing.toolWindow.items.get(0).show();
						thing.toolWindow.items.get(0).update("<center>Please Click Another Point on the Map...</center>")
						thing.toolWindow.items.get(1).hide();
						thing.toolWindow.items.removeAt(3);
						thing.toolWindow.update()
               
						}
	                    
	                    
	                } 
            ]
        }]
					})
		

		//Ext.Msg.alert('Profile Results', 'Link to the profile output (turn off popup blocker): <a target="_blank" href="' + results[0].value +  '"> ' + results[0].value + '</a>');
		
		
		thing.fetches.hide();
		thing.profilepoints.hide();
		thing.toolWindow.items.get(0).update()
		
		//thing.toolWindow.items.get(0).update(fp)
		
		thing.toolWindow.items.add(fp)
		thing.toolWindow.items.get(0).hide();
		thing.toolWindow.items.get(1).hide();
		
    }
	},
	
	updateProfile: function(f,sm,thing) {
	

  featurelayer = thing.profilepoints;
  
  		for(var j = 0; j < featurelayer.graphics.length; j++) {
  			//console.log(featurelayer.graphics[j].attributes["PT_ID"] + "  " + featurelayer.graphics[j].attributes["Id"]);
			//console.log("--------------------- Score " + thing.aVals[featurelayer.graphics[j].attributes["PT_ID"]] + " ----------------------")
			carray = thing.waveVals[featurelayer.graphics[j].attributes["Id"]]
			console.log(featurelayer.graphics[j].attributes["PT_ID"] + "  " + featurelayer.graphics[j].attributes["Id"] + "  " + carray[featurelayer.graphics[j].attributes["PT_ID"]]);
			featurelayer.graphics[j].attributes["Attenuation"] = Math.round(carray[featurelayer.graphics[j].attributes["PT_ID"]]);
		}
		
		
   var symbol =  new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([100,100,100,1]));

   var renderer = new esri.renderer.ClassBreaksRenderer(symbol, "Attenuation");
   
   renderer.addBreak(0, 10, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([0, 22, 255, 1])));
   
   renderer.addBreak(10, 20,new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([20, 100, 255, 1])));
   
   renderer.addBreak(20, 30, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([50, 173, 255, 1])));
   
   renderer.addBreak(30, 40, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([20, 255, 255, 1])));
   
   renderer.addBreak(40, 50, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([152, 252, 177, 1])));
   
   renderer.addBreak(50, 60, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([220, 255, 95, 1])));
   
   renderer.addBreak(60, 70,new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([255, 255, 0, 1])));
   
   renderer.addBreak(70, 80, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([255, 181, 0, 1])));
   
   renderer.addBreak(80, 90, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([255, 110, 0, 1])));
   
   renderer.addBreak(90, 100, new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 5,
   new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_NULL,
   new dojo.Color([255,0,0]), 1),
   new dojo.Color([255, 30, 0, 1])));
	
	
	 	thing.profilepoints.setRenderer(renderer);
		//thing.profilepoints.hide();
		//thing.profilepoints.show();	
		
		
	}
	
	
});


