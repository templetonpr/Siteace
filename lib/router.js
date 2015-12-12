Router.configure({
  layoutTemplate: "ApplicationLayout"
});

Router.route("/", function(){
  this.render( "navbar", {to: "navbar"} );
  this.render( "website_list", {to: "main", path: "/"} );
});

Router.route("/about", function(){
  this.render( "navbar", {to: "navbar"} );
  this.render( "about", {to: "main"} );
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
