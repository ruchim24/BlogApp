var express= require("express"),
	app= express(),
	mongoose=require("mongoose"),
	bodyParser=require("body-parser"),
    method=require("method-override"),
    sanitizer=require("express-sanitizer");
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(sanitizer());
app.set("view engine" , "ejs");
app.use(method("_method"));

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});



var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"nature",
// 	image:"https://images.unsplash.com/photo-1571217668979-f46db8864f75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body:"splandid view!!!!"
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("error!!");
		}else{
			res.render("index",{blogs:blogs});
		}
	});
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
		res.render("new");
	}else{
		res.redirect("/blogs");
	}
	});
	
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
	if(err){
		res.render("/blogs");
	}else{
		res.render("show",{blog:foundBlog});
	}
});
});

app.get("/blogs/:id/edit",function(req,res){
Blog.findById(req.params.id,function(err,foundBlog){
	if(err){
		res.render("/blogs");
	}else{
		res.render("edit",{blog:foundBlog});
	}
});
});

app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" +req.params.id);
		}
	});
});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
		res.redirect("/blogs")	;
		}
	});
});

app.listen(3000,function(){
	console.log("server started");
});