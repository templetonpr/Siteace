Meteor.publish('websites', function(){
  return Websites.find({deleted: false});
});