  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
       	$("#emailId").text("");
  		$("#user").text("");
  		$(".sensenetInterface").hide();
  		$("#signin").show();
  		$("#signout").hide();
      $("#signedout").show();
    });
  }