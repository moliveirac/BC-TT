import React, { useEffect, useRef, useState } from "react";
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
const ruletaContract = new ethers.Contract(addresses.ruleta, abis.ruleta, defaultProvider);
const Web3Utils = require('web3-utils');
const miLista = new Array();

async function readCurrentUserFile() {
  const result = await ipfsContract.results();
  console.log({ result });
  return result;
}

function validarEsNumero(valor) {
  const numero = Number(valor);

  if (!isNaN(numero) && numero >= 0 && numero <= 37) {
    return numero
  }

  return null;
}

function getNumberColor(number) {
  const redNumbers = ['1', '3', '5', '7', '9', '12', '14', '16', '18', '19', '21', '23', '25', '27', '30', '32', '34', '36'];
  const blackNumbers = ['2', '4', '6', '8', '10', '11', '13', '15', '17', '20', '22', '24', '26', '28', '29', '31', '33', '35'];
  const greenNumbers = ['0', '00'];

  number = number.trim();

  if (redNumbers.includes(number)) {
    return 'red';
  } else if (blackNumbers.includes(number)) {
    return 'black';
  } else if (greenNumbers.includes(number)) {
    return 'green';
  }

  // Por defecto, usa el color normal
  return 'inherit';
}

function App() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [selectedCell, setSelectedCell] = useState(null);
  const [lastNumbers, setLastNumbers] = useState(""); 

  useEffect(() => {
    window.ethereum.enable();
  }, []);

  useEffect(() => {
    async function readFile() {
      const file = await readCurrentUserFile();
      if (file !== "") {
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

  async function apostar(valor, wei) {
    const ruletaWithSigner = ruletaContract.connect(defaultProvider.getSigner());
    let cond = validarEsNumero(valor);
    var premiado

    console.log(cond);

    const amountInWei = ethers.utils.parseUnits(wei.toString(), "wei");

    const options = {
      value: amountInWei,
      gasLimit: 6000000
    };
  
    if (cond != null) {

      try {
        // Llamar a la función del contrato con los parámetros necesarios
        const tx = await ruletaWithSigner.hacerApuestaNumero(cond, options);

        // Esperar a que la transacción se complete y obtener el recibo
        const respuesta = await tx.wait();

        console.log(respuesta)

        if (respuesta.logs.length == 1) {

          premiado = Web3Utils.hexToNumberString(respuesta.logs[0].data);

          if (premiado == "37"){
            premiado = "00"
          }

          alert(`HAS PERDIDO... EL RESULTADO FINAL FUE ${premiado}.`)
        } else if (respuesta.logs.length == 2) {
          const premio = Number(wei) * 2

          premiado = Web3Utils.hexToNumberString(respuesta.logs[1].data);

          if (premiado == "37"){
            premiado = "00"
          }

          alert(`HAS GANADO! EL RESULTADO FINAL FUE ${premiado} Y TU PREMIO ES DE ${premio} wei.`)
        }

        console.log("Apuesta realizada con éxito:", tx);
      } catch (error) {
        console.error("Error al realizar la apuesta:", error);
        throw "Roulette can not afford to pay if you win! Please, try with less money."
      }

    } else {
      if (valor == "PAR" || valor == "IMPAR") {
        try {
          // Llamar a la función del contrato con los parámetros necesarios
          const tx = await ruletaWithSigner.hacerApuestaParidad(+(valor == "IMPAR"), options);
  
          // Esperar a que la transacción se complete y obtener el recibo
          const respuesta = await tx.wait();

          console.log(respuesta)

          if (respuesta.logs.length == 1) {

            premiado = Web3Utils.hexToNumberString(respuesta.logs[0].data);

            if (premiado == "37"){
              premiado = "00"
            }

            alert(`HAS PERDIDO... EL RESULTADO FINAL FUE ${premiado}.`)
          } else if (respuesta.logs.length == 2) {
            const premio = Number(wei) * 2

            premiado = Web3Utils.hexToNumberString(respuesta.logs[1].data);

            if (premiado == "37"){
              premiado = "00"
            }

            alert(`HAS GANADO! EL RESULTADO FINAL FUE ${premiado} Y TU PREMIO ES DE ${premio} wei.`)
          }
  
          console.log("Apuesta realizada con éxito:", tx);
        } catch (error) {
          console.error("Error al realizar la apuesta:", error);
          throw "Roulette can not afford to pay if you win! Please, try with less money."
        }

      } else if (valor == "1a docena" || valor == "2a docena" || valor == "3a docena") {
        try {
          if (valor == "3a docena") {
            valor = 2
          } else {
            valor = +(valor == "2a docena")
          }
  
          // Llamar a la función del contrato con los parámetros necesarios
          const tx = await ruletaWithSigner.hacerApuestaDocena(valor, options);
  
          // Esperar a que la transacción se complete y obtener el recibo
          const respuesta = await tx.wait();

          console.log(respuesta)

          if (respuesta.logs.length == 1) {

            premiado = Web3Utils.hexToNumberString(respuesta.logs[0].data);

            if (premiado == "37"){
              premiado = "00"
            }

            alert(`HAS PERDIDO... EL RESULTADO FINAL FUE ${premiado}.`)
          } else if (respuesta.logs.length == 2) {
            const premio = Number(wei) * 3

            premiado = Web3Utils.hexToNumberString(respuesta.logs[1].data);

            if (premiado == "37"){
              premiado = "00"
            }

            alert(`HAS GANADO! EL RESULTADO FINAL FUE ${premiado} Y TU PREMIO ES DE ${premio} wei.`)
          }
  
          console.log("Apuesta realizada con éxito:", tx);
        } catch (error) {
          console.error("Error al realizar la apuesta:", error);
          throw "Roulette can not afford to pay if you win! Please, try with less money."
        }

      } else if (valor == "Rojo" || valor == "Negro") {
        try {
          console.log(+(valor == "Negro"))
          // Llamar a la función del contrato con los parámetros necesarios
          const tx = await ruletaWithSigner.hacerApuestaColor(+(valor == "Negro"), options);
  
          // Esperar a que la transacción se complete y obtener el recibo
          const respuesta = await tx.wait();

          console.log(respuesta)

          if (respuesta.logs.length == 1) {

            premiado = Web3Utils.hexToNumberString(respuesta.logs[0].data);

            if (premiado == "37"){
              premiado = "00"
            }

            alert(`HAS PERDIDO... EL RESULTADO FINAL FUE ${premiado}.`)
          } else if (respuesta.logs.length == 2) {
            const premio = Number(wei) * 2

            premiado = Web3Utils.hexToNumberString(respuesta.logs[1].data);

            if (premiado == "37"){
              premiado = "00"
            }

            alert(`HAS GANADO! EL RESULTADO FINAL FUE ${premiado} Y TU PREMIO ES DE ${premio} wei.`)
          }
  
          console.log("Apuesta realizada con éxito:", tx);
        } catch (error) {
          console.error("Error al realizar la apuesta:", error);
          throw "Roulette can not afford to pay if you win! Please, try with less money."
        }

      }
    }

    const file = await readCurrentUserFile();
    
    if (file != "") {
      await readFileContent(file)
    }
    let numbersArray;
    numbersArray = lastNumbers.split(',').map(String);

    while (numbersArray.length >= 15) {
      numbersArray.shift(); 
    }

    submitResult(numbersArray + ',' + premiado);
  }

  async function readFileContent(hash) {
    try {
      const client = await create('/ip4/0.0.0.0/tcp/5001');
      const generator = client.cat(hash);
      let numbersArray;
      let data = "";
      for await (const chunk of generator) {
        data += Buffer.from(chunk).toString();
        numbersArray = data.split(',').map(Number);
      }
  
      //if (numbersArray.length > 6) {
        //numbersArray.shift(); 
      //}

      const formattedNumbers = numbersArray.join(', ');

      setLastNumbers(formattedNumbers);

    } catch (error) {
      console.error("Error reading file content:", error);
    }
  }

  async function submitResult(resultadosFile) {
    try {
      console.log(resultadosFile); // Muestra el contenido del archivo en la consola
      const client = await create('/ip4/0.0.0.0/tcp/5001');
      const result = await client.add(resultadosFile);
      await client.files.cp(`/ipfs/${result.cid}`, `/${result.cid}`);
      console.log(result.cid);
      await setFileIPFS(result.cid.toString());
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleRoulette = (e) => {
    const logoElement = document.getElementById('logo');
    if (e==1){
      logoElement.className="App-logo-fast mb-3"
    } else {
      logoElement.className="App-logo mb-3"
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

  const clickCell = (event) => {
    const cell = event.target;
    const radio = cell.querySelector('input');
    
  
    if (radio) {
      const selected = document.querySelectorAll(".hover-forever");
  
      if (radio.checked) {
        handleRoulette(0);
        cell.classList.remove("hover-forever");
      } else {
        handleRoulette(1);
        selected.forEach((item) => item.classList.remove("hover-forever"));
        cell.classList.add("hover-forever");
      }
  
      radio.checked = !radio.checked; // Cambiar el estado del radio
    }
  };

  const handlePlay = async (e) => {
    e.preventDefault();

    const botonRuleta = document.getElementById("playButton");
    console.log(botonRuleta)

    try {
      botonRuleta.disabled = true;

      alert(`Seleccionaste el radio: ${e.target.ruleta.value}, y la cantidad apostada son: ${e.target.weis.value} weis.\nProcesando tu apuesta, espera un momento...`);

      await apostar(e.target.ruleta.value, e.target.weis.value);

    } catch (error) {
      console.error('Error al realizar la apuesta:', error);
      alert(`Algo fue mal con la transacción. Por favor, inténtalo de nuevo.`)
    } finally {
      botonRuleta.disabled = false;
    }
  }
  

  return (
    <div className="container">
      <div className="row w-100 mx-auto">
        <div className="col">
          <div className="alert alert-success">
            <strong>Últimos números ganadores:</strong> {
              lastNumbers.split(',').map((number, index, array) => (
                <span key={index} style={{ color: getNumberColor(number) }}>
                  {number}
                  {index < array.length - 1 && ', '}
                </span>
              ))
            }
          </div>
        </div>
      </div>
      <div className="App">
        <img src={logo} id="logo" className="App-logo mb-3" alt="Ruleta" />
        <form onSubmit={handlePlay}>
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
                  colSpan="4"
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
                  colSpan="4"
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
              </tr>
            </tbody>
          </table>
          <div className="d-grid gap-2 col-6 mx-auto">
            <div className="form-group">
              <label style={{color: "#FFFFFF"}} htmlFor="inputNumber">Cantidad</label>
              <input type="number" name="weis" className="form-control" min="1" pattern="\d+(\.\d{10})?" max="5" aria-describedby="numberHelp" placeholder="Introduce cantidad"/>
            </div>
            <button id="playButton" type="submit" className="btn btn-primary btn-lg mt-2 mb-3 textura-casino">Jugar</button>
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


