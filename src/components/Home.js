import React, { useEffect, useState} from 'react'
import { Box, Button, Card, CardActionArea, CardContent, Grid, Stack, TextField, Typography } from '@mui/material'
import lightningBG from '../img/backgrounds/lightningBG.png'
import newsletterBG from '../img/backgrounds/newsletterBG.png'
import { db } from '../config/firebase';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';

export default function Home() {
    const [tournamentList, setTournamentList] = useState([])
    const [newsArticleList, setNewsArticleList] = useState([])

    useEffect(() => { // Handle retrieving tournament and news article list on load
        const getTournaments = async () => {
            try {
                const q = query(collection(db, 'tournaments'), limit(3)) // Order list by date in descending order
                const data = await getDocs(q)
                const resList = data.docs.map((doc) => ({...doc.data(), id: doc.id})).filter(tournament => tournament.date.end.toDate() >= new Date() && tournament.status !== 0) // Filter out tournaments that have already ended or are cancelled
                setTournamentList(processTournamentDate(resList))
            } catch (err) {
                console.error(err)
            }
        }
        const getNewsArticles = async () => {
            try {
                const q = query(collection(db, 'newsArticles'), orderBy('date', 'desc'), limit(4)) // Order list by date in descending order
                const data = await getDocs(q)
                const resList = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
                setNewsArticleList(processArticleDate(resList))
            } catch (err) {
                console.error(err)
            }
        }
        getTournaments()
        getNewsArticles()
    }, [])

    const processArticleDate = (list) => {
        const updatedNewsArticleList = list.map((newsArticle) => {
            const date = newsArticle.date.toDate().toDateString().split(' ').slice(1)

            return {
                ...newsArticle,
                date
            }
        })
        return updatedNewsArticleList
    }
    const processTournamentDate = (list) => {
        const updatedTournamentList = list.map((tournament) => {
            const startDate = tournament.date.start.toDate().toDateString().split(' ').slice(1)
            const endDate = tournament.date.end.toDate().toDateString().split(' ').slice(1)

            return {
                ...tournament,
                date: {
                  start: startDate,
                  end: endDate,
                },
            }
        })
        return updatedTournamentList
    }

    const viewTournament=(id)=>{
        window.location.href = `/ViewTournament?id=${id}`;
    }
    const viewNewsArticle=(id)=>{
        window.location.href = `/ViewNewsArticle?id=${id}`;
    }


    return (
        <Stack height='100%' width='100%'>
            <Box display='flex' justifyContent='center' height='650px' sx={{backgroundImage: `url('${lightningBG}')`, backgroundRepeat: "no-repeat", backgroundPosition: "right top", backgroundAttachment:'fixed'}}>
                <Box display='flex' width='80%'>
                    <Stack width='40%' paddingTop='120px' justifyContent='center'>
                        <Typography variant='h1'><span style={{color:'#CB3E3E'}}>LOREM IPSUM</span> DOLOR SIT AMET</Typography>
                        <Typography variant='body1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur rutrum elit ipsum, tempus scelerisque sem.</Typography>
                        <Box display='flex' gap='25px' alignItems='center' marginTop='25px'>
                            <Button variant='red'>Sign Up</Button>
                            <a href='#'><Typography sx={{textDecoration:'underline'}} variant='action'>Learn More</Typography></a>
                        </Box>
                    </Stack>

                    <Box width='60%' display='flex' alignItems='flex-end'>
                        <img style={{height:'530px'}} src={require('../img/elements/team.png')}/>
                    </Box>
                </Box>
            </Box>

            <Box display='flex' justifyContent='center' height='650px' bgcolor='#EEE'>
                <Stack width='80%' alignItems='center' justifyContent='center' gap='100px'>
                    <Stack textAlign='center' width='470px' gap='10px'>
                        <Typography variant='h3'>Lorem ipsum dolor sit amet</Typography>
                        <Typography variant='body1'>Nunc eu neque posuere, laoreet justo sit amet, aliquet nisl. Morbi semper tincidunt lorem in scelerisque.</Typography>
                    </Stack>

                    <Box display='flex' alignItems='center' justifyContent='center'>
                        <Box bgcolor='#CB3E3E' height='10px' width='50%' position='absolute' zIndex='1'></Box>

                        <Box width='30%' height='100%' display='flex' margin='0 2%' zIndex='2'>
                            <Stack gap='15px' bgcolor='white' borderRadius='10px' padding='50px 35px 30px'>
                                <Box width='75px' height='75px' display='flex' alignItems='center' justifyContent='center' bgcolor='#CB3E3E' borderRadius='100px' position='absolute' marginTop='-90px'>
                                    <img height='40px' src={require('../img/icons/aboutAI.png')}/>
                                </Box>
                                <Typography variant='h4'>Aenean porttitor</Typography>
                                <Typography variant='body1'>Aenean porttitor ligula eu tellus eleifend fermentum. Nulla facilisi. Sed commodo egestas augue sed imperdiet. Quisque vel diam laoreet.</Typography>
                            </Stack>
                        </Box>

                        <Box width='30%' height='100%' display='flex' margin='0 2%' zIndex='2'>
                            <Stack gap='15px' bgcolor='white' borderRadius='10px' padding='50px 35px 30px'>
                                <Box width='75px' height='75px' display='flex' alignItems='center' justifyContent='center' bgcolor='#CB3E3E' borderRadius='100px' position='absolute' marginTop='-90px'>
                                    <img height='40px' src={require('../img/icons/aboutTrophy.png')}/>
                                </Box>
                                <Typography variant='h4'>Pellentesque hendrerit</Typography>
                                <Typography variant='body1'>In gravida imperdiet tellus. Etiam ornare ut ante quis pulvinar. Donec ut faucibus purus, eu dictum erat. Vivamus convallis at tellus a condimentum.</Typography>
                            </Stack>
                        </Box>

                        <Box width='30%' height='100%' display='flex' margin='0 2%' zIndex='2'>
                            <Stack gap='15px' bgcolor='white' borderRadius='10px' padding='50px 35px 30px'>
                                <Box width='75px' height='75px' display='flex' alignItems='center' justifyContent='center' bgcolor='#CB3E3E' borderRadius='100px' position='absolute' marginTop='-90px'>
                                    <img height='40px' src={require('../img/icons/aboutCustomize.png')}/>
                                </Box>
                                <Typography variant='h4'>Maecenas pretium</Typography>
                                <Typography variant='body1'>Pellentesque hendrerit lacus quis tincidunt pharetra. Aliquam dignissim, erat id mattis vulputate, neque nibh malesuada ex.</Typography>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>
            </Box>

            <Box display='flex' justifyContent='center' height='650px'>
                <Stack width='80%' justifyContent='center'>
                    <Box display='flex' justifyContent='space-between' alignContent='center'>
                        <Typography variant='h3'>Tournaments</Typography>
                        <a href='/Tournaments'><Typography color='#006DEE' fontSize='14px' letterSpacing='2px' variant='action'>See More Tournaments</Typography></a>
                    </Box>

                    <Grid container gap='35px' alignItems='stretch' marginTop='50px'>
                        {tournamentList.map((tournament) => (
                            <Grid key={tournament.id} item width='350px' borderRadius='15px' boxShadow='0 5px 15px rgba(0, 0, 0, 0.2)'>
                                <Card sx={{bgcolor:'#EEE', textAlign:'center', borderRadius:'15px'}} >
                                    <CardActionArea onClick={() => viewTournament(tournament.id)}>
                                        <CardContent sx={{padding:'0'}}>
                                            <Stack>
                                                <Box height='180px' width='350px'>
                                                    <img width='100%' height='100%' style={{objectFit:'cover'}} src={tournament.imgURL}/>
                                                </Box>
                                                <Stack height='100%' padding='15px 25px 30px' gap='15px'>
                                                    <Box display='flex' justifyContent='space-between'>
                                                        <Typography textTransform='uppercase' variant='subtitle4'>{tournament.sport}</Typography>
                                                        {tournament.date.start[2] === tournament.date.end[2] ? 
                                                            <Typography textTransform='uppercase' variant='subtitle4'>{tournament.date.start[0]} {tournament.date.start[1]} — {tournament.date.end[1]}, {tournament.date.end[2]}</Typography>
                                                            :
                                                            <Typography textTransform='uppercase' variant='subtitle4'>{tournament.date.start[0]} {tournament.date.start[1]}, {tournament.date.start[2]} — {tournament.date.end[0]} {tournament.date.end[1]}, {tournament.date.end[2]}</Typography>
                                                        }
                                                    </Box>
                                                    <Box display='flex'>
                                                        <Typography textAlign='left' variant='h4'>{tournament.title}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
                
            </Box>

            <Box display='flex' justifyContent='center' height='650px' bgcolor='#EEE'>
                <Stack width='80%' justifyContent='center'>
                    <Box display='flex' justifyContent='space-between' alignContent='center'>
                        <Typography variant='h3'>News Articles</Typography>
                        <a href='/NewsArticles'><Typography color='#006DEE' fontSize='14px' letterSpacing='2px' variant='action'>See More Articles</Typography></a>
                    </Box>

                    <Grid container gap='35px' alignItems='stretch' marginTop='50px'>
                        {newsArticleList.map((newsArticle) => (
                            <Grid key={newsArticle.id} item width='265px' height='100%' borderRadius='15px' boxShadow='0 5px 15px rgba(0, 0, 0, 0.2)'>
                                <Card sx={{textAlign:'center', borderRadius:'15px', height:'100%'}} >
                                    <CardActionArea onClick={() => viewNewsArticle(newsArticle.id)}>
                                        <CardContent sx={{padding:'0'}}>
                                            <Stack>
                                                <Box height='200px' width='265px'>
                                                    <img width='100%' height='100%' style={{objectFit:'cover'}} src={newsArticle.imgURL}/>
                                                </Box>
                                                <Stack bgcolor='white' height='100%' padding='15px 25px 30px' gap='15px'>
                                                    <Box display='flex' justifyContent='space-between'>
                                                        <Typography sx={{textTransform:'uppercase'}} variant='subtitle4'>{newsArticle.sport}</Typography>
                                                        <Typography sx={{textTransform:'uppercase'}}  variant='subtitle4'>{newsArticle.date[0]} {newsArticle.date[1]}, {newsArticle.date[2]}</Typography>
                                                    </Box>
                                                    <Box display='flex'>
                                                        <Typography textAlign='left' variant='h4'>{newsArticle.title}</Typography>
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
                
            </Box>

            <Box display='flex' justifyContent='center' height='250px' sx={{backgroundImage: `url('${newsletterBG}')`, backgroundRepeat:"no-repeat", backgroundSize:'cover'}}>
                <Stack width='80%' alignItems='center' justifyContent='center'>
                    <Typography color='white' variant='h3'>Join our newsletter</Typography>
                    <Typography color='white' marginBottom='20px' variant='body1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta odio quis congue ullamcorper.</Typography>

                    <Box display='flex' gap='20px'>
                        <TextField className='newsletterTextField' placeholder='ENTER YOUR EMAIL'/>
                        <Button variant='red'>Subscribe</Button>
                    </Box>
                </Stack>
            </Box>

        </Stack>
    )
}
