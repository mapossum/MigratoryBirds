

define([
	"dojo/_base/declare",
	"dijit/_WidgetBase", 
	"dijit/_TemplatedMixin", 
	"dojo/text!./templates/ToolBase.html", 
	"dojo/dom-style", 
	"dojo/dom-class", 
	"dojo/_base/fx", 
	"dojo/_base/lang", 
	"dojo/on", 
	"dojo/mouse", 
	"dojo/query",
	"dojo/has"
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
		has
    	){
        return declare([WidgetBase, TemplatedMixin], {
            // Some default values for our author
            // These typically map to whatever you're handing into the constructor
            name: "No Name",
            // Using require.toUrl, we can get a path to our AuthorWidget's space
            // and we want to have a default avatar, just in case
            //avatar: require.toUrl("custom/AuthorWidget/images/defaultAvatar.png"),
            bio: "",
            
            stype: "",
 
            // Our template - important!
            templateString: template,
 
            // A class to be applied to the root node in our template
            baseClass: "toolContainer",
 
            // A reference to our background animation
            mouseAnim: null,
 
            // Colors for our background animation
            baseBackgroundColor: "rgb(175, 205, 230)",
            mouseBackgroundColor: "rgb(0, 136, 204)",
            
            baseTextColor: "rgb(20, 20, 20)",
            mouseTextColor: "rgb(255, 255, 255)",
            
            expanded: true,
            
            destroy: function(){
			
		
			if(has("ie") != undefined){ // only IE6 and below
	
				this.inherited(arguments);
				
			} else {

			
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
				
			}
            	
            },
            
            
            postCreate: function(){
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			   
			 
			    // Run any parent postCreate processes - can be done at any point
			    this.inherited(arguments);
			 
			    // Set our DOM node's background color to white -
			    // smoothes out the mouseenter/leave event animations
			    domStyle.set(domNode, "backgroundColor", this.baseBackgroundColor);
			    domStyle.set(domNode, "padding", "10px");
			    // Set up our mouseenter/leave events - using dojo/on
			    // means that our callback will execute with `this` set to our widget
			    
			    on(domNode, mouse.enter, lang.hitch(this,this._changeBackground));
			    
			    on(domNode, mouse.leave, lang.hitch(this,this._changeBackground));
			    
			    
			    	//	   tloc = query("#" + this.domNode.id + " .toolLocation");
			    		   
			    //		   alert(tloc[0])
	         	
		          //var authorContainer = dom.byId("sumarea");

		          


		   },
		   
		   startup: function() {
		          
		     query("#" + this.domNode.id + " a").onclick(function(e){
	           e.preventDefault(); 
	           });
	             
			 this.map.reposition();
			 
			 this.inherited(arguments);
			 
			 minusbuts = query("#" + this.domNode.id + " .minimize");
			 on(minusbuts[0], "click", lang.hitch(this,this.minimize,minusbuts[0]));
			 
			 closebuts = query("#" + this.domNode.id + " .closeit");
			 
	
			 on(closebuts[0], "click", lang.hitch(this,this._close));
			 
			 this.options.container = this;
			 this.tool = new this.tooltype(this.options);
			 this.tool.placeAt(this.domNode);
		     //this.tool.startup();  FOR SOME REASON YOU DON'T NEED TO CALL STARTUP
			 
		   },
		   
		   _close: function() {
		   
		   this.tool._close();
		   this.destroy();   
			   
		   },
		   
		   minimize: function(themin) {
		   
			   divInfo = dojo.position(this.domNode, true);
			   
			   itemNode = query("#" + this.domNode.id + " .allContent")[0]	   
			   	 
				 if (this.expanded == true) {
				 
				 	//mic = query("#" + themin.id + " > .icon-minus")
				 	//mic.removeClass("icon-minus");
				 	//mic.addClass("icon-list");	
				 
				  if(has("ie") != undefined){ 
	
				  domStyle.set(itemNode, "display", "none");
				  this.map.reposition();
				
				  } else {
				 
				 this.fullheight = divInfo.h;
				 	
				 	a = baseFx.animateProperty({
					   		node: this.domNode,
					   		onEnd: lang.hitch(this, function(itemNode) {this.map.reposition();}),
					   		properties: {
						   		height: { start: divInfo.h-15, end: 21 }
						   		},
						   		duration: 400
						   	});
						   	
					b = baseFx.animateProperty({
					   		node: itemNode,
					   		onEnd: lang.hitch(this, function(itemNode) {domStyle.set(itemNode, "display", "none");this.map.reposition();}),
					   		properties: {
						   		opacity: { start: 1, end: 0 }
						   		},
						   		duration: 600
						   	});
	
					}
					
				    //domStyle.set(this.domNode, "height", "21px");
				    this.expanded = false;
				  } else {
				  
				 	//mic = query("#" + themin.id + " > .icon-list")
				 	//mic.removeClass("icon-list");
				 	//mic.addClass("icon-minus");	
					
				  if(has("ie") != undefined){ 
	
				  domStyle.set(itemNode, "display", "");
				  this.map.reposition();
				
				  } else {
	
				 	a = baseFx.animateProperty({
					   		node: this.domNode,
					   		onEnd: lang.hitch(this, function(itemNode) {domStyle.set(this.domNode, "height", "auto"); this.map.reposition();}),
					   		properties: {
						   		height: { start: 21, end: this.fullheight - 15 }
						   		},
						   		duration: 400
						   	});
					
					domStyle.set(itemNode, "display", "")
						   	
					b = baseFx.animateProperty({
					   		node: itemNode,
					   		onEnd: lang.hitch(this, function(itemNode) {domStyle.set(itemNode, "display", "");this.map.reposition();}),
					   		properties: {
						   		opacity: { start: 0, end: 1 }
						   		},
						   		duration: 600
						   	});	   
									  
					}
					
					this.expanded = true; 
				  }
				  
				a.play();
				b.play();
				  
				//this.map.reposition();  
			   
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
		   
		   processAnimationEnd: function(rtype) {
		   
		   if (rtype == "error") {
		    this.mouseBackgroundColor = "rgb(140,0,0)";
		    this.baseBackgroundColor = "rgb(240, 170, 170)";		   
		   } else {
		    this.mouseBackgroundColor = "rgb(70,136,71)";
		    this.baseBackgroundColor = "rgb(236, 252, 236)";
		   }
		   
		   this._changeBackground({type:""})
		   
		   this.processAnimation.stop();
		   
		   this.processAnimation = null;
		   
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