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
    
    if ( !Meteor.user() ){
      throw new Meteor.Error("User not logged in");
    } else if ( Websites.findOne({url: url}) ){
      //throw new Meteor.Error("Site already in DB");
      response.statusCode = 999;
      return response;
    } else {
      
      try {
        response = HTTP.get(url, {timeout: 5000});
      } catch (e) {
        response = e.response;
      } finally {
        if (response.statusCode == 200){
          var user_id = Meteor.user()._id;

          tags = tags.split(" ");
          // check for & remove blacklisted words here.
          // If any are found, throw an error and don't insert site.

          var meta = extractMeta(url); // set title & desc to site's info if user didn't input. Probably redo this.
          if (!description){ description = meta.description; }
          if (!description){ description = " Could not find description"; }
          if (!title){ title = meta.title; }
          if (!title){ title = url; description += " Could not find title"; }

          newSite = {
            url:                                url,
            tags:                              tags,
            description:                description,
            title:                            title,
            votes:                                1,
            createdOn:                   new Date(),
            submittedBy:                    user_id,
            submittedByName: Meteor.user().username,
            upvoters:                     [user_id],
            downvoters:                          [],
            deleted:                          false
          };

          Websites.insert(newSite);

          return response;
        } else {
          return response;
        }
      }
    }
  }
  
});

// https://groups.google.com/forum/#!topic/meteor-talk/fQmeofXROuY