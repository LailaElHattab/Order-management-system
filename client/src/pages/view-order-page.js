import { useEffect, useState } from "react";
import { useParams, NavLink } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './view-order.css';
import Table from '../components/table';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { BiPlusCircle, BiMinusCircle } from 'react-icons/bi';
import Card from 'react-bootstrap/Card';
import Pill2 from '../components/pill2.js';
import Button from 'react-bootstrap/Button';
export default function ViewOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState();

  useEffect(() => {
    axios.get(`orders/${orderId}`, {
      params: { skip: 0, limit: 100 }
    }).then(resp => setOrder(resp.data));
  }, [orderId])


  const updateOrder = async () => {

    const updatedOrderData = {
      ...order,

    };
    console.log(updatedOrderData);
    await axios.put(`orders/${orderId}`, { updatedOrderData }).then(resp => setOrder(resp.data));
  };
  const deleteProduct = (productId) => {
    let removedProducts;
    const updatedProducts = order.products.filter((product) => {
      if (product.id === productId) {

        removedProducts = product;
        return false;
      }
      return true;
    });
    let totalAmount = order.totalAmount - (removedProducts.unitPrice * removedProducts.quantity);
    const updatedOrderData = {
      ...order,
      products: updatedProducts,
      totalAmount: totalAmount
    };
    setOrder(updatedOrderData);
  }
  const quantityManager = (productId, increment) => {
    let totalAmount = order.totalAmount;
    const updatedProducts = order.products.map((product) => {
      let updatedProduct;
      if (product.id === productId) {
        if (increment == true) {
          updatedProduct = { ...product, quantity: product.quantity + 1 };
          totalAmount += product.unitPrice;
        }
        else {
          updatedProduct = { ...product, quantity: product.quantity - 1 };
          totalAmount -= product.unitPrice;
        }
        return updatedProduct;
      }
      return product;
    });


    const updatedOrderData = {
      ...order,
      products: updatedProducts,
      totalAmount: totalAmount
    };
    setOrder(updatedOrderData);
  }
  return (
    <div>

      {order &&
        <Card className="order-details">
          <div className="table">

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="order">Order<span className="orderNo" style={{ color: "#6596fd" }}>#{order.number}</span></h1>
              <Pill2 content={order.shippingStatus} />
            </div>

            <span className="date"> {moment(order.date).format('DD-MM-YYYY')}</span>
            <div>
              <Table
                columns={
                  [
                    {
                      header: 'Product',
                      render: (row) => (
                        <span>
                          {row.name}
                          <br />
                          <span className="productId">SKU: {row.id}</span>
                        </span>
                      ),
                    },
                    {
                      header: 'Category',
                      render: (row) => row.category,
                    },
                    {
                      header: 'Quantity',
                      render: (row) => (<span><BiMinusCircle className="quantity" onClick={() => quantityManager(row.id, false)} />  {row.quantity}  <BiPlusCircle className="quantity" onClick={() => quantityManager(row.id, true)} /></span>)
                    },
                    {
                      header: 'Unit Price',
                      render: (row) => "E£" + row.unitPrice + ".00"
                    },
                    {
                      header: 'Action',

                      render: (row) => (
                        <RiDeleteBin2Line className="delete" onClick={() => deleteProduct(row.id)} />
                      )
                    },
                  ]
                }
                rows={order?.products || []}></Table>
            </div>

            <div className="checkout">
              <div><span>Subtotal</span> <span>E£{order.totalAmount - order.shippingCost}.00</span></div>
              <div><span>Shipping</span> <span>E£{order.shippingCost}.00</span></div>
              <hr className="divider" />
              <div className="total"><span>Total</span> <span>E£{order.totalAmount}.00</span></div>
            </div>
          </div>

          <div className="button-container">
            <a href="/orders"><Button variant="outline-primary" style={{ marginRight: "5px" }} onClick={() => updateOrder()}>Save changes</Button></a>
            <a href="/orders"><Button variant="outline-danger" >Discard</Button></a>
          </div>
        </Card>
      }

    </div >
  );
}