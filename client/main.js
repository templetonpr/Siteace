	  /////////////////////
	 //     routing     //
	/////////////////////

// todo

	  /////////////////////
	 // Accounts config //
	/////////////////////

Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
});

	  //////////////////////
	 // template helpers //
	//////////////////////

// helper function that returns all available websites
Template.website_list.helpers({

  websites: function(){
    return Websites.find({}, {sort:{createdOn: -1, votes:-1}});
  }

});

Template.website_item.helpers({

  getUser: function(){
    var user = Meteor.users.findOne({_id: this.submittedBy});
    if (user){
      return user.username;
    }
    else {
      return "anon";
    }
  }

});


	  /////////////////////
	 // template events //
	/////////////////////

Template.website_item.events({
  
  "click .js-upvote": function(event){
    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id, votes;
    website_id = this._id;
    votes = this.votes;
    console.log("Up voting site with id " + website_id + ". Site now has " + votes + " votes.");
    // put the code in here to add a vote to a website!
    
    return false;// prevent the button from reloading the page
  },
  
  "click .js-downvote": function(event){
    // example of how you can access the id for the website in the database
    // (this is the data context for the template)
    var website_id, votes;
    website_id = this._id;
    
    console.log("Down voting site with id " + website_id + ". Site now has " + votes + " votes.");
    // put the code in here to remove a vote from a website!
    
    return false;// prevent the button from reloading the page
  },

  "click .js-delete": function(event){
    var website_id,submitter, user;

    website_id = this._id;
    submitter = this.submittedBy;
    user = Meteor.user()._id;

    if (user && (submitter == user) ){
      $("#item" + website_id).hide('slow', function(){
        Websites.remove({"_id": website_id});
      });

    } else { return false; }
  }
  
}); // end of website_item events

Template.website_form.events({
  "click .js-toggle-website-form": function(event){
    $("#website_form").toggle('slow');
  },
  
  "submit .js-save-website-form": function(event){
    // here is an example of how to get the url out of the form:
    var url, title, description;
    url         = event.target.url.value; // user inputs this in submit form.
    title       = event.target.title.value; // eventually this should use the HTTP module to automatically grab the page's title
    description = event.target.description.value; // eventually this should use the HTTP module to automatically grab a description from...somewhere?
    function isUnique(site){
      if ( !Websites.findOne({url: site}) ){ return true; } else { return false; }
    }

    if ( Meteor.user() ){
      if ( isUnique(url) ){

        Websites.insert({
          url:                       url,
          description:       description,
          title:                   title,
          votes:                       1,
          createdOn:          new Date(),
          submittedBy: Meteor.user()._id
        });

      } else { console.log("Site already exists..."); }
    }
    return false;// stop the form submit from reloading the page
  }
  
}); // end of website_form events