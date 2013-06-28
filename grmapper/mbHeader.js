//, summarizebyunit

define([
		"bootstrap/Alert",
		"bootstrap/Modal",
        "bootstrap/Tooltip",
        "bootstrap/Popover",
		"dojo/_base/declare",
		"dijit/_WidgetBase", 
		"dijit/_TemplatedMixin", 
		"dojo/text!./templates/mbHeader.html", 
		"dojo/dom-style", 
		"dojo/dom-class", 
		"dojo/_base/fx", 
		"dojo/_base/lang", 
		"dojo/on", 
		"dojo/mouse", 
		"dojo/query",
		"dijit/registry",
		"esri/tasks/gp",
		"dijit/focus",
		"dojo/_base/array"
		],
    function(
    	Alert,
    	Modal,
    	Tooltip,
    	Popover,
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
    	registry,
    	esrigp,
    	focusUtil,
    	array
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
            baseClass: "mbHeader",
 
            // A reference to our background animation
            mouseAnim: null,
            
            inputLayer: null,
            
            toolbar: null,
             
            postCreate: function(){
			    // Get a DOM node reference for the root of our widget
			    var domNode = this.domNode;
			   
			 
			    // Run any parent postCreate processes - can be done at any point
			    this.inherited(arguments);
			 

		   },
		   
		   startup: function() {
		   
		   	footerText = "The Upper Midwest and Great Lakes Landscape Conservation Cooperative of the U.S. Fish and Wildlife Service supported development of this website.  It is being served by…. (to be resolved).  TNC collaborated with the U.S. Fish and Wildlife Service, many conservation organizations, universities, and corporations to model stopover habitat and create this web portal.";


		   	 this.inherited(arguments);
		   	 wc = window.location.pathname.toLowerCase();
		   	 
		   	 fileNameIndex = wc.lastIndexOf("/") + 1;
		   	 wc = wc.substr(fileNameIndex);
		   	 
		   	 tlinks = query('.titlelink');

			 neverhappened = true;
			   	 		   	 
		   	 array.forEach(tlinks, function(link, i){
			   	 
			   	 par = query(link).parent()[0];
			   	 domClass.remove(link, "selectedHeader");
			     domClass.remove(par, "selectedHeader");
			     	 
			   	 lc = link.href.toLowerCase();
			   	 
			   	 fileNameIndex = lc.lastIndexOf("/") + 1;
			   	 lc = lc.substr(fileNameIndex);
	

			   	 if (wc == lc) {
						   	   
			   	   domClass.add(link, "selectedHeader");
			   	   domClass.add(par, "selectedHeader");
			       neverhappened = false;
			       
			   	 }
			   	 
			  footer = query('#footer')[0];
			  
			  footer.innerHTML = footerText;
			  
			   	 
			   	 
			 });
			 
			 if (neverhappened) {
				
				link = tlinks[0];
				par = query(link).parent()[0]; 
				
				domClass.add(link, "selectedHeader");
			   	domClass.add(par, "selectedHeader");
				 
			 }
			 
		   	
		     lb = query('#loginbutton');
		     on(lb, "click", lang.hitch(this, this.sendlogin))  
		     
		     query("#" + this.domNode.id + ' .popoverlink').popover({placement:"bottom",trigger:"hover"})
		     
		     //mbds = query('.modal-backdrop')
			 //domStyle.set(mbds[0], 'display', 'none');
		     
		     lb2 = query('#showLoginButton');
		     on(lb2, "click", lang.hitch(this, function() { 
		     
		     	if (this.model == undefined) {
			     	
			     this.model = query('#myModal').modal({"keyboard":false,"backdrop":true});
			     	
		     	}   else {      
			    
			     query('#myModal').show();
			     mbds = query('.modal-backdrop')
			     domStyle.set(mbds[0], 'display', '');
			     
			     }
			     
		     }))
		     
		     lb3 = query('#signOutButton');
		     on(lb3, "click", function() {  
		     
		     	   this.userinfo = {username:"Unknown", lastname:"User", firstname:"Unknown", email:""}        
			     
			       userbtn = query('#userbutton')[0]
			       userbtn.innerHTML = this.userinfo.firstname + " " + this.userinfo.lastname;
			       
			       domClass.add(userbtn, "btn-danger");
			       domClass.remove(userbtn, "btn-success");
			       
			       userbtn = query('#userbuttonextra')[0]
			       domClass.add(userbtn, "btn-danger");
			       domClass.remove(userbtn, "btn-success");
			       
			       focusUtil.focus(dojo.query("body"));
			      
			       localStorage.mbuserinfo = JSON.stringify(this.userinfo);
			     
		     })
		   
		 
		 
		 if (localStorage.mbuserinfo == undefined) {
		 
		 	 this.userinfo = {username:"Unknown", lastname:"User", firstname:"Unknown", email:""}
			 localStorage.mbuserinfo = JSON.stringify(this.userinfo);
			 
		 } 
		 
		 
		 userinfo = JSON.parse(localStorage.mbuserinfo);
		 this.userinfo = userinfo;
		 
		 
		 
		 if (this.userinfo.username == "Unknown") {
			 
			 // for now force login
			 this.model = query('#myModal').modal({"keyboard":false,"backdrop":true});
			 
		 }  else {
			 
			  this.loginuser(); 
			 
		 }
		 
	    
			 

			 
		   },
		   
		   sendlogin: function() {
		   
		   	   //username = registry.byId("username")
		   					   
			   username = query('#username')[0].value;
			   password = query('#password')[0].value;
			  
			   
			   gp = new esri.tasks.Geoprocessor("http://maps.usm.edu:6080/arcgis/rest/services/GreatLakes/msdhUser/GPServer/getUser");
			   
			   ///execute
			   
			   params = { "Expression": "username = '" + username + "' and password = '" + password + "'"};
			   gp.execute(params, lang.hitch(this,function(res,mes) {this.checkuser(res,mes)}));
			   
		   },
		   
		   checkuser: function(results, messages)  {
			   
			   if (results[0].value.features.length == 0)  {
				   
				   //alert("User Not Found")
				   
				 //  query("#baduser").alert()
				   query("#baduser").show()
				   
				   
			   }  else  {
				   
				   this.userinfo = results[0].value.features[0].attributes;
				   //alert(userinfo);
				   
				   query('#myModal').hide()
				   mbds = query('.modal-backdrop')
				   domStyle.set(mbds[0], 'display', 'none');
				   
				   query('#username')[0].value = "";
			       query('#password')[0].value = "";
			       
			       this.loginuser();
				   
			   }
			   
		   },
		   
		   loginuser: function() {
		   
		    	   userbtn = query('#userbutton')[0]
			       userbtn.innerHTML = this.userinfo.firstname + " " + this.userinfo.lastname ;
			       
			       domClass.remove(userbtn, "btn-danger");
			       domClass.add(userbtn, "btn-success");
			       
			       userbtn = query('#userbuttonextra')[0]
			       domClass.remove(userbtn, "btn-danger");
			       domClass.add(userbtn, "btn-success");
			       
			       localStorage.mbuserinfo = JSON.stringify(this.userinfo);
			   			   
		   }

        });
});