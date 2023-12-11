import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal, Stack, TextField, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { getDocs, getDoc, doc, collection, query, orderBy, deleteDoc } from 'firebase/firestore';
import axios from 'axios';

export default function ManageAccounts() {
    const [openModal, setOpenModal] = useState(false)
    const [openConfirmation, setOpenConfirmation] = useState(false)

    const [accountsList, setAccountsList] = useState([])
    const [accountDetails, setAccountDetails] = useState({})

    const [searchCriteria, setSearchCriteria] = useState('')


    useEffect(() => { // Handle retrieving account list on initial load
        const getAccounts = async () => {
            try {
                const q = query(collection(db, 'accounts'), orderBy('username'))
                const data = await getDocs(q)
                const resList = data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(account => account.type !== 'admin')
                setAccountsList(resList)
            } catch (err) {
                console.error(err)
            }
        }
        getAccounts()
    },[])

    const viewAccount = async (id) => { // Handle view record by populating data to modal
        setOpenModal(true)
        try {
            const resList = await getDoc(doc(db, 'accounts', id))
            const appendID = resList.data()
            appendID.id = id // Append id to list
            setAccountDetails(appendID)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteAccount = async (id) => {
        try {
            await axios.post('http://localhost/deleteUser', { id })
            await deleteDoc(doc(db, 'accounts', id))
            alert('Account deleted successfully')
            window.location.reload()
          } catch (err) {
            console.error(err.message)
          }
    }

    const searchAccount = async (e) => { // Handle search record
        e.preventDefault()
        try {
            if (searchCriteria === '') { // If search criteria is empty, retrieve all accounts
                const data = await getDocs(collection(db, 'accounts'))
                const resList = data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(account => account.type !== 'admin')
                setAccountsList(resList)
            } else { // If search criteria is not empty, retrieve accounts that match the search criteria
                const q = query(collection(db, 'accounts'), orderBy('username'))
                const data = await getDocs(q)
                const resList = data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(account => account.type !== 'admin' && (account.username.includes(searchCriteria.toLowerCase()) || account.fullName.includes(searchCriteria.toLowerCase())))
                setAccountsList(resList)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const navigate = useNavigate()
    const editAccount=(param)=>{
        navigate('/EditAccount',{state:{id:param}}) // Handle navigation while passing user ID as parameter
    }

    
    return (
        <>
        <Box height='100%' width='100%' padding='185px 0 150px' display='flex' justifyContent='center'>
            <Stack width='80%'>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h3'>Manage Accounts</Typography>
                    <Box>
                        <form style={{display:'flex'}} onSubmit={searchAccount}>
                            <TextField className='searchTextField' placeholder='SEARCH' onChange={(e) => setSearchCriteria(e.target.value)}/>
                            <Button variant='search' type='submit'><SearchRoundedIcon sx={{fontSize:'30px'}}/></Button>
                        </form>
                    </Box>
                </Box>
                <Grid container gap='35px' alignItems='stretch' marginTop='50px'>
                    {accountsList.map((account) => (
                        <Grid key={account.id} item width='150px' borderRadius='15px' boxShadow='0 5px 15px rgba(0, 0, 0, 0.2)'>
                            <Card sx={{bgcolor:'#EEE', textAlign:'center', height:'150px', borderRadius:'15px'}} >
                                <CardActionArea sx={{height:'150px'}} onClick={() => viewAccount(account.id)}>
                                    <CardContent sx={{margin:'16px', overflow:'hidden'}}>
                                        <Typography variant='h5'>@{account.username}</Typography>
                                        <Typography textTransform='capitalize' variant='subtitle4'>{account.fullName}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Box>

        <Modal open={openModal} onClose={() => setOpenModal(false)} disableScrollLock>
            <Box className='ModalView' display='flex' borderRadius='20px' width='400px' padding='50px' margin='120px auto' bgcolor='#EEE' justifyContent='center' alignItems='center'>
                <Stack width='100%' gap='40px'>
                    
                    <Stack gap='15px'>
                        <Typography textTransform='uppercase' variant='h5'>Account Details:</Typography>
                        <table>
                            <tbody>
                                <tr>
                                    <td width='35%'>
                                        <Typography variant='subtitle2'>Account ID:</Typography>
                                    </td>
                                    <td>
                                        <Typography variant='subtitle3'>{accountDetails.id}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant='subtitle2'>Username:</Typography>
                                    </td>
                                    <td>
                                        <Typography variant='subtitle3'>{accountDetails.username}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant='subtitle2'>Full Name:</Typography>
                                    </td>
                                    <td>
                                        <Typography textTransform='capitalize' variant='subtitle3'>{accountDetails.fullName}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant='subtitle2'>Email:</Typography>
                                    </td>
                                    <td>
                                        <Typography variant='subtitle3'>{accountDetails.email}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant='subtitle2'>Gender:</Typography>
                                    </td>
                                    <td>
                                        <Typography textTransform='capitalize' variant='subtitle3'>{accountDetails.gender}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant='subtitle2'>Region:</Typography>
                                    </td>
                                    <td>
                                        <Typography textTransform='capitalize'variant='subtitle3'>{accountDetails.region}</Typography>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Typography variant='subtitle2'>Sport(s):</Typography>
                                    </td>
                                    <td>
                                        <Typography textTransform='capitalize'variant='subtitle3'>
                                            {accountDetails.sportInterests?.length > 1 ?
                                                accountDetails.sportInterests?.map((sport, index, array) => (
                                                    index === array.length - 1 ? sport : sport + ', '
                                                )).join('')
                                                :
                                                accountDetails.sportInterests
                                            }
                                        </Typography>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Stack>

                    <Box display='flex' flexDirection='row' justifyContent='space-between'>
                        <Button onClick={() => editAccount(accountDetails.id)} sx={{width:'170px'}} variant='blue'>Edit Account</Button>
                        <Button onClick={() => setOpenConfirmation(true)} sx={{width:'170px'}} variant='red'>Delete Account</Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>

        <React.Fragment>
            <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
                <DialogTitle>
                    <Typography variant='h5'>Delete Account</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{padding:'0 24px 16px'}}>
                    <Button onClick={() => deleteAccount(accountDetails.id)} variant='blue'>Yes</Button>
                    <Button onClick={() => setOpenConfirmation(false)} variant='red' autoFocus>No</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
        </>
    )
}
