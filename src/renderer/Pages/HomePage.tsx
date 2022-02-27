import { IconButton, Snackbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, Redirect, useLocation } from 'react-router-dom';
import BarcodeReader from '../components/BarcodeReader';
import QrService from '../Services/QrService';

const qrServices = new QrService();

const HomePage = ({ orderID }) => {
  const history = useHistory();
  const [alreadyDeliverdError, setAlreadyDeliverdError] = useState(false);
  const [invalidTokenError, setInvalidTokenError] = useState(false);
  const [showCompletedToast, setShowCompletedToast] = useState(false);
  const [showScannerError, setShowScannnerError] = useState(false);


  useEffect(() => {
    localStorage.removeItem('products');
    if (orderID) {
      setShowCompletedToast(true);
    }
    return () => {};
  }, []);

  const getProductsAndDisplay = async (qrCode) => {
    console.log(qrCode)
    const result = await qrServices.getProductFromQr(qrCode);
    if (result.order.length == 0) {
      setInvalidTokenError(true);
    } else if (result.order[0].status !== 'delivered') {
      localStorage.setItem('products', JSON.stringify(result.order[0]));
      history.replace(`/listProducts/${qrCode}`);
    } else {
      setAlreadyDeliverdError(true);
    }
  };

  const handleError = async (data: string) => {
       handleScan(data)
  };

  const handleScan = async (data) => {
    if (!localStorage.getItem('products')) {
      getProductsAndDisplay(data);
    }
  };

  return (
    <div className="homepage-main">
      <BarcodeReader onError={handleError} onScan={handleScan} />
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        open={alreadyDeliverdError}
        autoHideDuration={5000}
        message="Already Deliverd"
        onClose={() => {
          setAlreadyDeliverdError(false);
        }}
      ></Snackbar>
         <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        open={showScannerError}
        autoHideDuration={5000}
        message="Scanner Error"
        onClose={() => {
          setShowScannnerError(false);
        }}
      ></Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        open={invalidTokenError}
        autoHideDuration={5000}
        message="Invalid Token"
        onClose={() => {
          setInvalidTokenError(false);
        }}
      ></Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        open={showCompletedToast}
        autoHideDuration={5000}
        message={`OrderID ${orderID} Delivered`}
        onClose={() => {
          setShowCompletedToast(false);
        }}
      ></Snackbar>
      <video
        src="http://mart.rajalakshmimart.com/getProductVideos/qrcode.mp4"
        autoPlay
        loop
      />
    </div>
  );
};

export default HomePage;
