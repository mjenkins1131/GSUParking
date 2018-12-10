     $(function() {
        $('#navS li a').click(function() {
           $('#navS li').removeClass();
           $($(this).attr('href')).addClass('active');
        });
     });