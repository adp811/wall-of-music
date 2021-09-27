import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/MusicPortal.json";
import { ChakraProvider } from "@chakra-ui/react";
import { VStack, Flex, Spacer, Grid, Heading, Box, Spinner, Link } from "@chakra-ui/react";
import { Button, IconButton, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaLink, FaEthereum, FaGithubAlt } from "react-icons/fa";

//components 
import Song from "./components/Song";

function App() {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [allSongs, setAllSongs] = React.useState([]);
  const [formValue, setFormValue] = React.useState("");
  const [mining, setMining] = React.useState(false);

  const contractAddress = "0xab536802B035F15830F6c4B06834a4aC2bf48f86";
  const contractABI = abi.abi;

  React.useEffect(() => { //runs when app is launched 
    walletConnected();
  }, []);

  const sendSong = async () => {

    if(formValue === "") {
      alert("please enter a spotify link!");
      return;
    }

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const musicportalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const sendTxn = await musicportalContract.wave(formValue);
        console.log("Mining... -- Hash: ", sendTxn.hash);
        setMining(true);

        await sendTxn.wait();
        console.log("Mined -- Hash: ", sendTxn.hash);
        setMining(false);

        getAllSongs();
    
      } else {
        console.log("Ethereum object doesn't exist in current window.");
      }

    } catch (error) {
      console.log(error); 

    }

  }

  const getAllSongs = async () => {

    try {

      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const musicportalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const songs = await musicportalContract.getAllSongWaves();

        let songsCleaned = [];
        songs.forEach(SongWave => {
          songsCleaned.push({
            address: SongWave.waver,
            timestamp: new Date(SongWave.timestamp * 1000),
            link: SongWave.link

          });

        });

        setAllSongs(songsCleaned);

      } else {
        console.log("Ethereum object doesn't exist!")

      }

    } catch (error) {
      console.log(error);

    }

  }

  const walletConnected = () => {

    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask Wallet!");
      return;

    } else {
      console.log("Ethereum object found: ", ethereum);

    }

    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account: ", account);

          setCurrentAccount(account);
          getAllSongs();
          
        } else {
          console.log("No authorized account found.");

        }

      })

  }

  const connectWallet = () => {

    const { ethereum } = window;

    if (!ethereum) {
      alert("Metamask Wallet is required to use this Web App!");
    }

    ethereum.request({ method: "eth_requestAccounts" })
      .then(accounts => {
        console.log("Connected!", accounts[0]);
        setCurrentAccount(accounts[0]);

        getAllSongs();

      }).catch(err => console.log(err));

  }

  const handleChange = (event) => setFormValue(event.target.value);
  const showNetworkInfo = () => alert('This Web3 app is currently on the Rinkeby Test Network, make sure your Metamask Wallet is set to the Rinkeby Test Network!');

  return (
    <ChakraProvider>

      <VStack
        p={4} 
        w='100%' 
        alignItems='center' 
        spacing='20px'>

        <Flex w='100%'>

          <Button 
            leftIcon={<FaEthereum />} 
            colorScheme='gray' 
            variant='solid'
            onClick={showNetworkInfo} >  
            Rinkeby Test Network
          </Button>

          <Spacer />
          
          <Link href={'https://github.com/adp811'} isExternal>
            <IconButton
              icon={<FaGithubAlt />}
              isRound='true'
              size='lg' >
            </IconButton>
          </Link>

        </ Flex>

        < br />

        <Heading>Welcome to Aryan's Wall of Music!</Heading>

        <br />

        <Box
          w='60%' 
          borderColor='black' 
          borderWidth='3px' 
          p='4' 
          borderRadius='lg' 
          color='black'
          fontWeight='semibold'>

          Hi 👋🏽👋🏽!! My name is Aryan and I love music! Connect your wallet and send me your favorite tune through a Spotify share link. 
          Feel free to check out all the songs sent so far down below. Thank you and stay jammin!
        </Box>

        <br />

        {mining ? ([ <Spinner size="xl" />, < br /> ]) : null}

        {currentAccount ? (

          [ <Button       
            p='4'
            h='65px'
            w= '40%'
            size='lg' 
            color='white' 
            borderColor='black' 
            borderWidth='3px'
            bgGradient='linear(to-l, #29323c, #485563)' 
            _hover={{
              bgGradient: 'linear(to-r, #c471f5, #fa71cd)',
            }}
            onClick={sendSong}>
            
            Send Song!
          </Button>,

          <InputGroup alignSelf='center' w='40%' >
             <InputLeftElement
              pointerEvents='none'
              children={<FaLink />}/>
            ` <Input placeholder="paste spotify link here"
                    borderColor='black'
                    focusBorderColor='#c471f5' 
                    borderWidth='3px'
                    value={formValue}
                    onChange={handleChange} />
          </InputGroup> ]

        ) : (
  
          <Button       
            p='4'
            h='65px'
            w= '40%'
            size='lg' 
            color='white' 
            borderColor='black' 
            borderWidth='3px'
            bgGradient='linear(to-l, #29323c, #485563)' 
            _hover={{
              bgGradient: 'linear(to-r, #43e97b, #38f9d7)',
            }}
            onClick={connectWallet}>

            Connect MetaMask Wallet
          </Button>

        )}      

      </VStack>

      <br />

      <VStack
         p={4}  
         w='100%'
         alignItems='center' 
         spacing='20px'>

        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
          {allSongs.map((song, index) => {
            return (
                <Song url={song.link} address={song.address} timestamp={song.timestamp} />
              )
          })}
        </Grid>

      </VStack>

    </ChakraProvider>
    

  );
}

export default App;
