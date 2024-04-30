'use strict';

const stocks = {
  GOOG:{ips:[], likes:0, price:786.90},
  MSFT:{ips:[], likes:0, price:62.30}
};

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(function (req, res) {
      const stock = req.query.stock;
      const liked = req.query.like;
      if (stock instanceof Array) {
        if (liked) {
          stock.forEach((s) => {
            if (!stocks[s].ips.includes(req.ip)) {
              stocks[s].likes++;
              stocks[s].ips.push(req.ip);
            }
          });
        }
        res.json({
          stockData:[
            {
              stock:stock[0],
              price:stocks[stock[0]].price,
              rel_likes:stocks[stock[0]].likes - stocks[stock[1]].likes
            },
            {
              stock:stock[1],
              price:stocks[stock[1]].price,
              rel_likes:stocks[stock[1]].likes - stocks[stock[0]].likes
            }
          ]
        });
      } else {
        if (liked) {
          if (!stocks[stock].ips.includes(req.ip)) {
            stocks[stock].likes++;
            stocks[stock].ips.push(req.ip);
          }
        }
        res.json({
          stockData:{
            stock:stock,
            price:stocks[stock].price,
            likes:stocks[stock].likes
          }
        });
      }
    });
};
