import {  Snackbar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ListProducts from 'renderer/components/ListProducts';
import BarcodeReader from '../components/BarcodeReader';
import QrService from '../Services/QrService';
import {remove} from 'lodash'
const qrServices = new QrService();


export const HomePage = ()=>{

  const [orders,setOrders] = useState([])
  const [showMessage,setShowMessage] = useState(null)
  const [selectedOrder,setSelectedOrder] = useState(0)


  useEffect(()=>{

    resetSelect()
    resetTotal(orders)

  },[])

  const getSelectedOrder = ()=>{
    return parseInt(localStorage.getItem("selectedOrder")) || 0
  }

  const addSelectedOrder = ()=>{
    const selectedOrder = parseInt(localStorage.getItem("selectedOrder")) || 0
    console.log(selectedOrder)
    const totalOrder = parseInt(localStorage.getItem("totalOrder")) || 1
    const nextValue = (selectedOrder+1)%totalOrder
    localStorage.setItem("selectedOrder",nextValue)
    return nextValue
  }

  const subSelectedOrder = ()=>{
    const selectedOrder =  parseInt(localStorage.getItem("selectedOrder")) || 0
    console.log(selectedOrder)
    const totalOrder = parseInt(localStorage.getItem("totalOrder")) || 1
    let nextValue = (selectedOrder-1)%totalOrder
    if(nextValue<0){
      nextValue = totalOrder-1
    }
    localStorage.setItem("selectedOrder",nextValue)
    return nextValue
  }

  const addTotalOrder = ()=>{
    const totalOrder = parseInt(localStorage.getItem("totalOrder")) || 0
    console.log(totalOrder)
    localStorage.setItem("totalOrder",totalOrder+1)
  }

  const resetTotal = (list)=>{
    localStorage.setItem("totalOrder",list? list.length:orders.length)

  }

  const resetSelect = ()=>{
    localStorage.setItem("selectedOrder",0)

  }

  const subTotalOrder = ()=>{
    const totalOrder = parseInt(localStorage.getItem("totalOrder")) || 0
    console.log(totalOrder)
    localStorage.setItem("totalOrder",totalOrder-1)
  }

  const filterProducts = (orders)=>{
      const filteredOrders = []
      const filterOrderIDs = []
      const {AvailableProducts} = JSON.parse(localStorage.getItem("settings"))

      console.log("Available products ",AvailableProducts)

      orders.products.forEach((item)=>{
        console.log(item)
          if(AvailableProducts.indexOf(item.product.productID) > -1 && !item.product.isDelivered){
            filteredOrders.push(item)
            filterOrderIDs.push(item.product.productID)
          }
      })

      // orders.products = filteredOrders
      return {...orders,filterOrderIDs}
  }

  const isOrderExist =  (qrCode)=> {
      for(let i in orders){
        const item = orders[i]
        if(item.qrCode===qrCode){
          console.log("yup")
          return true
        }
      }
      return false
  }

  const getProductsAndDisplay = async (qrCode) => {
    console.log(qrCode);
    const result = await qrServices.getProductFromQr(qrCode);
    if (result.order.length === 0) {
      setShowMessage("Invalid Token");
    } else if (result.order[0].status !== 'delivered') {

      const order = filterProducts(result.order[0]);
      if(order.products.length!=0){
        addTotalOrder()
        setOrders([...orders,{...order,qrCode}])
      }else{
        setShowMessage("Products Not Available in this counter")
      }

    } else {
      setShowMessage("Already Deliverd");
    }
  };

  const handleScan = async (data) => {
    if (!localStorage.getItem('products')) {
      if(isOrderExist(data)){
        setShowMessage("Order Already in queue")
      }else if(orders.length>=5){
           setShowMessage("Maximum delivery count reached")
      }else{
        getProductsAndDisplay(data);
      }

    }
  };

  const deliver = async ()=>{
    const order = orders[getSelectedOrder()]
    const result = await qrServices.makeDelivery(order.qrCode,order.filterOrderIDs);
    if (result.message === 'success') {
       remove(orders, orders[getSelectedOrder()])
       setOrders([...orders])
       resetTotal([...orders])
       resetSelect()
       setShowMessage(`Order ${order.orederid} successfully delivered`);
    } else {
      setShowMessage("Unable to deliver this product");
    }
  }

  const cancelOrder = async ()=>{
    remove(orders, orders[getSelectedOrder()])
    setOrders([...orders])
    resetTotal([...orders])
    resetSelect()

  }

  const handleError = async (data) => {
    data = '90fc741f-3a04-4efd-875b-88f210596dcb'
    console.log("data = ",data)
    // if(isOrderExist("data")){
    //   setShowMessage("Order Already in queue")
    // }else
    if(orders.length>=5){
      setShowMessage("Maximum delivery count reached")
    }else{
      getProductsAndDisplay(data);
    }
  };

  const changeOrder=(key)=>{
    switch(key){
      case 38: {
        setSelectedOrder(subSelectedOrder())
        break;
      }
      case 40: {
        setSelectedOrder(addSelectedOrder())
        break;

      }
    }
}

  const handleKeyDown = async (event) => {
    // eslint-disable-next-line default-case
    switch (event.keyCode) {
      case 32: {
        deliver()
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

  return (<div className="homepage-main">
      <BarcodeReader onError={handleError} onScan={handleScan} onKeyDetect={handleKeyDown} />
      <Snackbar
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        open={showMessage!=null}
        autoHideDuration={5000}
        message= {showMessage}//"Products Not Available in this counter"
        onClose={() => {
          setShowMessage(null);
        }}
      ></Snackbar>

      {

      orders.length==0 && (<video
          src="http://mart.rajalakshmimart.com/getProductVideos/qrcode.mp4"
          autoPlay
          loop
        />)
      }
      {
        orders.length !=0 && (
           <ListProducts
              orders={orders}
              selectedOrder={selectedOrder}
              cancelOrder={cancelOrder}
              makeDeliver = {deliver}
              changeOrder={changeOrder}
              />
        )
      }
    </div>)
}
