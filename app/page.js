'use client'

import * as React from 'react';
import { firestore } from "@/firebase";
import { useEffect, useState } from "react";
import {ListItemButton, ListItemText, ListItem, List, Drawer, Box, Stack, Typography, Button, Modal, TextField, Table, TableContainer, TableHead, TableBody, TableCell, TableRow, Paper, InputAdornment, IconButton, Menu, MenuItem, Tabs} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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

const style2 = {
  
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
}






export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [recipes, setRecipes] = useState(false);
  const filteredInventory = inventory.filter( item => item.name.toLowerCase().includes(searchQuery))

  const openMenu = Boolean(anchorEl);


  const handleMenuClick = (event) => {
    setAnchorEl(event.target);
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const updateRecipeValue = (e) => {
    e.target.parentElement.innerText === "Inventory" ? setRecipes(false) :
    setRecipes(true);
  }


  
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
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      var quantity = docSnap.data().quantity + 1
      const docData = {
        "name": item,
        "calories": docSnap.data().calories,
        "serving_size": docSnap.data().serving_size,
        "quantity": quantity
      }
      await setDoc(docRef, docData)
      updateInventory()
      return
    }
    const caloreData = await fetch('https://api.calorieninjas.com/v1/nutrition?query=' + item,{
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_CALORIE_API_KEY
      },
      method: 'GET',
    })
    const caloreJson = await caloreData.json()
    console.log(caloreJson)
    const docData = {
      "name": item,
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
      await deleteDoc(docRef)
    }
    await updateInventory()
  }


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  


  return (
   <Stack  direction="row" sx={style2} backgroundColor="#fefefe"
   
   >
    
   
      <div >
      
      <Drawer
      component={Paper}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box  role="presentation" >
      <List>
          <ListItem key={'Inventory'} disablePadding>
            <ListItemButton onClick={updateRecipeValue}>
              <ListItemText primary={'Inventory'} />
            </ListItemButton>
          </ListItem>
          <ListItem key={'Recipes'} disablePadding>
            <ListItemButton onClick={updateRecipeValue}>
              <ListItemText primary={'Recipes'} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
        </Drawer>
      </div>
      
      <Stack sx={{ display: recipes ? "none" : "flex",
        width: "100%",
        height: "100%",
      }} >
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
      
        <Stack direction="row" spacing={2} sx={{
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
            <TextField sx={{width: "500px"}} id="outlined-basic" label="Search" variant="outlined" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value.toLowerCase())
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}/>
          </Stack>
          <Stack height={"100%"} alignItems={"center"} justifyContent={"center"}>
          <TableContainer component={Paper} sx={{width:"90%", height:"90%", border: 1, borderColor: "#000"}}>
            <Table variant="outlined" aria-label="basic table" sx={{padding:10}} >
                <TableHead sx={{background: "#f8f8f8"}}>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="center">Calories</TableCell>
                    <TableCell align="center">Serving Size&nbsp;(g)</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {filteredInventory.map(({name, quantity,calories,serving_size}) => (
                    <TableRow
                      key={name}
                      sx={{ height: 50 }}
                    >
                      <TableCell align="center" component="th" scope="row">
                        {name}
                      </TableCell>
                      <TableCell align="center">{quantity}</TableCell>
                      <TableCell align="center">{calories}</TableCell>
                      <TableCell align="center">{serving_size}</TableCell>
                      <TableCell align="center"><IconButton variant="contained" id={name} onClick={handleMenuClick} >
                      <MoreHorizIcon/>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
                      <MenuItem onClick={() => {
                        handleCloseMenu()
                        removeItem(anchorEl.parentElement.id)
                      }} >Remove</MenuItem>
                      {/* <MenuItem >Edit</MenuItem> */}
                    </Menu>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Stack>
        </Stack>

      <Stack sx={{display: recipes ? null : "none"}}>
        <Typography variant="h4" align="center">Recipes Coming Soon</Typography>
      </Stack>
      </Stack>
  );
}
