let express=require('express')
let mongodb=require('mongodb')

app=express()
let db
let port=process.env.PORT
if(port==null || port=="")
{
port=3000
}
app.use(express.static('public'))
let connectionString='mongodb+srv://todolistuser:todolistuser28&@cluster0-pirnp.mongodb.net/Todo-list?retryWrites=true&w=majority'
mongodb.connect(connectionString,{useNewUrlParser: true},function(err,client){
db=client.db()
app.listen(port)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Password protected
function passwordProtected(req,res,next)
{
    res.set('WWW-Authenticate','Basic realm="Simple Todo App"')
 
    if(req.headers.authorization == "Basic dG9kbzpsaXN0")
    {
        next()
    }
        else
    {
        res.status(401).send("Authentication Required...")
    }

}

app.use(passwordProtected)
app.get('/',passwordProtected,function(req,res){
db.collection('list').find().toArray(function(err,items){
  
    res.send(`<!DOCTYPE html>
<html>
<head>
<style>
.ml11 {
    font-weight: 700;
    font-size: 3.5em;
  }
  
  .ml11 .text-wrapper {
    position: relative;
    display: inline-block;
    padding-top: 0.1em;
    padding-right: 0.05em;
    padding-bottom: 0.15em;
  }
  
  .ml11 .line {
    opacity: 0;
    position: absolute;
    left: 0;
    height: 100%;
    width: 3px;
    background-color: #fff;
    transform-origin: 0 50%;
  }
  
  .ml11 .line1 { 
    top: 0; 
    left: 0;
  }
  
  .ml11 .letter {
    display: inline-block;
    line-height: 1em;
  }
</style>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  

<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
  
    
    <h1 class="ml11" class="display-4 text-center py-1">
  <span class="text-wrapper">
    <span class="line line1"></span>
    
    <span class="letters">......To Do App .....</span>
  </span>
</h1>
    <div class="jumbotron p-3 shadow-sm">

      <form id="create-form" action="create" method="Post">
        <div  class="d-flex align-items-center">
          <input id="create-list" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">
    ${items.map(function(item){
       
   return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
   <span class="item-text">${item.text}</span>
   <div>
     <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
     <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
   </div>       
 </li>`
     }).join(" ")}
    </ul>
      </div>
      
      
      
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="/browser.js"></script>  
<script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>

</body>
</html>`)
})
})
app.post('/create',function(req,res){
    db.collection('list').insertOne({text: req.body.text},function(err,info){
        res.json(info.ops[0])
    })

})

app.post('/update',function(req,res){
db.collection('list').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)},{$set: {text: req.body.text}},function(){
    res.send("success")
})
})
app.post('/delete',function(req,res){
    db.collection('list').deleteOne({_id: new mongodb.ObjectID(req.body.id)},function(){
        res.send("Success")
    })
})