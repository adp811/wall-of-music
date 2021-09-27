import React from "react";
import axios from "axios";
import { Box, Center, useColorModeValue, Text, Stack, Image, Link } from '@chakra-ui/react';
import { encode as base64_encode } from 'base-64';

const Song = ({url, address, timestamp}) => {
    
    const [image, setImage] = React.useState("https://via.placeholder.com/300");
    const [artistName, setArtistName] = React.useState("default");
    const [songName, setSongName] = React.useState("default");

    const conv_time = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', 
                            hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp); 

    console.log(conv_time);

    React.useEffect(() => { 

        var id = new URL(url).pathname.split('/')[2];
    
        //make request for Oauth Acess Token, then make request for song info
        axios('https://accounts.spotify.com/api/token', {
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded',
              'Authorization' : 'Basic ' + base64_encode(process.env.REACT_APP_CLIENT_ID + 
                    ':' + process.env.REACT_APP_CLIENT_SECRET)     
            },
            data: 'grant_type=client_credentials',
            method: 'POST'

          }).then(tokenResponse => {      
            
            axios('https://api.spotify.com/v1/tracks/' + id , {
                headers: {
                    'Authorization' : 'Bearer ' + tokenResponse.data.access_token
                },
                method: 'GET'

            }).then(dataResponse => {

                setSongName(dataResponse.data.name);
                setArtistName(dataResponse.data.artists[0].name);
                setImage(dataResponse.data.album.images[1].url);
                
            });

          });      

    }, []);

    return (

        <Center py={12}>
            <Box
                role={'group'}
                p={6}
                maxW={'460px'}
                minH={'475px'}
                w={'full'}
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'xl'}
                rounded={'lg'}
                pos={'relative'}
                zIndex={1}>
                <Box
                rounded={'lg'}
                mt={-12}
                pos={'relative'}
                height={'290px'}
                _after={{
                    transition: 'all .3s ease',
                    content: '""',
                    w: 'full',
                    h: 'full',
                    pos: 'absolute',
                    top: 5,
                    left: 0,
                    backgroundImage: `url(${image})`,
                    filter: 'blur(15px)',
                    zIndex: -1,
                }}
                _groupHover={{
                    _after: {
                    filter: 'blur(20px)',
                    },
                }}>

                <Link href={url} isExternal>
                    <Image
                        rounded={'lg'}
                        height={300}
                        width={300}
                        objectFit={'cover'}
                        src={image}
                    
                    />
                </Link>
              
                </Box >

                <Stack pt={10} align={'center'}>
                    
                    <Text 
                        color={'gray.500'} 
                        textTransform={'uppercase'}>
                        {artistName}
                    </Text>
                    <Text 
                        fontSize={ songName.length < 25 ? '2xl' : 'lg' } 
                        fontWeight={500} maxW={'300px'} 
                        h={'40px'} align={'center'} >
                        {songName}
                    </Text>

                    <br />

                    <Stack direction={'column'} align={'center'}>
                        <Text color={'gray.600'}>
                        {conv_time}
                        </Text>
                        <Text color={'gray.600'} fontSize='9px' href={url}>
                        {address}
                        </Text>
                    </Stack>
                </Stack>
            </Box>
        </Center>

    );

}

export default Song