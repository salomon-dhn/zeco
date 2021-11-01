// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Zeco {
  struct Record {
      uint mineTime;
      uint blockNumber;
  }
  mapping (bytes32 => Record) private docHashes;
  function addDocHash (bytes32 hash) public {
      Record memory newRecord = Record(block.timestamp, block.number);
      docHashes[hash] = newRecord;
  }
  function findDocHash (bytes32 hash) public view returns(Record memory) {
      return Record(docHashes[hash].mineTime, docHashes[hash].blockNumber);
  }
}