  var querystring =  Npm.require("querystring");

  HTTP.methods({
   medbookUser: function(data){
      data = String(data)
      var token = null;
      if (data) {
          var qs = querystring.parse(data);
          if (qs && qs.token)
              token = qs.token;
      }
      token = qs.token ? qs.token : fetchToken(this.requestHeaders);
      if (token == null)
          return "none";

      var user = lookupToken(token);
      if (user == null)
          return "none";

      var email = null;
      if (user && user.emails && user.emails.length > 0)
          email = user.emails[0].address

      if (user.services && user.services.google && user.services.google.email)
          email = user.services.google.email;
      if (email == null)
          email = "none";

      refreshUserProfileCollaborations(user); // might be too heaveyweight

      var responseObj = {
          email : email,
          username: user.username,
          collaborations: user.profile.collaborations,
      };

      var response = JSON.stringify(responseObj);
      this.setStatusCode(200)
      return response;
  },
  medbookPost: function(data){
      console.log("HTTP medbookPost data:",data);
      var post = {};
      var token = fetchToken(this.requestHeaders);

      if (this.query && 'title' in this.query) {
          post = this.query;
      } else {
          var qs = querystring.parse(String(data));
          if ('post' in qs)
              post = JSON.parse(qs.post);
          if ('token' in qs)
              token = qs.token
      }
      if ('token' in data) {
          token = data.token
      }
      if ('post' in data) {
		post = data.post
      }
      if (token != null) {
          var user = lookupToken(token);
          if (user != null)
              this.setUserId(user._id);
      }

      if (post.title == null)
          post.title = "No title";
      if (post.body == null)
          post.body = "";
      if (post.medbookfiles == null)
          post.medbookfiles = [ ];
      if (post.collaboration == null)
          post.collaboration = [ "tedgoldstein@gmail.com", "WCDT" ];

      post.sticky = false;
      post.status = STATUS_APPROVED;
      post.postedAt = new Date();
      post.createdAt = post.postedAt;
      post.commentsCount = 0;
      post.downvotes = 0;
      post.categories = [];
      post.author = user.username;
      post.inactive = false;
      post.viewCount = 1;
      post.commentCount = 0;
      post.clickCount = 0;
      post.score = 0;
      post.upvotes = 0;

      if (this.userId == null) {
          this.setStatusCode(401); // Unauthorized
          return;
      }

      var _id = MedBookPost(post, this.userId);
      if (_id == null) {
          return;
      } else {
          this.setStatusCode(200);
          return { state: "success", _id: _id}
      }
    }
  });
