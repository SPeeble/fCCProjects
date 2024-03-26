'use strict';
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  stock: {type: String, required: true},
  likes: {type: Number, default: 0}
})

const userSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  userGroup: {type: String, required: true},
  likes: {type: Array}
})

const Stock = mongoose.model('Stock', stockSchema);
const User = mongoose.model('User', userSchema);

const saltRounds = 12;

module.exports = function (app) {

  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

  app.route('/api/stock-prices')
    .get( async function (req, res){
      try {
        //Definitions and guard statements
        let stocks = req.query.stock;
        const like = req.query.like || false;
        if (!stocks) { return res.json({error: 'No stock provided'}) };
        if (Array.isArray(stocks) && stocks.length > 2) { return res.json({error: 'Too many stocks'}) };
        if (!Array.isArray(stocks)) { stocks = [stocks] };
        const ip = (req.headers['x-forwarded-for'] + "").split(",")[0]
        let usergroup = ip[1] + ip[4] + ip[7] + ip[10] + ip[13]
        const stockDataArray = []

        // Create or fetch User Data
        let usersData =  await User.find({userGroup: usergroup});
        let user
        if (usersData.length == 0) {
          const userId = bcrypt.hashSync(ip, saltRounds)
          const userData = new User({userId: userId, userGroup: usergroup, likes: []});
          await userData.save();
          user = userData;
        } else {
          for (let j = 0; j < usersData.length; j++) {
            const document = usersData[j];
            if (bcrypt.compareSync(ip, document.userId)) {
              user = document;
              break;
            }
          }
        }

        //Cycle through stocks and like/update if needed
        for (let i = 0; i < stocks.length; i++) {
          const stock = stocks[i].toUpperCase();
          let stockData = await Stock.findOne({stock: stock});
          if (!stockData) {
            stockData = new Stock({stock: stock, likes: like ? 1 : 0});
            await stockData.save();
            if (like) {
              user.likes.push(stock);
              await user.save();
            }
          }
          if (stockData && like === "true" && !user.likes.includes(stock)) {
            user.likes.push(stock);
            await user.save();
            stockData.likes++;
            await stockData.save();
          }
          stockDataArray.push(stockData)
        }

        //get price data
        for (let i = 0; i < stockDataArray.length; i++) {
          const stock = stockDataArray[i]["stock"].toLowerCase();
          await fetch(
            `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
            .then(data => data.json())
            .then((fetchedData) => {
              const {latestPrice} = fetchedData
              stockDataArray[i]["price"] = latestPrice
            })
        }

        //trim stock objects
        let stockData = stockDataArray.map(stockEntry => {
          const {stock, price, likes} = stockEntry;
          return {stock, price, likes}
        })

        //send single stock data
        if (stockDataArray.length == 1) { return res.json({stockData: stockData[0]}) }

        //send multiple stock data
        const relativeLikeForward = stockDataArray[0].likes - stockDataArray[1].likes
        const relativeLikeBackward = stockDataArray[1].likes - stockDataArray[0].likes
        for (let i = 0; i < stockData.length; i++) {
          const {stock, likes} = stockData[i];
          stockData[i] = {stock: stock, price: stockData[i].price, rel_likes: i == 0 ? relativeLikeForward : relativeLikeBackward}
        }
        
        return res.json({stockData: stockData})
        
      } catch (err) {
        console.log(err)
      }
    });
    
};
