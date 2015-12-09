Websites.allow({
  insert: function(userId, doc){ return (userId) ? true : false; },
  update: function(userId, doc){ return (userId) ? true : false; },
  remove: function(userId, doc){ return (userId === doc.submittedBy) ? true : false; }
});