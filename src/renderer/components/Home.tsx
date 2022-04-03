import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import SelectDeliverableProduct from './SelectDeliverableProducts'
import SelectAvailableProducts from './SelectAvailableProducts'


const Home = ()=>{
  const [openDeliverableDialog,setOpendDeliverableDialog] = useState(false)
  const [openAvailableDialog,setOpendAvailableDialog] = useState(false)

  return (
         <div className="home">
            <header>
            <Button onClick={ ()=>{setOpendAvailableDialog(true)} } className='rMart-Button' variant='outlined'>
              Available Products
            </Button>
            <div style={{marginLeft:20}} ></div>
            <Button onClick={ ()=>{setOpendDeliverableDialog(true)} } className='rMart-Button' variant='outlined'>
              Deliverable Products
            </Button>
            </header>
            <SelectDeliverableProduct open={openDeliverableDialog} onClose={setOpendDeliverableDialog}/>
            <SelectAvailableProducts open={openAvailableDialog} onClose={setOpendAvailableDialog}/>

            <video
            src="http://mart.rajalakshmimart.com/getProductVideos/qrcode.mp4"
            autoPlay
            loop
          />
    </div>
  )
}

export default Home
