const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let stock = null;

suite('Functional Tests', function() {
    test("Viewing one stock", done => {
    chai.request(server)
        .get('/api/stock-prices?stock=GOOG')
        .end((err, res) => {
            assert.containsAllDeepKeys(res.body, {stockData:{stock:"", price:0, likes:0}});
            assert.typeOf(res.body.stockData.stock, "string");
            assert.typeOf(res.body.stockData.price, "number");
            assert.typeOf(res.body.stockData.likes, "number");
            stock = res.body.stockData;
            done();
        });
    });

    test("Viewing one stock and liking it", done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
            assert.increasesBy(() => stock.likes = res.body.stockData.likes, stock, 'likes', 1);
            done();
        });
    });

    test("Viewing the same stock and liking it again", done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
            assert.doesNotIncrease(() => stock.likes = res.body.stockData.likes, stock, 'likes');
            done();
        });
    });

    test("Viewing two stocks", done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT')
        .end((err, res) => {
            assert.containsAllDeepKeys(res.body, {stockData:[
                {stock:"", price:0, likes:0},
                {stock:"", price:0, likes:0}
            ]});
            assert.lengthOf(res.body.stockData, 2);
            done();
        });
    });

    test("Viewing two stocks and liking them", done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
        .end((err, res) => {
            assert.equal(res.body.stockData[0].likes, res.body.stockData[1].likes);
            done();
        });
    });
});
