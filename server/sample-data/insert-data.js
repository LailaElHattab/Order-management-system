require('dotenv').config();
const mongoose = require('mongoose');
const dateFns = require('date-fns');
const orderId = require('order-id')('key');
const { hashPassword } = require('../api/helpers/encrypt');
const UserModel = require('../api/model/user-model');
const ProductModel = require('../api/model/product-model');
const OrderModel = require('../api/model/order-model');

const date = dateFns.parseISO('2023-01-01T00:00:00.000Z');
const username = "laila.elhattab01@gmail.com".toLocaleLowerCase();

mongoose.connect(process.env.MONGODB_URL);
mongoose.connection.once('connected', async () => {

    //add user
    await UserModel.deleteMany({});
    await UserModel.create({
        firstName: 'Laila',
        lastName: 'Elhattab',
        fullName: 'Laila Elhattab',
        username,
        password: await hashPassword('testMe'),
    });

    //add products
    const productsSample = require('./products.json');
    const products = productsSample.products.map(p => {
        return {
            _id: new mongoose.Types.ObjectId(),
            name: p.title,
            price: p.price,
            category: p.category,
            createdAt: date,
            createdBy: username,
            lastUpdatedAt: date,
            lastUpdatedBy: username,
        };
    });
    await ProductModel.deleteMany({});
    await ProductModel.insertMany(products);

    //add orders
    const days = dateFns.differenceInDays(new Date(), date);
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    const customers = ['Mayert and Wolf', 'Rodriguez', 'Sipes', 'Lesch and Daughters', 'Green-Haag', 'Rath Group', 'Monahan and Sons', 'Nader-Leuschke', 'Witting-Mraz', 'Toy Inc'];
    let orderDate = date;
    await OrderModel.deleteMany({});
    for (let i = 0; i < days; i++) {
        for (let j = 0; j < 3; j++) { // 3 orders per day
            const items = [];
            let itemsSubTotal = 0;
            for (let x = 0; x < randomInt(1, 5); x++) {
                const product = products[randomInt(0, products.length - 1)];
                const quantity = randomInt(1, 5);
                items.push({
                    id: product._id.toString(),
                    unitPrice: product.price,
                    quantity,
                })
                itemsSubTotal += product.price * quantity;
            }
            const shippingCost = randomInt(0, 150);
            let shippingStatus = randomInt(1, 2);
            shippingStatus = shippingStatus === 1 ? "In Progress" : "Delivered";
            await OrderModel.create({
                number: orderId.generate(),
                date: orderDate,
                customerName: customers[randomInt(0, customers.length - 1)],
                products: items,
                itemsSubTotal,
                shippingStatus,
                shippingCost,
                taxCost: 0,
                totalAmount: itemsSubTotal + shippingCost,
                createdAt: orderDate,
                createdBy: username,
                lastUpdatedAt: orderDate,
                lastUpdatedBy: username,
            });
            await sleep(10);
        }
        orderDate = dateFns.addDays(orderDate, 1);
    }
    console.log('Inserted:', { user: 1, products: products.length, orders: 3 * days })
    console.log('done!');
    process.exit(0)

});





