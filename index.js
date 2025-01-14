import { ethers } from "./ethers-5.6-esm-min.js"
import {abi,contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")


connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" })
    console.log(ethers)
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function withdraw(){
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
   try {
    const transactionResponseawait = await contract.withdraw()
    await listenForTransactionMine(transactionResponseawait, provider)
   } catch (error) {
    console.log(error)
   }
  }
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}


async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try{
      const transactionResponse = await contract.fund({value:ethers.utils.parseEther(ethAmount)})
      //listen for the tx to be mined
      await listenForTransactionMine(transactionResponse, provider)
    }catch(error){
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

function listenForTransactionMine(transactionResponse, provider){
  console.log(`Mining ${transactionResponse.hash}...`)
  //return new Promise()
  //creat a listener for the blockchain
  return new Promise((resolve, reject) =>{
    provider.once(transactionResponse.hash, (transactionReceipt)=>{
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
      resolve()
    })
  })
  
}


