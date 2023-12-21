import React, { useEffect, useState } from "react";
import 'popper.js';
import 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { create } from 'kubo-rpc-client'
import { ethers } from "ethers"
import { Buffer } from "buffer"
import logo from "./ethereumLogo.png"
import { addresses, abis } from "./contracts"
import { id } from "ethers/lib/utils";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000000000000000000000000000";

const defaultProvider = new ethers.providers.Web3Provider(window.ethereum);
const ipfsContract = new ethers.Contract(addresses.ipfs, abis.ipfs, defaultProvider);

// const ruletaContrat = new ethers.Contract(addresses.ruleta, abis.ruleta, defaultProvider);

async function apostarNumero() {
  // const result = await ruletaContrat.
  return null;
}

async function readCurrentUserFile() {
  const result = await ipfsContract.userFiles(defaultProvider.getSigner().getAddress());
  console.log({ result });
  return result;
}

function App() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);

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

  const handleClick = (value) => {
    // Actualiza el estado para marcar la celda como seleccionada.
    setSelectedCell(value);
  }

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

  const clickCell = (event) => {
    const cell = event.target;
    const radio = cell.querySelector('input');
  
    if (radio) {
      const selected = document.querySelectorAll(".hover-forever");
  
      if (radio.checked) {
        cell.classList.remove("hover-forever");
      } else {
        selected.forEach((item) => item.classList.remove("hover-forever"));
        cell.classList.add("hover-forever");
      }
  
      radio.checked = !radio.checked; // Cambiar el estado del radio
    }
  };

  const apostar = () => {

  }
  

  return (
    <div className="container">
      <div className="App">
        <img src={logo} className="App-logo mb-3" alt="Ruleta" />
        <form>
        <table className="table Transparente">
          <tbody>
            <tr>
            <td rowSpan="3"
                className={`g-cell hover-highlight`}
                onClick={clickCell}
                style={{ verticalAlign: 'middle', textAlign: 'center' }}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={0}
                />
                <strong>0</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={3}
                />
                <strong>3</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={6}
                />
                <strong>6</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={9}
                />
                <strong>9</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={12}
                />
                <strong>12</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={15}
                />
                <strong>15</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={18}
                />
                <strong>18</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={21}
                />
                <strong>21</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={24}
                />
                <strong>24</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={27}
                />
                <strong>27</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={30}
                />
                <strong>30</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={33}
                />
                <strong>33</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={36}
                />
                <strong>36</strong>
              </td>
              <td rowSpan="3"
                className={`g-cell hover-highlight`}
                onClick={clickCell}
                style={{ verticalAlign: 'middle', textAlign: 'center' }}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={37}
                />
                <strong>00</strong>
              </td>
            </tr>
            <tr>
            <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={2}
                />
                <strong>2</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={5}
                />
                <strong>5</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={33}
                />
                <strong>8</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={11}
                />
                <strong>11</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={14}
                />
                <strong>14</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={17}
                />
                <strong>17</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={20}
                />
                <strong>20</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={23}
                />
                <strong>23</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={26}
                />
                <strong>26</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={29}
                />
                <strong>29</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={32}
                />
                <strong>32</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={35}
                />
                <strong>35</strong>
              </td>
            </tr>
            <tr>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={1}
                />
                <strong>1</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={4}
                />
                <strong>4</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={7}
                />
                <strong>7</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={10}
                />
                <strong>10</strong>
              </td>              
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={13}
                />
                <strong>13</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={16}
                />
                <strong>16</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={19}
                />
                <strong>19</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={22}
                />
                <strong>22</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={25}
                />
                <strong>25</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={28}
                />
                <strong>28</strong>
              </td>
              <td
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={33}
                />
                <strong>31</strong>
              </td>
              <td
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={34}
                />
                <strong>34</strong>
              </td>
            </tr>
            <tr>
              <td className="no-cell"></td>
              <td
                colSpan="4"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"1a docena"}
                />
                <strong>1ª docena</strong>
              </td>
              <td
                colSpan="4"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"2a docena"}
                />
                <strong>2ª docena</strong>
              </td>
              <td
                colSpan="4"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"3a docena"}
                />
                <strong>3ª docena</strong>
              </td>
            </tr>
            <tr>
              <td className="no-cell"></td>
              <td
                colSpan="2"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"1-18"}
                />
                <strong>1-18</strong>
              </td>
              <td
                colSpan="2"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"PAR"}
                />
                <strong>PAR</strong>
              </td>
              <td
                colSpan="2"
                className={`r-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"Rojo"}
                />
                <strong>Rojo</strong>
              </td>
              <td
                colSpan="2"
                className={`n-cell hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"Negro"}
                />
                <strong>Negro</strong>
              </td>
              <td
                colSpan="2"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"IMPAR"}
                />
                <strong>IMPAR</strong>
              </td>
              <td
                colSpan="2"
                className={`hover-highlight`}
                onClick={clickCell}
              >
                <input
                  type="radio"
                  name="ruleta"
                  hidden
                  value={"19-36"}
                />
                <strong>19-36</strong>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="d-grid gap-2 col-6 mx-auto">
          <button type="submit" class="btn btn-primary btn-lg mt-2 textura-casino">Jugar</button>
        </div>
        </form>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="d-flex flex-wrap justify-content-center py-2 mb-4 text-bg-dark">
      <div className="navbar navbar-dark bg-dark box-shadow">
        <a href="/" className="navbar-brand d-flex">
          <svg xmlns="http://www.w3.org/2000/svg" className="bi me-2" width="40" height="32" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.5 12.5a3.493 3.493 0 0 1-2.684-1.254 19.92 19.92 0 0 0 1.582 2.907c.231.35-.02.847-.438.847H6.04c-.419 0-.67-.497-.438-.847a19.919 19.919 0 0 0 1.582-2.907 3.5 3.5 0 1 1-2.538-5.743 3.5 3.5 0 1 1 6.708 0A3.5 3.5 0 1 1 11.5 12.5"/>
          </svg>
          <strong>Ruleta Americana</strong>
        </a>
      </div>
    </header>
  );
}

function MainApp() {
  return (
    <>
      <Header />
      <App />
    </>
  );
}

export default MainApp;


