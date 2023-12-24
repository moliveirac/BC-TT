// SPDX-License-Identifier: MIT

pragma solidity ^0.8.3;

// guardar el hash de los datos enviados por el usuario

contract IpfsStorage {

    string public results;


    function setFileIPFS(string memory file) external {
        results = file;
    }
}
