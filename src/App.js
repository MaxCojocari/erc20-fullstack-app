import { useState } from "react";
import { ethers } from "ethers";
import INTToken from "./contracts/INTToken.json";
import INTTokenAddress from "./contracts/INTToken-contract-address.json";
import './App.css';


function App() {

  const [address, setAddress] = useState("")
  const [addressTo, setAddressTo] = useState("")
  const [amount, setAmount] = useState("")
  const [info, setInfo] = useState({
    fullName: "-",
    symbol: "-",
    balance: "-",
    address: "-"
  })
  const [errorMsg, setError] = useState("")
  const [isAllertVisible, setIsAllertVisible] = useState(false)

  
  function getINTTokenContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = new ethers.Contract(
      INTTokenAddress.INTToken,
      INTToken.abi,
      signer
    );
      return token
  }
    
  const token = getINTTokenContract()

  function setTimedErrorAndReason(error) {
    setIsAllertVisible(true)
      
    setTimeout(() => {
      setIsAllertVisible(false);
    }, 10000);
    
    setError(error.reason)
  }
    
  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }
    
  async function getInfo() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      
      const signer = await token.signer.getAddress()
      
      const fullName = await token.name()
      const symbol = await token.symbol()
      const balanceINT = (address === INTTokenAddress.INTToken) ? await token.totalSupply() : await token.balanceOf(signer)
      
      setInfo({
        fullName: fullName,
        symbol: symbol,
        balance: parseInt(balanceINT._hex),
        address: signer
      })
      
      setAddress("")
    } 
  }

  async function transferTokens() {
    if (!addressTo) return
    
    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount()
        const signer = await token.signer.getAddress()

        const tx = await token.transfer(addressTo, amount)
        await tx.wait()
  
        const fullName = await token.name()
        const symbol = await token.symbol()
        const balanceINT = await token.balanceOf(signer)
  
        setInfo({
          fullName: fullName,
          symbol: symbol,
          balance: parseInt(balanceINT._hex),
          address: signer
        })
  
        setAddressTo("")
        setAmount("")
      }
    } catch (error) {
      setTimedErrorAndReason(error)
    }
  }

  async function mintTokens() {
    if (!amount) return

    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount()
        
        const tx = await token.mint(amount, await token.signer.getAddress())
        await tx.wait()
  
        const fullName = await token.name()
        const symbol = await token.symbol()
        const totalBalanceINT = await token.totalSupply()
  
        setInfo({
          fullName: fullName,
          symbol: symbol,
          balance: parseInt(totalBalanceINT._hex),
          address: INTTokenAddress.INTToken
        })
  
        setAmount("")
      }
    } catch (error) {
      setAmount("")
      
      setTimedErrorAndReason(error)
    }

  }

  async function burnTokens() {
    if (!amount) return

    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount()
        
        const tx = await token.burn(amount, await token.signer.getAddress())
        await tx.wait()
  
        const fullName = await token.name()
        const symbol = await token.symbol()
        const totalBalanceINT = await token.totalSupply()
  
        setInfo({
          fullName: fullName,
          symbol: symbol,
          balance: parseInt(totalBalanceINT._hex),
          address: INTTokenAddress.INTToken
        })
  
        setAmount("")
      }

    } catch (error) {
      setAmount("")

      setTimedErrorAndReason(error)
    }
  }

  async function addWhitelist() {
    if (!address) return

    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount()
        
        const tx = await token.addAddressWhitelist(address)
        await tx.wait()
  
        setAddress("")
      }
    } catch (error) {
      setAddress("")

      setTimedErrorAndReason(error)
    }
  }

  async function removeWhitelist() {
    if (!address) return

    try {
      if (typeof window.ethereum !== "undefined") {
        await requestAccount()
        const token = getINTTokenContract()
        
        const tx = await token.removeAddressWhitelist(address)
        await tx.wait()
  
        setAddress("")
      }
    } catch (error) {
      setAddress("")

      setTimedErrorAndReason(error)
    }
  }


  return (
    <div className="App">
      <div className="credit-card">
       
        <div className="form-header">
          <h4 className="title">INT Token</h4>
        </div>
      
        <div className="form-body">

          <table className="table">
            <thead>
              <tr>
                <td>Address</td>
                <td>Symbol</td>
                <td>Name</td>
                <td>Balance</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{info.address}</td>
                <td>{info.symbol}</td>
                <td>{info.fullName}</td>
                <td>{info.balance}</td>
              </tr>
            </tbody>
          </table>

          <button className="button" onClick={getInfo}>
            GET INT BALANCE
          </button>

          <input 
            type="text" 
            className="user-input" 
            onChange={(e) => setAddressTo(e.target.value)}
            style={{marginTop: "40px"}}
            value={addressTo}
            placeholder="Transfer to address"
          />  

          <input 
            type="text" 
            className="user-input" 
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            placeholder="Amount"
          /> 

          <button 
            className="button" 
            onClick={transferTokens}
            style={{backgroundColor: "rgb(240, 164, 2)"}}>
            TRANSFER
          </button>
          
          <div className="btns-mint-burn">

            <div className="button-mint">
              <button 
                className="button" 
                onClick={mintTokens}
                style={{
                  backgroundColor: "#90949c"
                }}>
                MINT
              </button>
            </div>

            <div className="button-burn">
              <button 
                className="button" 
                onClick={burnTokens}
                style={{
                  backgroundColor: "#45596C"
                }}>
                BURN
              </button>
            </div>

          </div>

          <input 
            type="text" 
            className="user-input" 
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            style={{marginTop: "40px"}}
            placeholder="Account address"
          />

          <div className="button-add">
            <button 
              className="button" 
              onClick={addWhitelist}
              style={{backgroundColor: "rgb(137, 209, 0)"}}>
              ADD TO WHITELIST
            </button>
          </div>

          <div className="button-remove">
            <button 
              className="button" 
              onClick={removeWhitelist}
              style={{backgroundColor: "rgb(7, 127, 179)"}}>
              REMOVE FROM WHITELIST
            </button>
          </div>
          
        </div>

        { isAllertVisible && errorMsg &&
          <div className="error-msg">
            <i className="material-icons" style={{fontSize:"30px",color:"rgb(120, 1, 1)"}}>warning</i>
            <p style={{color: "rgb(120, 1, 1)"}}>
            {errorMsg}!
            </p>
          </div>
        }

      </div>
    </div>
  );
}

export default App;
