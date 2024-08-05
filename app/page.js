'use client'

import Image from "next/image";
import { firestore } from "@/firebase";
import { useEffect, useState } from "react";
import {Box, Stack, Typography, Button, Modal, TextField, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, InputAdornment} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import {getDocs, doc, query, collection, setDoc, deleteDoc, getDoc, get} from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3, 
}






export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const filteredInventory = inventory.filter( item => item.name.toLowerCase().includes(searchQuery))


  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'pantry',"default_pantry", 'pantryItems'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])


  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry',"default_pantry", 'pantryItems'), item)
    
    const caloreData = await fetch('https://api.calorieninjas.com/v1/nutrition?query=' + item,{
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_CALORIE_API_KEY
      },
      method: 'GET',
    })
    const caloreJson = await caloreData.json()
    console.log(caloreJson)
    const docData = {
      "calories": caloreJson.items[0].calories,
      "serving_size": JSON.stringify(caloreJson.items[0].serving_size_g)+"g",
      "quantity": 1
    }
    console.log(docData)
    await setDoc(docRef, docData)
    updateInventory()
  }


  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry',"default_pantry", 'pantryItems'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)



  return (
    <Box
    // width="100vw"
    width={'100%'}
    height="100vh"
    display={'flex'}
    justifyContent={'center'}
    flexDirection={'column'}
    alignItems={'center'}
    gap={2}
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Item
        </Typography>
        <Stack width="100%" direction={'row'} spacing={2}>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Stack direction="row" spacing={2}>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField sx={{width: 500,}} id="outlined-basic" label="Search" variant="outlined" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value)
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}/>
    </Stack>
    
      
    <Box component={Paper} border={'1px solid #333'} elevation={3}  width={9/10} height={1/2} sx={{background: '#fff'}}>
      
      {/* <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
        {filteredInventory.map(({name, quantity,calories,serving_size}) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            bgcolor={'#f0f0f0'}
            paddingX={5}
          >
            <Typography variant={'p'} color={'#333'} textAlign={'center'}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant={'p'} color={'#333'} textAlign={'center'}> 
              {calories} calories
            </Typography>
            <Typography variant={'p'} color={'#333'} textAlign={'center'}>Serving Size 
              : {serving_size}
            </Typography>
            <Typography variant={'p'} color={'#333'} textAlign={'center'}>
              Quantity: {quantity}
            </Typography>
            <Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button>
          </Box>
        ))}
      </Stack> */}
      <TableContainer border={'1px solid #333'} component={Paper} >
      <Table  aria-label="simple table">
      
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Calories</TableCell>
            <TableCell align="center">Serving Size&nbsp;(g)</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody height={1} >
          {filteredInventory.map(({name, quantity,calories,serving_size}) => (
            <TableRow
              key={name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center" component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="center">{quantity}</TableCell>
              <TableCell align="center">{calories}</TableCell>
              <TableCell align="center">{serving_size}</TableCell>
              <TableCell align="center"><Button variant="contained" onClick={() => removeItem(name)}>
              Remove
            </Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  </Box>
  );
}
