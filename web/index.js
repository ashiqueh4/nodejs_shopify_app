// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mongoose from 'mongoose';


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

//mongo connection
mongoose.connect('mongodb+srv://ashikker:6Ic6oNkmBj5K6PwS@cluster0.1x6lddi.mongodb.net/')
.then(() => console.log('Connected!'))
.catch((e) => console.log("error in connection"))
//end mongo connection

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);


// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

//app proxy code.
app.use("/storedata/*", validateAuthenticated);

async function validateAuthenticated(req,res,next){
  const shop= req.query.shop;
  let storename =await shopify.config.sessionStorage.findSessionsByShop(shop);

  if(shop === storename[0].shop){
  next();
  }else{
    res.send("user not find");
  }

}
//app proxy code.

app.use(express.json());


//app proxy code.

  //schema 
  const formdatac = new mongoose.Schema({
    rating:{ type: String,required:true },
    feedback: { type: String,required:true },
    name: { type: String, required:true },
    email: { type: String, unique:true,required:true },
    shop_name:{ type: String,unique:false,required:true},
    date: { type: Date, default: Date.now }
  });
  const MyModel = mongoose.model('storereview', formdatac);

  app.post("/storedata/review", async (req, res) => {
    let formda= req.body;
    const shop= req.query.shop;
    console.log(shop)
    try {
      
      let datastore = await MyModel.create({
        rating:formda[0],
        feedback:formda[1],
        name:formda[2],
        email:formda[3],
        shop_name:shop
      })
      res.status(200).json("store review created");

    } catch (error) {
      console.log(error)
      if(error.code === 11000 ){
        
        return res.json("user exit")
      }else{
        console.log(error.message)
      }
      
    }

  });  
  app.get("/storedata/review", async (req, res) => {
    const shop= req.query.shop;
     try {

      let storeview= await MyModel.find({shop_name:shop});
      res.status(200).send(storeview)
      
     } catch (error) {
      console.log(error)
      
     }
  }); 
  app.get("/api/getreviews", async (req, res) => {

    let store_ds= res.locals.shopify.session;
    let shop_name=store_ds.shop;
     try {

      let storeviews= await MyModel.find({shop_name});

      res.status(200).send(storeviews)
      
     } catch (error) {
      console.log(error)
      
     }
  }); 
  app.get("/api/getreview", async (req, res) => {

    let store_dss= res.locals.shopify.session;
    let shop_names=store_dss.shop;
    let rev_id=req.query.id;
    // console.log(rev_id+"ddf")

     try {

      let storeviews= await MyModel.find({shop_name:shop_names,_id:rev_id});

      res.status(200).send(storeviews)
      
     } catch (error) {
      console.log(error)
      
     }
  }); 
  app.delete("/api/reviewdelete/:id", async (req, res) => {
    let rev_idd=req.params.id;
    console.log(rev_idd+"ddfdw")

     try {

      await MyModel.deleteOne({_id:rev_idd});

      res.status(200).json({
        message: 'Deleted!'
      });
      
     } catch (error) {
      console.log(error)
      
     }
  }); 
  // end forntend

app.get("/api/shop", async (_req, res) => {
  const shopinfo = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,

  });
  res.status(200).send(shopinfo);
});

app.get("/api/orders/all", async (_req, res) => {
  const ordersall = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: "any",
  });
  res.status(200).send(ordersall);
});

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
