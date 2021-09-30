import { Snackbar } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import QrService from '../Services/QrService';

const qrServices = new QrService();

const ListProducts = ({ qrCode }) => {
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState(null);
  const [processError, setProcessError] = useState(false);

  const handleKeyDown = async (event: KeyboardEvent) => {
    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 32: {
        let result = await qrServices.makeDelivery(qrCode);
        if (result.message === 'success') {
          history.replace(`/${products.orederid}`);
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
    setProducts(JSON.parse(localStorage.getItem('products')!));
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
        {products !== null &&
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
          })}
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
