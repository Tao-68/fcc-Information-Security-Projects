'use strict';
const StockModel = require("../models").Stock;
const fetch = require("node-fetch"); // To extract infromation from the API

async function createStock(stock, likes, ip){
  const newStock = new StockModel({
    symbol: stock,
    likes: like ? [ip] : [],
  });
  const savedNew = await newStock.save();
  return savedNew; 
}

async function findStock(stock){
  return await StockModel.findOne({symbol: stock}).exec();
}

async function saveStock(stock, like, ip){
  let saved = {}
  const foundStock = findStock(stock);
  if(!foundStock){
    const createStock = await createStock(stock, like, ip);
    saved = createsaved;
    return saved;    
  } else {
    if(like && foundStock.likes.indexOf(ip) === -1){ // Determine if the IP exist or is a different IP, then the IP is pushed
      foundStock.liked.push(ip);
    }
    saved = await foundStock.save();
    return saved;
  }
}

async function getStock(stock){
  const response = await fetch(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`
  );
  const {symbol, latestPrice} = await response.json();
  return{symbol, latestPrice};
}

module.exports = function (app) {

  app.route("/api/stock-prices").get(async function (req, res){
      const {stock, like} = req.query;
      const {symbol, latestPrice} = await getStock(stock);
      if (!symbol){
        res.json({stockData: {likes: like ? 1 : 0}});
        return;
      }

      const oneStockData = await saveStock(symbol, like, req.ip);
      console.log("One Stock Data", oneStockData);

      res.json({
        stockData: {
          stock: symbol,
          price: latestPrice,
          likes: oneStockData.likes.length,
        },
      });
  });     
 };
