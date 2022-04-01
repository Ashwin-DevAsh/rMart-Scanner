import { Snackbar } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import QrService from '../Services/QrService';


const qrServices = new QrService();

const ListProducts = ({ orders,selectedOrder,changeOrder,cancelOrder,makeDeliver }) => {
  const [ordersIDs,setOrdersIDs] = useState([])
  const [processError, setProcessError,deliver] = useState(false);

  const handleKeyDown = async (event) => {
    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 32: {
        makeDeliver()
        break;
      }
      case 38: {
        changeOrder(38)
        break
      }
      case 40: {
        changeOrder(40)
        break
      }
      case 27: {
        cancelOrder()
        break;
      }
    }
  };

  useEffect(()=>{
    document.addEventListener('keydown', handleKeyDown)
    return ()=>{
      document.removeEventListener('keydown', handleKeyDown)
    }
  },[
  ])

  return (
    <div className="listproduct-main" >


        {
         orders.map((products,index)=>{
           return <table key={index} className={index==selectedOrder && 'selected'}>
           <tr>
             <th>ID</th>
             <th>Name</th>
             <th>Count</th>
             <th>Price</th>
             <th>Total price</th>
             <th>Category</th>
           </tr>
                {
                  products.products.map((item, index) => {
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
                  })
                }
           </table>
          })
          }

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
