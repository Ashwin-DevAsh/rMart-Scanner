import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import SelectProduct from './SelectProducts'

const Home = ()=>{
  const [openDialog,setOpenDialog] = useState(false)
  return (
         <div className="home">
            <header>
            <Button onClick={ ()=>{setOpenDialog(true)} } className='rMart-Button' variant='outlined'>
              Deliverable Products
            </Button>
            </header>
            <SelectProduct open={openDialog} onClose={setOpenDialog}/>
            <video
            src="http://mart.rajalakshmimart.com/getProductVideos/qrcode.mp4"
            autoPlay
            loop
          />
    </div>
  )
}

export default Home
