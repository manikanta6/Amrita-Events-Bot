
var express    = require('express');
var request = require("request");
var dateFormat = require('dateformat');


var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));

var i=1;
var mongojs   = require('mongojs')

var port = process.env.PORT||8080;

var db = mongojs('mongodb://amritaclub:9885@ds029486.mlab.com:29486/mani', ['event','subscribed']);

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/',function(req,res){
        
    res.sendFile(__dirname +'/public/form.html');
   

                                });

app.get('/event',function(req,res){



    var name=req.query.club;
    var hall=req.query.hall;
    var date=req.query.date;
    var event=req.query.event;
    var des=req.query.des;


    db.event.insert({club:name,hall:hall,date:date,event:event,descrip:des},function(err,docs)
    {
        if(err)
        {
            console.log(err);
        }else
        {
            res.sendFile(__dirname +'/public/success.html');
        }

        db.subscribed.find({person:"identity"},function(err,docs){
            if(err)
        {
            console.log(err);
        }else
        { 
            var i;
            for(i=0;i<docs.length;i++)
            {

            
         if(docs[i].cname==name)
         {
    //request("https:www.gupshup.io/developer/bot/botname/public?key=1325698540829049 & message="+ name +" is conducing in"+hall +"on"+date +"about"+des
    //request("https://www.gupshup.io/developer/bot/amritaevents/public?key=1260002900719641&message=am chastunav ra"

        request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+docs[i].id+"&message="+ name +" is conducing in"+hall +"on"+date +"about"+des


                      , function(error, response, body) {
                        if(err)
                        {
                            console.log("err");
                        }
                        
                          console.log(response);
                        });

              }
               
            }
        }


        })

    })

});



app.get('/nclub/:name',function(req,res){
    
    var name=req.params.name;
    var d=dateFormat("yyyy-mm-dd");
        
        console.log(d);

    db.event.find({club:name},function(err,docs){
        if(err)
        {
            console.log("err");

        }else
        {

            for (var i = 0; i < docs.length; i++) {
                if(docs[i].date>=d)
                {
                    res.send(docs[i]);
                }
            }           

        }


    })

});


app.get('/dclub/:date',function(req,res){
    
    var date=req.params.date;
      

    db.event.find({date:date},function(err,docs){
        if(err)
        {
            console.log("err");

        }else
        {
            res.send(docs);
        }


    })

});

app.get('/insertid',function(req,res){



    var person=req.query.identity;
    var id=req.query.id;
    var cname=req.query.cname;


   db.subscribed.find({$and:[{id:id,cname:cname}]},function(err,docs)
   {
    if (docs.length=="0")

    {
       db.subscribed.insert({person:person,id:id,cname:cname},function(err,docs2)
    {
        if(err)
        {
            console.log("err");
        }else
        {
            res.send("success");
        }

    })

    }
   })

   

});


app.get('/publish',function(err,docs){

        var d=dateFormat("yyyy-mm-dd");

   db.event.find({date:d},function(err,docs){
    for (var i = 0; i < docs.length; i++) {
        

        db.subscribed.find({person:"identity"},function(err,docs2){
            if(err)
        {
            console.log(err);
        }else
        { 
            var j;
            for(j=0;i<docs2.length;j++)

            {
         if(docs2[j].cname==docs[i].club)
         {
    //request("https:www.gupshup.io/developer/bot/botname/public?key=1325698540829049 & message="+ name +" is conducing in"+hall +"on"+date +"about"+des
    //request("https://www.gupshup.io/developer/bot/amritaevents/public?key=1260002900719641&message=am chastunav ra"

        request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+docs2[j].id+"&message="+ docs[i].club +" is conducing in "+docs[i].hall +" today about"+docs[i].descrip


                      , function(error, response, body) {
                        if(err)
                        {
                            console.log("err");
                        }
                        
                          console.log(response);
                        });

              }
               
            }
        }
        });
    }
   });

});






app.listen(port,function(){
    console.log("app is listening");

})


   //   fetch = +refs/heads/*:refs/remotes/heroku/*
    //fetch = +refs/heads/*:refs/remotes/origin/*






