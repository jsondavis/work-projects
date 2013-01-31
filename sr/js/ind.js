var refresh = null;
/* 
  * Adds Header and links to header
  *
  */ 
var Header = {
        links : ['home', 'help'],

        addHeader : function(){
                $('body').append('<header></header>');
                $('header').addClass('navbar navbar-fixed-top navbar-inverse');
                $('header').append('<div class="navbar-inner"></div>');
                $('.navbar-inner').append('<div class="container"></div>');
                $('div.container').append('<a href="#" id="logo">nassau feedback</a>');
                $('div.container').append('<nav><ul class="nav pull-right"></ul></nav>');
                for(var i = 0; i < Header.links.length; i++){
                        $('nav ul').append('<li><a href="/' + Header.links[i] + '">' + Header.links[i] + '</a></li>');
                    }
            
            },

        addLogout : function(){
                if($('nav ul').find('li:last').text() !== 'sign out'){
                    $('nav ul').append('<li><a href="logout">sign out</a></li>');
                }
                var signout = $('nav ul').find('a:last').click(function(event){
                    event.preventDefault();
                    if(refresh){
                            clearInterval(refresh);
                        }
                    $.removeCookie('NassauSRCookie');
                    $('body').empty();
                    //$('#formdiv').empty();
                    $('nav ul').find('li:last').remove();
                    LoginForm.login = false;
                    LoginForm.init();
                    Header.addHeader();
                    });
            }
    };


var SignupForm = {
    
    init : function(){
        SignupForm.addSignup();
        SignupForm.submit();
        },
   
    branches : function(){
                var brancharray = [ 'Atlanta' , 'Eagle' , 'Gotham' , 'New Jersey' , 'T/A' , 'West' ],
                    branchfield = '<label for="branch">Branch:</label><br/>\n<select id="branch" name="branch">';
                    
                    jQuery.each(brancharray, function(){
                        branchfield += '<option value=' + this + '>'+ this +'</option><br/>\n';
                        });
                    branchfield += '</select>\n';
                return branchfield;
            },

    fields : {
             emailfield : '<label for="email">Email:</label><br/><input type="email" id="email" name="email">', 
          passwordfield : '<label for="password">Password:</label><br/><input type="password" id="password" name="password">',
              namefield : '<label for="name">Name:</label><br/><input type="text" id="name" name="name">',
        passwordconfirm : '<label for="password">Password Confirmation:</label><br/><input type="password" id="confirm" name="confirm">',
             },
   
    addSignup : function(){
        
            var formdiv = $('#formdiv');

            if(formdiv.length < 1){
                $('body').append('<div id="formdiv"></div>');
                formdiv = $('#formdiv');
                }

            formdiv.append('<form action="echo.php" method="post">\n' 
                    + '<h4>Please Sign Up</h4>'
                    + SignupForm.fields.namefield + '<br/>\n'
                    + SignupForm.fields.emailfield + '<br/>\n'
                    + SignupForm.branches() + '\n'
                    + SignupForm.fields.passwordfield + '<br/>\n'
                    + SignupForm.fields.passwordconfirm + '<br/>\n'
                    + '<button type="submit" name="login" value="signup" class="btn btn-warning">Sign Up</button>\n<span> or <a href="/login">Log In</a></span></form>');        

            var login = $('#formdiv span a');
            login.click(function(event){
                    event.preventDefault();
                    formdiv.empty()
                    LoginForm.init();
                });

        },
   
    submit : function(){
                $('#formdiv button').click(function(event){
                    event.preventDefault();

                    var name = $('#name').val().trim()
                        ,branch = $('#branch').val().trim()
                        ,email = $('#email').val().trim()
                        ,password = $('#password').val();
    
                    var dataString = 'login=signup&name=' + name + '&branch=' + branch;
                    dataString = dataString + '&email=' + email + '&password=' + password;

                    console.log(dataString);

                    var jqxhr = $.ajax({
                                url : 'echo.php',
                                type : 'POST',
                                data : dataString
                                }) 
                                .done(function(data) { 
                                    var parsedata = JSON.parse(data);
                                    if(parsedata.login === true){
                                        LoginForm.login = true;
                                        //console.log(data);
                                    // set cookie
                                        SignupForm.makeCookie(parsedata.name, parsedata.branch, parsedata.supervisor);
                                        $('#formdiv form').remove();
                                        Header.addLogout();
                                        Feedback.init();
                                    // set login true
                                        LoginForm.login = true;
                                        Aside.init();
                                    }
                                    }) 
                                .fail(function(data) {
                                    // display login errors
                                    return false; 
                                    }) 
                                .always(function() { 
                                    console.log("login complete"); 
                                    });
                        
            });    
        },

    makeCookie : function(name, branch, supervisor){
        
            $.cookie.json = true;

            user = {
                    name : name,
                    branch : branch,
                    supervisor : supervisor
                    };

            $.cookie('NassauSRCookie', user, { expires: 14 });
            
        }
    };

    
var LoginForm = {
    
    init : function(){
        if(!LoginForm.checkForCookie()){
            LoginForm.addLogin();
            LoginForm.checkLogin();

            }
        
        },

    checkForCookie : function(){
            $.cookie.json = true;
            var cookieval = $.cookie('NassauSRCookie');
            if(cookieval !== null && cookieval.name !== '' && cookieval.branch !== ''){

                   var name = cookieval.name,
                       branch = cookieval.name;
                        
                   var dataString = 'login=return&name=' + name + '&branch=' + branch;

                   var jqxhr = $.ajax({
                                url : 'echo.php',
                                type : 'POST',
                                data : dataString
                                }) 
                                .done(function(data) { 
                                    // set login true
                                    LoginForm.login = true;
                                    Aside.init();
                                    return true;
                                    }) 
                                .fail(function() {
                                    // display login errors
                                    return false; 
                                    }) 
                                .always(function() { 
                                    console.log("login complete"); 
                                    });
                        
                }
        },



     fields : { 
         emailfield : '<label for="email">Email:</label><br/><input type="email" id="email" name="email">', 
      passwordfield : '<label for="password">Password:</label><br/><input type="password" id="password" name="password">'
        },

    addLogin : function(){
        if(LoginForm.login === undefined || LoginForm.login === false){
            var formdiv = $('#formdiv');

            if(formdiv.length < 1){
                $('body').append('<div id="formdiv"></div>');
                formdiv = $('#formdiv');
                }
        
        //var formdiv = $('#formdiv');
    
        formdiv.append('<form action="echo.php" method="post">\n' 
                    + '<h4>Please Login</h4>'
                    + LoginForm.fields.emailfield + '<br/>\n' 
                    + LoginForm.fields.passwordfield + '<br/>\n'
                    + '<button type="submit" name="login" class="btn btn-warning">Login</button>\n<span> or <a href="/signup">Sign up</a></span></form>');        

            var signup = $('#formdiv span a');
            signup.click(function(event){
                    event.preventDefault();
                    formdiv.empty()
                    SignupForm.init();
                });
        }
        },

    checkLogin : function(){
            $.cookie.json = true;
            var cookieval = $.cookie('NassauSRCookie');
            if(cookieval === null){
                $('#formdiv button').click(function(event){

                    event.preventDefault();

                    $('#formdiv form').slideUp('slow');

                   var email = $('#email').val().trim(),
                        pass = $('#password').val().trim();
                    
                    $('#formdiv input').val('');

                   var dataString = 'login=login&email=' + email + '&password=' + pass;

                   var jqxhr = $.ajax({
                                url : $('#formdiv form').attr('action'),
                                type : 'POST',
                                data : dataString
                                }) 
                                .done(function(data) {
                                        $('#formdiv form').remove();
                                    // set login true
                                    var parsedata = JSON.parse(data);
                                    if(parsedata.login === true){
                                        LoginForm.login = true;
                                        //console.log(data);
                                        LoginForm.makeCookie(parsedata.name, parsedata.branch, parsedata.supervisor);
                                        Header.addLogout();
                                        Feedback.init();
                                    }else{
                                        LoginForm.init();    
                                    }

                                    }) 
                                .fail(function(data) {
                                    // display login error
                                    console.log(data);
                                    }) 
                                .always(function() { 
                                    //console.log("regular login complete"); 
                                    Aside.init();
                                    });
                });

            }else{
                Header.addLogout();
                Feedback.init();
                Aside.init();
            }
        },

    makeCookie : function(name, branch, supervisor){
        
            $.cookie.json = true;

            user = {
                    name : name,
                    branch : branch,
                    supervisor : (supervisor === '1')
                    };

            $.cookie('NassauSRCookie', user, { expires: 14 });
            
        },

    logout : function(){
            $.removeCookie('NassauSRCookie');
            $('#aside').remove();
        }
    };


/** Feedback object
 * this object contains all of the methods to add a Feedback form to the page the form will hold
 * all of the data and can be used to submit the form data to another page 
 * 
 */ 
var Feedback = {
  
    /*
     * form values
     */
    formvalues: {
        user: "",
        branch: "",
        account: "",
        order_invoice: "",
        category: "",
        description: "",
        },

    /*
     * getFormValues binds eventlisteners to the values in the form
     * and sets the formvalues as they are updated.
     */
    getFormValues: function(){
        $('#formdiv input').on('input',function(e){
                var target = e.target;
                var value = $('#' + target.id).val().trim();
                Feedback.formvalues[target.id] = value;
            });
        },

    getLoginInfo : function(){
        
            $.cookie.json = true;

            var cookieval = $.cookie('NassauSRCookie');

            if(cookieval !== null){
                var name = cookieval.name,
                    branch = cookieval.branch;

                $('#user').val(name);
                $('#branch').val(branch);
            }
        },

    /*
     * init should add the beginnings of the feedback form to the page as well as the listeners
     * for account number length and category hover and verify data on submit.
     */
    init: function(){
        this.formAppend();
        //var account = Feedback.formvalues.account === undefined ? '' : Feedback.formvalues.account;
        //var category = Feedback.formvalues.category === undefined ? '' : Feedback.formvalues.category;
        this.addCategories(Feedback.formvalues.account.length, Feedback.formvalues.category.length);
        this.getLoginInfo();
        this.getFormValues();
        this.accountListener();
        this.categoryListener();
        this.categoryHover();
        this.checkboxWatcher();
        this.formSubmit();
    },
   
    /*
     * form contains all of the fields of the feedback form. 
     */
    form: {
        
         userfield: '<input type="text" name="user" id="user">\n'
         ,branchfield: '<input type="text" name="branch" id="branch">\n'
         ,accountfield: '<div id="acctdiv">\n<label for="account">Account</label><br/>\n<input type="text" name="account" id="account"><br/>\n</div>'
         ,orderfield: '<div id="orddiv">\n<label for="order">Invoice Number (Lab)</label><br/>\n<input type="text" name="order_invoice" id="order_invoice"><br/>\n</div>'
         ,categoryfield: '<div id="categorydiv">\n<label for="category">Category</label><br/>\n<input type="text" name="category" id="category">\n</div>'
         ,descriptionfield: '<div id="descriptiondiv">\n<textarea cols="40" id="description" name="description" placeholder="Feedback Description" rows="5"></textarea><br/>\n</div>'
         ,resolvedfield: '<div id="resolveddiv">\n<label for="resolved">Problem Resolved?</label><br/>\n<input type="checkbox" name="resolved" id="resolved" value="resolved" style="width:35px;"><span id="yesno">No</span>\n</div>'
        },

    /*
     * formAppend adds the elements in form as well as the submit button to the formdiv in the page
     */
    formAppend: function(){

            var formdiv = $('#formdiv');

            if(formdiv.length < 1){
                $('body').append('<div id="formdiv"></div>');
                formdiv = $('#formdiv');
                }

            formdiv.append('<form action="echo.php" method="post">\n' 
                    + this.form.userfield + '\n'
                    + this.form.branchfield + '\n'
                    + this.form.accountfield + '\n'
                    + this.form.orderfield + '\n'
                    + this.form.categoryfield + '\n'
                    + this.form.resolvedfield + '\n'
                    + this.form.descriptionfield + '\n'
                    +'<button type="submit" name="post" class="btn btn-warning">Submit Feedback</button>\n</form>');


            $.cookie.json = true;
            var cookieval = $.cookie('NassauSRCookie');
            
            var name = cookieval.name,
                branch = cookieval.branch;

            $('#user').val(name);
            $('#branch').val(branch);

            $('#user, #branch, #orddiv').hide();

        },

    /*
     * accountListener watches the account number length and adjusts the order field accordingly
     * 4 - 6 digits assumes Optifacts / Nova account number
     * < 4 or 7 - 9 digits do not correspond to any accounts
     * 10 digits assumes Oracle account number
     */
    accountListener: function(){

        Feedback.formvalues.watch('account',function(id, oldval, newval){
                
                var orddiv = $('#orddiv');
                if(orddiv.is(':visible') && (newval.length < 4 || newval.length > 10)){
                    orddiv.hide('slow');
                }
                if(!orddiv.is(':visible') && newval.length >= 4 && newval.length < 11){
                    orddiv.show('slow');
                }
                if(orddiv.is(':visible')){
                    if(newval.length > 6){
                            $('#orddiv label').text('Order Number (Oracle)');
                        }
                    if(newval.length <= 6){
                            $('#orddiv label').text('Invoice Number (Lab)');
                        }
                }
                //console.log("account listener -> " + newval);
                
                var categoryval = $('#categorydiv input').val().trim();

                Feedback.addCategories(newval.length, categoryval.length);

            });
        },

    /* categoryListener observes the value of the account field and adjusts the 
     * categories displayed accordingly. It also handles adding and clearing
     * the category dropdown display. 
     */
    categoryListener: function(){
       
        $('#categorydiv input').hide();
        
        Feedback.formvalues.watch('category',function(id, oldval, newval){
            
            var catdiv = $('#categorydiv');
            if(catdiv.find('input').val() === ""){
                catdiv.find('input').hide('slow');
                catdiv.find('a').remove();
                var accountlength = Feedback.formvalues.account === undefined ? 0 : Feedback.formvalues.account;
                var newvallength = newval === undefined ? "" : newval;
                Feedback.addCategories(accountlength.length, newvallength.length);
            }else{
                catdiv.find('input').show('slow');
            }     
        });


    },

    categoryHover: function(){
        
        
        $('.topchoices').hover(
            function(){
                $(this).siblings().addClass('hiddendivs');
                $(this).children().removeClass('hiddenchoices');
                $(this).children().addClass('visiblechoices');
                $('.visiblechoices').click(function(){
                        $(this).siblings().remove();
                        var choice = $(this).text();
                        choice = $(this).parent().text().replace(choice,"") + ' - ' + choice;
                        $('#specialselect').html('');
                        $('#categorydiv input').show('slow');
                        $('#categorydiv input').val(choice);
                        $('#categorydiv input').attr('readonly', true);
                        $('#specialselect').css('min-height', 5);
                        if($('#categorydiv').find('a').length === 0){
                            $('#categorydiv label').append(' - <a href="">Clear</a>');
                        }
                        $('#categorydiv label a').click(function(event){
                            event.preventDefault();
                            $('#categorydiv input').val('');
                            $('#categorydiv label').html('Category');
                            var account = $('#acctdiv input').val();
                            account = account === undefined ? 0 : account;
                            $('#specialselect').css('min-height', 110);
                            Feedback.addCategories(account.length, 0);
                            $('#categorydiv input').hide('slow');
                            Feedback.categoryHover();
                            });
                    })
                },
            function(){
                    if($('#categorydiv input').val() === ''){
                        $(this).siblings().removeClass('hiddendivs');
                        $(this).children().addClass('hiddenchoices');
                        }
                });

        },

    /*addCategories takes the integer @accountlength and uses it 
     * to determine which fields should be displayed and what 
     * the labels should say.
     */
    addCategories: function(accountlength, categorylength){
        if($('#categorydiv').find('#specialselect').length === 0){
            $('#categorydiv').append('<div id="specialselect"></div>');
        }

        function specialadd(toplevel, sublevel){
                for(var i = 0; i < sublevel.length; i++){
                        toplevel.append(sublevel[i]);
                    }
            }

        var selectdiv = $('#specialselect');

        if(categorylength < 1 || categorylength === undefined){

            if(accountlength < 4 || accountlength === undefined){

                $('#specialselect').css('min-height',155);

                var startfields = Feedback.categoryFields.customerexp;
                var subfields = Feedback.categoryFields.customerexpsub;

                selectdiv.html(startfields);
            
                var startdiv = selectdiv.find('div:last');

                specialadd(startdiv, subfields);

                startfields = Feedback.categoryFields.systemissue;
                subfields = Feedback.categoryFields.systemissuesub;
            
                selectdiv.append(startfields);

                var startdiv = selectdiv.find('div:last');

                specialadd(startdiv, subfields);

                selectdiv.find('.sub').addClass('hiddenchoices');

            }else if(accountlength >= 4 && accountlength < 11){
 
                $('#specialselect').css('min-height',230);

                var startfields = [ Feedback.categoryFields.wrongprod
                                  , Feedback.categoryFields.missingprod
                                  , Feedback.categoryFields.shipping
                                  , Feedback.categoryFields.accountsetup ];
            
                  var subfields = [ Feedback.categoryFields.wrongprodsub
                                  , Feedback.categoryFields.missingprodsub
                                  , Feedback.categoryFields.shippingsub
                                  , Feedback.categoryFields.accountsetupsub ];
            
                selectdiv.html('');

            for(var i = 0; i < startfields.length; i++){  
                    selectdiv.append(startfields[i]);
                    if(i == 2){
                        selectdiv.find('div:last').css('clear','both');
                        }
                    var attr = selectdiv.find('div:last');
                    specialadd(attr,subfields[i]); 
                }
    
        
            selectdiv.find('.sub').addClass('hiddenchoices');

        }
        Feedback.categoryHover();
      }
},

/*
 * Category selection fields
 */
categoryFields: {
    
     customerexp : '<div id="custexp" class="topchoices">Customer Experience</div>',

  customerexpsub : ['<div id="1" class="sub">Customer Service</div>'
                 , '<div id="2" class="sub">Product Quality</div>'
                 , '<div id="3" class="sub">Shipping Quality</div>'],


     systemissue : '<div id="systemissue" class="topchoices">System Issues</div>',

  systemissuesub : ['<div id="1" class="sub">Oracle Printing</div>'
                 , '<div id="2" class="sub">Oracle Other</div>'
                 , '<div id="3" class="sub">Phone Issue</div>'
                 , '<div id="4" class="sub">Optifacts Problem</div>'],

       wrongprod : '<div id="wrongproduct" class="topchoices">Incorrect Product</div>',

    wrongprodsub : ['<div class="sub">Order Entry</div>'
                 , '<div class="sub">Order Pulling</div>'
                 , '<div class="sub">Carrier</div>'
                 , '<div class="sub">System Issue</div>'], 

     missingprod : '<div id="missingproduct" class="topchoices">Missing Product</div>',

  missingprodsub : ['<div class="sub">Order Entry</div>'
                 , '<div class="sub">Order Pulling</div>'
                 , '<div class="sub">Carrier</div>'
                 , '<div class="sub">System Issue</div>'], 

        shipping : '<div id="shipping" class="topchoices">Shipping</div>',

     shippingsub : ['<div class="sub">Order Entry</div>'
                 , '<div class="sub">Order Pulling</div>'
                 , '<div class="sub">Carrier</div>'
                 , '<div class="sub">System Issue</div>'], 
    
  
    accountsetup : '<div id="acctsetup" class="topchoices">Account Setup</div>',

 accountsetupsub : ['<div class="sub">Pricing</div>'
                 , '<div class="sub">UPS Address</div>'
                 , '<div class="sub">Oracle Address</div>'
                 , '<div class="sub">Credit Limit</div>'
                 , '<div class="sub">Credit Hold</div>'], 

    },

    checkboxWatcher: function(){
            $('#resolveddiv input').click(function(event){
                    var yesval = $('#yesno').text();
                    yesval = (yesval === 'No')? 'Yes' : 'No' ;
                    $('#resolveddiv span').text(yesval);
                    if(yesval === 'Yes'){
                        $('#description').attr('placeholder', 'Feedback Description. Please include action taken.');
                    }else if(yesval === 'No'){
                        $('#description').attr('placeholder', 'Feedback Description.');                        
                    }
                });
        },

    formSubmit : function(){
            $('#formdiv button').click(function(event){
                event.preventDefault();
                var name = $('#user').val().trim(),
                  branch = $('#branch').val().trim(),
                 account = $('#account').val().trim(),
           order_invoice = $('#order_invoice').val().trim(),
                category = $('#category').val().trim(),
                resolved = $('#resolved').val(),
             description = $('#description').val().trim()
                  errors = 0;
    
            
             $.cookie.json = true;
             var cookieval = $.cookie('NassauSRCookie');

             if(name === ''){
                    name = cookieval.name;
                 }

             if(branch === ''){
                    branch = cookieval.branch;
                 }

             if(isNaN(Number(account))){
                    var acctlabel = $('#acctdiv label').text();
                    document.getElementById('acctdiv').scrollIntoView();
                    window.setTimeout(function(){$('#acctdiv label').css('color', 'red')}, 150);
                    window.setTimeout(function(){$('#acctdiv label').text('This is not a valid account number!')}, 200);
                    window.setTimeout(function(){$('#acctdiv label').text(acctlabel)}, 5000);
                    window.setTimeout(function(){$('#acctdiv label').css('color', 'black')}, 5500);
                    errors++;
                 }

             if(isNaN(Number(order_invoice))){
                    var orderlabel = $('#orddiv label').text();
                    document.getElementById('acctdiv').scrollIntoView();
                    window.setTimeout(function(){$('#orddiv label').css('color', 'red')}, 150);
                    window.setTimeout(function(){$('#orddiv label').text('This is not a valid order/invoice number!')}, 200);
                    window.setTimeout(function(){$('#orddiv label').text(orderlabel)}, 5000);
                    window.setTimeout(function(){$('#orddiv label').css('color', 'black')}, 5500);
                    errors++;
                 }

             if(category === ''){
                    var catlabel = $('#categorydiv label').text();
                    window.setTimeout(function(){$('#categorydiv label').css('color', 'red')}, 150);
                    document.getElementById('acctdiv').scrollIntoView();
                    window.setTimeout(function(){$('#categorydiv label').css('color', 'black')}, 5500);
                    errors++;
                }

            dataString = 'name=' + name + '&branch=' + branch + 
                         '&account=' + account + '&order_invoice=' + order_invoice +
                         '&category=' + category + '&description=' + description +
                         '&resolved=' + resolved + '&login=feedback';  

            if(errors > 0){
                return false;    
            }
            else{
                var jqxhr = $.ajax({
                            url : $('#formdiv form').attr('action'),
                            type : 'POST',
                            data : dataString
                            })
                            .done(function(data){
                                    console.log('success =>' + data);
                                    $('#formdiv form').slideUp('slow');
                                    window.setTimeout(function(){
                                    $('#formdiv').append('<h3>Feedback Submitted!</h3>');
                                    }, 550);
                                    $('#formdiv input').val('');
                                    $('#orddiv').hide();
                                    $('#formdiv textarea').val('');
                                    $('#categorydiv a').click();
                                    window.setTimeout(function(){
                                        $('#formdiv h3').remove();
                                        $('#formdiv form').slideDown('slow');                                      
                                        }, 2500);
                                })
                            .fail(function(data){
                                    console.log('fail =>' + data);
                                })
                            .always(function(){
                                    //console.log('request complete');
                                    if(resolved === 'resolved'){
                                        $('#resolved').click();
                                    }
                                });
                
                return false;
            }

                });


        }

};



var Aside = {
        init : function(){
            $.cookie.json = true;
            var cookieval = $.cookie('NassauSRCookie');
            if(NassauLogin !== undefined || (cookieval !== null && cookieval.name !== undefined)){
                    Aside.addAside();
                    refresh = window.setInterval(function(){ 
                            Aside.refresh();
                            //console.log('refreshed');
                            }, 30000); 
                    
                }
            },

        addAside : function(){
                $.cookie.json = true;
                var cookieval = $.cookie('NassauSRCookie');

                var supervisor = cookieval.supervisor == true? true : false,
                        branch = cookieval.branch,
                        user = cookieval.name;

               var aside = $('#aside');
               if(aside.length < 1){
                   $('body').append('<div id="aside" class="span8"></div>');
                   aside = $('#aside');
               }

               aside.hide();

                // add paginate and nav buttons here

               Aside.getAside(user, branch, supervisor);
               
            },

        getAside : function(user, branch, supervisor){

                var dataString = 'user=' + user + '&branch=' + branch;
                //console.log(dataString);

                if(supervisor){
                        dataString += '&aside=supervisor';
                        var displayCategories = ['Account', 'Category', 'Order / Invoice', 'Time', 'Name'];
                        $('#aside').removeClass('span8').addClass('span9');
                        $('#aside').css('margin', '70px 5px 90px 30px');
                }else{
                        var displayCategories = ['Account', 'Category', 'Order / Invoice', 'Time'];
                }

            Aside.getData(dataString, displayCategories);

        },

        getData : function(dataString, categories){

                var jqxhr = $.ajax({
                                    url : 'aside.php',
                                    type : 'POST',
                                    data : dataString
                                    })
                            .done(function(data){
                                   var parsedata = JSON.parse(data),
                                        supervisor = $.cookie('NassauSRCookie').supervisor;
                                   //console.log(parsedata.issues.length);
                                   if(parsedata.issues.length > 0){
                                             $('#aside').show('slow');
                                       if(supervisor){
                                           $('#aside').append('<legend>' + parsedata.issues[0].branch + '\'s Entries</legend>');
                                       }else{
                                           $('#aside').append('<legend>' + parsedata.issues[0].name + '\'s Entries</legend>');
                                       }
                                       $('#aside').append('<div class="row top"></div>');

                                       jQuery.each(categories, function(i, val){
                                               $('#aside div:first').delay(400).queue(function(next){
                                               if(val === 'Name'){
                                                   $(this).append('<div class=span1>' + val + '</div>'); 
                                               }else{
                                                   $(this).append('<div class=span2>' + val + '</div>'); 
                                               }
                                               next();
                                               });
                                           });
                                   
                                       var delay = 1000;                     
                                       jQuery.each(parsedata.issues, function(i, val){
                                                var time = moment.unix(val.time),
                                                    now = moment(),
                                                    since = time.from(now);
                                                delay += 600;
                                                $('#aside').append('<div class=row></div>');
                                                $('#aside div:last').delay(delay).queue(function(next){
                                                var openlink = supervisor ? '<a class=idref href="#">' : '';
                                                var closelink = supervisor ? '</a>' : '';
                                                var namedisplay = supervisor ? '<div class=span1>' + val.name + '</div>' : ''; 
                                                    $(this).append( openlink + '<div class=span2>' + val.account + '</div>' + 
                                                                   '<div class=span2 title="' + val.category + '">' + 
                                                                   val.category.split('-')[0] + '</div>' +
                                                                   '<div class=span2>' + val.order_invoice + '</div>' + 
                                                                   '<div class=span2>' + since + '</div>' + 
                                                                   '<div class=hiddenID>' + val.id + '</div>' +
                                                                   closelink + namedisplay);
                                                    next();
                                                });
                                       });

                                       Aside.selectId();

                                   }
                                })
                            .fail(function(){
                                    console.log('Houston we have a problem.');
                                })
                            .always(function(){
                                
                                });
                return false;
            },

        selectId : function(){
                        $('.row').click(function(event){
                            event.preventDefault();
                            var id = $(this).find('.hiddenID').text();

                            Aside.issueDisplay(id);
                            

                        });
                    },

        issueDisplay : function(issueid){
                        
                        function addIssueDisplay(){
                                
                                $('#formdiv, #aside').css('opacity' , '0.3');
                                
                                var issue = $('#issue-display');
                                if(issue.length < 1){
                                        $('body').append('<div id="issue-display" class="issue hero-unit span7"></div>');
                                        issue = $('#issue-display');

                                issue.append('<h4>Additional Information</h4>\n<form action="echo.php">');
    
                                //var issueform = $('#issue-display form');

                                var fields = ['account' , 'order/invoice', 'category', 'resolved', 'description'];

                                jQuery.each(fields, function(){
                                            issue.append('<label class="span7" for=' + this + '>' + this + '</label><br/>\n');
                                            issue.append('<input class="span3" type="text" id=' + this + '><br/>\n');
                                        });

                                issue.append('<br/><a class="btn btn-primary">' +
                                                                    'Save changes</a> <a class="btn">' +
                                                                    'Cancel</a>');

                                    }
                            }

                        var dataString = 'issue=' + issueid;

                        var jqhxr = $.ajax({
                                            url : 'aside.php',
                                            type : 'POST',
                                            data : dataString
                                            })
                                    .done(function(data){
                                        var formString = "";
                                        var parsedata = JSON.parse(data);
                                        addIssueDisplay();
                                        })
                                    .fail(function(){
                                        
                                        })
                                    .always(function(){
                                        
                                            
                                    }); 
                         
                        

                    },



        refresh : function(){
                        var maxid = parseInt($('#aside div.hiddenID:first').text());

                        $.cookie.json = true;
                        var cookieval = $.cookie('NassauSRCookie');

                        var supervisor = cookieval.supervisor == true? true : false,
                                branch = cookieval.branch,
                                user = cookieval.name;

                        var dataString = 'user=' + user + '&branch=' + branch + '&superviosr=' + supervisor;

                        // get all from array
                        var jqhxr = $.ajax({
                                            url : 'aside.php',
                                            type : 'POST',
                                            data : dataString
                                            })
                                    .done(function(data){
                                           var parsedata = JSON.parse(data);
                                           //console.log(parsedata);    
                                       jQuery.each(parsedata.issues, function(i, val){
                                           if(val.id > maxid){
                                                var time = moment.unix(val.time),
                                                    now = moment(),
                                                    since = time.from(now);
                                                $('#aside div.top').next().delay(200).queue(function(next){
                                                var rowstart = '<div class=row>',
                                                      rowend = '</div>';
                                                    openlink = supervisor ? '<a class=idref href="#">' : '',
                                                   closelink = supervisor ? '</a>' : '',
                                                 namedisplay = supervisor ? '<div class=span1>' + val.name + '</div>' : ''; 
                                                    $(this).before( rowstart + openlink + '<div class=span2>' + val.account +
                                                                   '</div>' + '<div class=span2 title=' + val.category + '>' + 
                                                                   val.category.split('-')[0] + '</div>' +
                                                                   '<div class=span2>' + val.order_invoice + '</div>' + 
                                                                   '<div class=span2>' + since + '</div>' + 
                                                                   '<div class=hiddenID>' + val.id + '</div>' +
                                                                   closelink + namedisplay + rowend );
                                                    next();
                                                });
                                           }else{
                                                // do nothing    
                                           }
                                        });
                                       
                                        })
                                    .fail(function(){
                                            console.log('Houston we have a problem.');
                                        })
                                    .always(function(){
                                            //console.log('fields added');
                                        });

                    }
    };


var NassauLogin = (function(){
    var undef;
    $.cookie.json = true;
    var thecookie = $.cookie('NassauSRCookie');
    return thecookie === null ? undef : thecookie;
    }());


/* ie 
* This function defines ie to determine the version
* of Internet Explorer if any being used.
* Currently I have no plans to ensure support for IE.
*/ 

var ie = (function(){ 
var undef, 
    v = 3; 
    div = document.createElement('div'), 
    all = div.getElementsByTagName('i'); 
    
while ( div.innerHTML = '<!--[if gt IE ' 
            + (++v) + ']><i></i><![endif]-->', 
            all[0] ); 
return v > 4 ? v : undef; 
    }()); 

/******************************************************************************
 * object.watch v0.0.1: Cross-browser object.watch * 
 * By Elijah Grey, http://eligrey.com * 
 * A shim that partially implements object.watch and object.unwatch 
 * in browsers that have accessor support. * 
 * Public Domain. * 
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch 
if (!Object.prototype.watch) { 
    Object.defineProperty(Object.prototype, "watch", { 
        enumerable: false , 
        configurable: true , 
        writable: false , 
        value: function (prop, handler) { 
            var oldval = this[prop] , 
                newval = oldval , 
                getter = function () { 
                    return newval; 
                    } , 
                setter = function (val) { 
                    oldval = newval; 
                    return newval = handler.call(this, prop, oldval, val); 
                    } ; 
                if (delete this[prop]) { // can't watch constants 
                    Object.defineProperty(this, prop, { 
                        get: getter , 
                        set: setter ,
                        enumerable: true , 
                        configurable: true 
                        }); 
                } 
        } 
    }); 
}


// object.unwatch 
if (!Object.prototype.unwatch) { 
    Object.defineProperty(Object.prototype, "unwatch", { 
        enumerable: false , 
        configurable: true , 
        writable: false , 
        value: function (prop) { 
            var val = this[prop]; 
            delete this[prop]; // remove accessors 
            this[prop] = val; 
            } 
    }); 
}


/******************************************************************************/


/*
 * builds and submits form with js / jquery 
 *
 *
 */ 

$(document).ready(function(){ 
    
    if(ie <= 9){ 
       
       // Complain about old Internet explorer here 

        $('body').append('<h3> Please download Internet Explorer version 9 or better.</h3>\n' + 
                         '<h3>Or download Google Chrome or Mozilla Firefox.</h3>\n'); 
    }else if(!ie){ 
        Header.addHeader();

       // All other logic goes here 
       if(NassauLogin === undefined){
           LoginForm.init();
       }else{

       // check session or cookie for valid login stuff 
       // if login doesnt exist in either render login form 
           Header.addLogout();
           Feedback.init();
           Aside.init();
       }
    } 
});
