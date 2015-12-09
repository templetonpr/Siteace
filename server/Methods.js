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
        if ( site.downvoters.indexOf(user_id) > -1 ){                //     user has previously downvoted site
          Websites.update(site_id, {$pull: {downvoters: user_id}});  //       remove user from downvoters array
          Websites.update(site_id, {$inc: {votes: 2}} );             //       increment votes by 2 to cancel out downvote
        } else {                                                     //     user hasn't previously downvoted site
          Websites.update(site_id, {$inc: {votes: 1}} );             //       increment votes by 1
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
        if ( site.upvoters.indexOf(user_id) > -1 ){                //     user has previously upvoted site
          Websites.update(site_id, {$pull: {upvoters: user_id}});  //       remove user from upvoters array
          Websites.update(site_id, {$inc: {votes: -2}} );          //       decrement votes by 2 to cancel out upvote
        } else {                                                   //     user hasn't previously upvoted site
          Websites.update(site_id,  {$inc: {votes: -1}} );         //       decrement votes by 1
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
  
  submitSite: function(url, title, description, tags){
    var user_id = Meteor.user()._id;
    if ( Meteor.user() && (!Websites.findOne({url: url})) ){ // if logged in && url is new
      
      tags = tags.split(" ");
      // eventually restricted words will be removed here
      
      Websites.insert({
        url:                       url,
        tags:                     tags,
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