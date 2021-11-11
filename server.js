const x=require('express'); const y=x(); y.use(x.json()); y.use(x.static('build'));

const z=require('mongoose'); const bcryptjs=require('bcryptjs'); const dotenv=require('dotenv'); dotenv.config({path:'./config.env'});

const port=process.env.PORT ||4000;

z.connect(process.env.MONGODB_URI,{useNewUrlParser:true}).then(d=>console.log("database connected")).catch(d=>console.log("database not connected"));

const schema=new z.Schema({name:{type:String, required:true},password:{type:String, required:true},email:{type:String, required:true},posts:[{type:String}]},{collection:"practice"});
schema.pre('save',async function(ai){ if(this.isModified('password')){this.password=await bcryptjs.hash(this.password,13);}ai();});
const col=z.model('rev',schema);

y.post('/register',async (a,b)=>{const g=await col.findOne({email:a.body.email}); if(!a.body.email || !a.body.password || !a.body.name){b.json({ok:false,message:"fill all the fields before submitting"});}else if(g){b.json({ok:false,message:'email already registered. login'});}else{ const doc=new col({email:a.body.email,name:a.body.name,password:a.body.password}); await doc.save(); b.json({ok:true});}});


const globals={email:"",stuff:[],name:""};

y.post('/login',async (a,b)=>{const g=await col.findOne({email:a.body.email}); console.log(g); if(g){const fee=await bcryptjs.compare(a.body.password,g.password); if(fee){globals.email=g.email; globals.name=g.name;globals.stuff=g.posts; /*console.log(g.email,g.name,g.posts);*/b.json({ok:true,name:g.name});}else{b.json({ok:false});}}else{b.json({ok:false})}});

y.get('/home',(a,b)=>b.json({name:globals.name,email:globals.email,posts:globals.stuff}));

y.post('/home',async (a,b)=>{const doc=await col.findOne({email:globals.email}); doc.posts.push(a.body.thispost); globals.stuff=doc.posts; await doc.save(); b.json({message:`saved \n ${a.body.thispost}`});});




y.listen(port,()=>console.log(`port ${port} connected`));