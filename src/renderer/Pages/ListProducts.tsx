import { Snackbar } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import QrService from '../Services/QrService';
import {AvailableProducts} from '../../../../settings.json'

const qrServices = new QrService();

const ListProducts = ({ qrCode }) => {
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersIDs,setOrdersIDs] = useState([])
  const [processError, setProcessError] = useState(false);

  const getFilterOrderIDS=()=>{
    return JSON.parse(localStorage.getItem('currentProducts'))
  }

  const handleKeyDown = async (event: KeyboardEvent) => {
    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 32: {
        const result = await qrServices.makeDelivery(qrCode, getFilterOrderIDS());
        if (result.message === 'success') {
          history.replace('/');
          localStorage.removeItem('products');
        } else {
          setProcessError(true);
        }

        break;
      }
      case 27: {
        history.replace('/');
        localStorage.removeItem('products');
        break;
      }
    }
  };

  // const getProducts = async () => {
  //   const result = await qrServices.getProductFromQr(qrCode);
  //   setProducts(result.order[0]);
  //   setIsLoaded(true);
  // };

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('products')!)
    const filteredOrders = []
    const filterOrderIDs = []

    orders.products.forEach((item)=>{
      console.log(item)
        if(AvailableProducts.indexOf(item.product.productID) > -1 && !item.product.isDelivered){
          filteredOrders.push(item)
          filterOrderIDs.push(item.product.productID)
        }
    })
    orders.products = filteredOrders
    setOrders([orders]);
    localStorage.setItem("currentProducts",JSON.stringify(filterOrderIDs))
    setOrdersIDs(filterOrderIDs);

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="listproduct-main">
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Count</th>
          <th>Price</th>
          <th>Total price</th>
          <th>Category</th>
        </tr>

        {
         orders.map((products,index)=>{
            return products.products.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{products.orederid}</td>
                  <td>{item.product.productName}</td>
                  <td>{item.count}</td>
                  <td>Rs {item.product.price}</td>
                  <td>Rs {item.totalPrice} </td>
                  <td>{item.product.category}</td>
                </tr>
              );
            });
          })
          }
      </table>
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        open={processError}
        autoHideDuration={5000}
        message="Unable To Process! Kindly Retry"
        onClose={() => {
          setProcessError(false);
        }}
      ></Snackbar>
      <p style={{ opacity: 0.5 }}>
        <br />
        Press <strong>Spacebar</strong> to complete delivery,{' '}
        <strong>Esc</strong> for cancel{' '}
      </p>
    </div>
  );
};

export default ListProducts;
