
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
    var h=0;
    var g=0;

        var d=dateFormat("yyyy-mm-dd");

   db.event.find({date:d},function(err,docs){

    for (var i=0; i<docs.length; i++) {
      var store=docs[i].club;
       var club=docs[i].club;
       var hall=docs[i].hall;
        var des=docs[i].descrip;

        var n1=docs.length;
        
        g=g+1;
        

        db.subscribed.find({person:"identity"},function(err,docs2){
            if(err)
        {
            console.log(err);
        }else
        { 
            var j;


        var n2=docs2.length;
        
       

            for(j=0;j<docs2.length;j++)
{


             h=h+1;
         if(docs2[j].cname==store)
         {
var id=docs2[j].id;

        request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+id+"&message="+ club +" is conducing in "+hall +" today about"+des



                      , function(error, response, body) {
                        if(error)
                        {
                            console.log("err");
                        }
                        else{
                        
                        if(g==n1&&h==n2)
                        {

                          res.sendFile(__dirname +'/public/success2.html');
                      }
                }
                        });

              }
               
            }
     }
        });
    }
   });

})







app.listen(port,function(){
    console.log("app is listening");

});







