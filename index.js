
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
    var time=req.query.time;
    var event=req.query.event;

    var des=req.query.des;
     var cid;
    if(name=="face")
    {
        cid=1;
    }else if(name=="ecif"){
        cid=2;
    }else if(name=="vidyuth"){
        cid=3;
    }else if(name=="lekhani"){
        cid=4;
    }else{
       cid=5;
    }


    db.event.insert({cid:cid,club:name,hall:hall,date:date,time:time,event:event,descrip:des},function(err,docs)
    {
        if(err)
        {
            console.log(err);
        }else
        {
            res.sendFile(__dirname +'/public/success.html');
        }

        db.subscribed.find({cid:cid},function(err,docs2){
            if(err)
        {
            console.log(err);
        }else
        { 
            var i;
            for(i=0;i<docs2.length;i++)
            {

             console.log(docs2[i].id);
        request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+docs2[i].id+"&message="+ name +" is conducting  an event on name"+ event +  ',in '+hall +" on "+date + " at " +time +" about "+des


                      , function(error, response, body) {
                        if(err)
                        {
                            console.log("err");
                        }
                        
                          console.log(response);
                        });

                             
            }
        }


        })

    })

});

app.get('/nclub/:cid',function(req,res){
    
    var cid1=req.params.cid;
    var d=dateFormat("yyyy-mm-dd");

        var ob=parseInt(cid1);

    db.event.find({$and:[{cid:ob,date: { $gt:d} }]},function(err,docs){

        if(err)
        {
            console.log("err");

        }else
        {
          
                    res.send(docs);
                
        }


    })

});

app.get('/dclub',function(req,res){
    
   
         var d=dateFormat("yyyy-mm-dd");


    db.event.find({date:d},function(err,docs){
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



    var id=req.query.id;
    var cid=req.query.cid;


   db.subscribed.find({$and:[{id:id,cid:cid}]},function(err,docs)
   {
    if (docs.length=="0")

    {
       db.subscribed.insert({id:id,cid:cid},function(err,docs2)
    {
        if(err)
        {
            console.log("err");
        }else
        {
            res.send("success");
        }

    })

    }else
    {
        res.send("unsuccess");
    }
   })

   

});


app.get('/deleteid',function(req,res){



    var person=req.query.identity;
    var id=req.query.id;
    


   db.subscribed.find({id:id},function(err,docs)
   {
    if (docs.length=="0")

    {
                res.send("unsuccess");

     
    }else
    {
          db.subscribed.remove({id:id},function(err,docs2)
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

   });

   

});


app.get('/publish',function(req,res){
    

        var d=dateFormat("yyyy-mm-dd");

   db.event.find({date:d},function(err,docs){

var n1=docs.length;
    for (var i=0; i<n1; i++) {
    var store=docs[i].cid;
 var ob=parseInt(store);

     var name=docs[i].club;
     var event=docs[i].event;
     var date=docs[i].date;
     var time=docs[i].time;
     var hall=docs[i].hall;
     var des=docs[i].descrip;
        

        db.subscribed.find({cid:ob},function(err,docs2){
            if(err)
        {
            console.log(err);
        }else
        { 
            var j;


        var n2=docs2.length;
        
       

            for(j=0;j<n2;j++)
{


            
      
var id=docs2[j].id;

        request("https://www.gupshup.io/developer/bot/amritaevents/public?key="+id+"&message="+ name +" is conducting  an event on name"+ event +',in '+ hall +" on "+date + " at " +time +" about "+des


                      , function(error) {
                        if(error)
                        {
                            console.log("err");
                        }
                   
                        });

              
               
            }
     }
        });
    }
        res.sendFile(__dirname +'/public/success2.html');
   });
    

})


app.listen(port,function(){
    console.log("app is listening");

});







