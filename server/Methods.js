Meteor.methods({
  
  upvote: function(site_id){
    var user_id = Meteor.user()._id;
    var site = Websites.findOne({_id: site_id});
    if ( Meteor.user() ){                                            // if user is logged in
      if ( site.upvoters.indexOf(user_id) > -1){                     //   if user has already upvoted site
        Websites.update(site_id, {$inc: {votes: -1}} );              //     decrement votes by 1
        Websites.update(site_id, {$pull: {upvoters: user_id}});      //     remove user from upvoters array
      } else {                                                       //   else user has not upvoted site
        Websites.update(site_id, {$push: {upvoters: user_id}});      //     add user to upvoters
        Websites.update(site_id, {$inc: {votes: 1}} );               //     increment votes by 1
        if ( site.downvoters.indexOf(user_id) > -1 ){                //     user has previously downvoted site
          Websites.update(site_id, {$pull: {downvoters: user_id}});  //       remove user from downvoters array
        }
      }
    }
  },
  
  downvote: function(site_id){
    var user_id = Meteor.user()._id;
    var site = Websites.findOne({_id: site_id});
    if ( Meteor.user() ){                                          // if user is logged in
      if ( site.downvoters.indexOf(user_id) > -1){                 //   if user has already downvoted site
        Websites.update(site_id,  {$inc: {votes: 1}} );            //     increment votes by 1
        Websites.update(site_id, {$pull: {downvoters: user_id}});  //     remove user from downvoters array
      } else {                                                     //   else user has not downvoted site
        Websites.update(site_id, {$push: {downvoters: user_id}});  //     add user to downvoters
        Websites.update(site_id,  {$inc: {votes: -1}} );           //     decrement votes by 1
        if ( site.upvoters.indexOf(user_id) > -1 ){                //     user has previously upvoted site
          Websites.update(site_id, {$pull: {upvoters: user_id}});  //       remove user from upvoters array
        }
      }
    }
  },
  
  deleteSite: function(site_id){
    var user = Meteor.user();
    var site = Websites.findOne({_id: site_id});
    if (user && (site.submittedBy == user._id) ){ // if this is the user that submitted the site
      Websites.update(site_id, {$set: {deleted: true}});
    }
  },
  
  submitSite: function(url, title, description){
    var user_id = Meteor.user()._id;
    if ( Meteor.user() && (!Websites.findOne({url: url})) ){ // if logged in && url is new
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
    }
  }
  
});