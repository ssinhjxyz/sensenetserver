function renderButton() {
      gapi.signin2.render('signin', {
        'scopes': ['https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/userinfo.email'],
        'onsuccess': signIn,
        'onfailure': signOut
      });
    }