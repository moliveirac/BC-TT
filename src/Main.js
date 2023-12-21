import React, { useEffect, useState } from "react";
import './Main.css';
import { create } from 'kubo-rpc-client'
import { ethers } from "ethers"
import { Buffer } from "buffer"
import logo from "./ethereumLogo.png"
import { addresses, abis } from "./contracts"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000000";

const defaultProvider = new ethers.providers.Web3Provider(window.ethereum);
const ipfsContract = new ethers.Contract(addresses.ipfs, abis.ipfs, defaultProvider);

async function readCurrentUserFile() {
  const result = await ipfsContract.userFiles(defaultProvider.getSigner().getAddress());
  console.log({ result });
  return result;
}

function App() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    window.ethereum.enable();
  }, []);

  useEffect(() => {
    async function readFile() {
      const file = await readCurrentUserFile();
      if (file !== ZERO_ADDRESS) {
        setIpfsHash(file);
        // Cuando se actualiza el hash, lee y muestra el contenido del archivo
        await readFileContent(file);
      }
    }
    readFile();
  }, [ipfsHash]);

  async function setFileIPFS(hash) {
    const ipfsWithSigner = ipfsContract.connect(defaultProvider.getSigner());
    console.log("TX contract");
    const tx = await ipfsWithSigner.setFileIPFS(hash);
    console.log({ tx });
    setIpfsHash(hash);
  }

  async function readFileContent(hash) {
    try {
      const client = await create('/ip4/0.0.0.0/tcp/5001');
      const generator = client.cat(hash);
      let data = "";
      for await (const chunk of generator) {
        data += Buffer.from(chunk).toString();
      }
      setFileContent(data);
    } catch (error) {
      console.error("Error reading file content:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(fileContent); // Muestra el contenido del archivo en la consola
      const client = await create('/ip4/0.0.0.0/tcp/5001');
      const result = await client.add(fileContent);
      await client.files.cp(`/ipfs/${result.cid}`, `/${result.cid}`);
      console.log(result.cid);
      await setFileIPFS(result.cid.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsText(data);
    reader.onloadend = () => {
      console.log("Text data:", reader.result);
      setFileContent(reader.result);
    };
    e.preventDefault();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;


