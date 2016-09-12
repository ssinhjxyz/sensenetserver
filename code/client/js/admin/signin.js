function signIn(googleUser) 
{
  var profile = googleUser.getBasicProfile();
  emailId = profile.getEmail();  
  authorize(emailId, profile);
}
