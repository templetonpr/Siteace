/////////////////////
 //     routing     //
/////////////////////

Router.configure({
  layoutTemplate: "ApplicationLayout"
});

Router.route("/", function(){
  this.render( "navbar", {to: "navbar"} );
  this.render( "website_list", {to: "main", path: "/"} );
});

Router.route("/details/:_id", function(){
  this.render( "navbar", {to: "navbar"} );
  this.render( "website_details", {
    to: "main",
    path: "details/_id",
    data: function(){
      return Websites.findOne({_id: this.params._id});
    }
  });
});

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

Template.website_details.helpers({

  getUser: function(){
    var user = Meteor.users.findOne({_id: this.submittedBy});
    if (user){
      return user.username;
    } else {
      return "System";
    }
  }

});


  /////////////////////
 // template events //
/////////////////////

Template.website_item.events({
  
  "click .js-upvote": function(event){

    var user_id = Meteor.user()._id;
    var site_id = this._id;

    if ( Meteor.user() ){                                            // if user is logged in
      if ( this.upvoters.indexOf(user_id) > -1){                     //   if user has already upvoted site
        Websites.update(site_id,  {$inc: {votes: -1}} );             //     decrement votes by 1
        Websites.update(site_id, {$pull: {upvoters: user_id}});      //     remove user from upvoters array
      } else {                                                       //   else user has not upvoted site
        Websites.update(site_id, {$push: {upvoters: user_id}});      //     add user to upvoters
        Websites.update(site_id,  {$inc: {votes: 1}} );              //     increment votes by 1
        if ( this.downvoters.indexOf(user_id) > -1 ){                //     user has previously downvoted site
          Websites.update(tsite_id, {$pull: {downvoters: user_id}}); //       remove user from downvoters array
        }
      }
    }
    
    return false; // prevent the button from reloading the page
  },
  
  "click .js-downvote": function(event){
    
    var user_id = Meteor.user()._id;
    var site_id = this._id;

    if ( Meteor.user() ){                                          // if user is logged in
      if ( this.downvoters.indexOf(user_id) > -1){                 //   if user has already downvoted site
        Websites.update(site_id,  {$inc: {votes: 1}} );            //     increment votes by 1
        Websites.update(site_id, {$pull: {downvoters: user_id}});  //     remove user from downvoters array
      } else {                                                     //   else user has not downvoted site
        Websites.update(site_id, {$push: {downvoters: user_id}});  //     add user to downvoters
        Websites.update(site_id,  {$inc: {votes: -1}} );           //     decrement votes by 1
        if ( this.upvoters.indexOf(user_id) > -1 ){                //     user has previously upvoted site
          Websites.update(site_id, {$pull: {upvoters: user_id}});  //       remove user from upvoters array
        }
      }
    }
    
    return false; // prevent the button from reloading the page
  },

  "click .js-delete": function(event){
    var website_id,submitter, user;

    website_id = this._id;
    submitter = this.submittedBy;
    user = Meteor.user()._id;

    if (user && (submitter == user) ){
      $("#panel" + website_id).hide('slow', function(){
        //Websites.remove({"_id": website_id});
        Websites.update(website_id, {$set: {deleted: true}});
      });

    } else { return false; }
  }
  
}); // end of website_item events

Template.website_details.events({
  
  "click .js-upvote": function(event){

    var user_id = Meteor.user()._id;
    var site_id = this._id;

    if ( Meteor.user() ){                                            // if user is logged in
      if ( this.upvoters.indexOf(user_id) > -1){                     //   if user has already upvoted site
        Websites.update(site_id,  {$inc: {votes: -1}} );             //     decrement votes by 1
        Websites.update(site_id, {$pull: {upvoters: user_id}});      //     remove user from upvoters array
      } else {                                                       //   else user has not upvoted site
        Websites.update(site_id, {$push: {upvoters: user_id}});      //     add user to upvoters
        Websites.update(site_id,  {$inc: {votes: 1}} );              //     increment votes by 1
        if ( this.downvoters.indexOf(user_id) > -1 ){                //     user has previously downvoted site
          Websites.update(tsite_id, {$pull: {downvoters: user_id}}); //       remove user from downvoters array
        }
      }
    }
    
    return false; // prevent the button from reloading the page
  },
  
  "click .js-downvote": function(event){
    
    var user_id = Meteor.user()._id;
    var site_id = this._id;

    if ( Meteor.user() ){                                          // if user is logged in
      if ( this.downvoters.indexOf(user_id) > -1){                 //   if user has already downvoted site
        Websites.update(site_id,  {$inc: {votes: 1}} );            //     increment votes by 1
        Websites.update(site_id, {$pull: {downvoters: user_id}});  //     remove user from downvoters array
      } else {                                                     //   else user has not downvoted site
        Websites.update(site_id, {$push: {downvoters: user_id}});  //     add user to downvoters
        Websites.update(site_id,  {$inc: {votes: -1}} );           //     decrement votes by 1
        if ( this.upvoters.indexOf(user_id) > -1 ){                //     user has previously upvoted site
          Websites.update(site_id, {$pull: {upvoters: user_id}});  //       remove user from upvoters array
        }
      }
    }
    
    return false; // prevent the button from reloading the page
  },

  "click .js-delete": function(event){
    var website_id,submitter, user;

    website_id = this._id;
    submitter = this.submittedBy;
    user = Meteor.user()._id;

    if (user && (submitter == user) ){
      $("#panel" + website_id).hide('slow', function(){
        //Websites.remove({"_id": website_id});
        Websites.update(website_id, {$set: {deleted: true}});
        Router.go("/");
      });
      
      } else { return false; }
  }
  
}); // end of website_details events

Template.website_form.events({
  "click .js-toggle-website-form": function(event){
    $("#website_form").toggle('slow');
  },
  
  "submit .js-save-website-form": function(event){
    var url, title, description, user_id;
    
    url         = event.target.url.value;         // user inputs this in submit form.
    title       = event.target.title.value;       // eventually this should use the HTTP module to automatically grab the page's title
    description = event.target.description.value; // eventually this should use the HTTP module to automatically grab a description from...somewhere?
    user_id     = Meteor.user()._id;
    
    function isUnique(site){
      if ( !Websites.findOne({url: site}) ){ return true; } else { return false; }
    }

    if ( Meteor.user() ){ // if logged in
      if ( isUnique(url) ){ // if URL not already in Websites

        Websites.insert({
          url:                       url,
          description:       description,
          title:                   title,
          votes:                       1,
          createdOn:          new Date(),
          submittedBy:           user_id,
          upvoters:            [user_id],
          downvoters:                 [],
          deleted:                 false
        });

      } else { console.log("Site already exists..."); }
    }
    return false; // stop the form submit from reloading the page
  }
  
}); // end of website_form events