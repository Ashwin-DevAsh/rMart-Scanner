import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
// import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import {includes,remove, pull} from 'lodash'
import ProductService from 'renderer/Services/ProductService';
import { Switch } from '@material-ui/core';



const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    background:'#299BED'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SelectProduct({open,onClose}) {
  const productService = new ProductService()
  const classes = useStyles();

  const handleClose = () => {
    onClose(false);
  };

  const getAvailableProducts = ()=>{
    const {AvailableProducts} = JSON.parse(localStorage.getItem("settings"))
    return AvailableProducts
  }

  const [allProducts, setAllProducts] = useState([])

  const loadProducts =async () => {
    const products = await productService.getAllProducts()
    setAllProducts(products)
  }

  useEffect(()=>{
    loadProducts()
  },[open])

  const handleToggle = (id,value)=>{
    const {AvailableProducts} = JSON.parse(localStorage.getItem("settings"))
    if(value){
      AvailableProducts.push(id)
    }else{
      pull(AvailableProducts,id)
    }

    localStorage.setItem("settings",JSON.stringify({AvailableProducts}))

    return AvailableProducts
  }

  return (
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Select Products
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {
             allProducts.map((item,index)=>{
               return(<div>
                  <ListItem key={index} button >
                   <ListItemText primary={item.productname} secondary={item.category}/>
                   <Switch
                    defaultChecked={ includes(getAvailableProducts(),  item.productid )}
                    onChange={(e)=>{handleToggle(item.productid,e.target.checked)}}
                    color='secondary' />
                  </ListItem>
                  <Divider />
               </div>)
             })
          }
        </List>
      </Dialog>
  );
}
