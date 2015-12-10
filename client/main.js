Meteor.subscribe("websites", function(){ return Websites.find().fetch(); });

  /////////////////////
 //     config      //
/////////////////////

Accounts.ui.config({ passwordSignupFields: 'USERNAME_ONLY' });

Comments.ui.config({ template: "bootstrap" });

  //////////////////////
 // template helpers //
//////////////////////

Template.website_list.helpers({

  websites: function(){ // returns all websites sorted in decending order of votes, creation date
    return Websites.find({}, {sort: {votes: -1, createdOn: -1}});
  }

});

Template.website_item.helpers({
  
  submittedByThisUser: function(){
    return (this.submittedBy === Meteor.user()._id ) ? true : false;
  }
  
});

Template.website_details.helpers({

  getUser: function(){
    return (Meteor.users.findOne({_id: this.submittedBy})) ? Meteor.user().username : "System";
  },
  
  submittedByThisUser: function(){
    return (this.submittedBy === Meteor.user()._id ) ? true : false;
  }

});


  /////////////////////
 // template events //
/////////////////////

Template.website_item.events({
  
  "click .js-upvote": function(event){
    var site_id = this._id;
    Meteor.call("upvote", site_id);
    // do fancy upvote animation here.
    return false;
  },
  
  "click .js-downvote": function(event){
    var site_id = this._id;
    Meteor.call("downvote", site_id);
    // do fancy downvote animation here.
    return false; // prevent the button from reloading the page
  },

  "click .js-delete": function(event){
    var site_id = this._id;
     $("#panel" + site_id).hide('slow', function(){ Router.go("/"); });
    Meteor.call("deleteSite", site_id);
  }
  
}); // end of website_item events

Template.website_details.events({
  
  "click .js-upvote": function(event){
    var site_id = this._id;
    Meteor.call("upvote", site_id);
    // do fancy upvote animation here.
    return false;
  },
  
  "click .js-downvote": function(event){
    var site_id = this._id;
    Meteor.call("downvote", site_id);
    // do fancy downvote animation here.
    return false; // prevent the button from reloading the page
  },

  "click .js-delete": function(event){
    var site_id = this._id;
     $("#panel" + site_id).hide('slow', function(){ Router.go("/"); });
    Meteor.call("deleteSite", site_id);
  }
  
}); // end of website_details events

Template.website_form.events({
  
  "click .js-toggle-website-form": function(event){
    $("#website_form").toggle('slow');
  },
  
  "submit .js-save-website-form": function(event){
    if ( !Meteor.user() ){ // user not logged in
      alert("You need to log in first...");
      return false;
    } else {
      
      var url         = event.target.url.value;
      var title       = event.target.title.value;
      var description = event.target.description.value;
      var tags        = event.target.tags.value;

      // if user didn't start with 'http://' or 'https://', add it to url for proper format
      if ( !(url.startsWith('http://') || url.startsWith('https://')) ){ url = "http://" + url; }

      if ( Websites.findOne({url: url}) ){ // site already in DB
        alert("Already exists in database. Please choose another site.");
        return false;
      } else {
        
        Meteor.call('submitSite', url, title, description, tags, function(error, result){
          if (error){
            code = error.statusCode;
          } else {
            code = result.statusCode;
          }
          
          if ( code == 200 ){
            // Site submission successful.
            alert("Site added.");
            $("#website_form").toggle('slow');
            
          } else if ( code == 404 ){
            alert("Error 404: Page could not be found.");
          } else if ( code == 403 ){
            alert("Error 403: Page forbidden.");
          } else {
            alert("Error: " + code + ".");
          }
        }); //end submitSite
      }
    }
    return false;
  }

}); // end of website_form events