Websites.allow({
  
  insert: function(userId, doc){
    if (Meteor.user()){ // they are logged in
      if (userId != doc.createdBy){ // the user is messing about
        return false;
      } else { // the user is logged in, the image has the correct user id
        return true;
      }
    } else { // user not logged in
      return false;
    }
  }, 
  
  remove: function(userId, doc){
    if (Meteor.user()){
      if (userId != doc.createdBy){
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
});