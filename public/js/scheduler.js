
      function handleScheduleClick(event){
          var emailId = $("#emailId").text();
          var bbbId = $("#bbbId").val();
          $.post('/schedule', { emailId: emailId, bbbId: bbbId}).done(           
                          function(data) 
                          {
                            console.log('success');
                            console.log(data);
                          }
                    );
      }

      function validateEmailId(email){

      }

      function refreshCalendars(){
            var bbb1Cal = document.getElementById('BBB1Calendar');
            if(bbb1Cal)
              bbb1Cal.src = bbb1Cal.src;

            var bbb2Cal = document.getElementById('BBB2Calendar');
            if(bbb2Cal)
              bbb2Cal.src = bbb2Cal.src

      }