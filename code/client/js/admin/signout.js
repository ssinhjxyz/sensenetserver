  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      $("#adminContent").hide();
      $("#emailId").text("");
      $("#user").text("");
      $("#signin").show();
      $("#signout").hide();
    });
  }