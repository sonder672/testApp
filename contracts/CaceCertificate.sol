// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CACENFT is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable {
    
    // Data Structures
    //   wallet -> curso -> minted   
    mapping(address=>mapping(uint=>bool)) eventUser;

    
    // Counters
    using Counters for Counters.Counter;

    uint256[] private _eventIds;
    Counters.Counter private _tokenIdCounter;

    // Events
    event tokenMinted(uint _TokenId, string _NftURI);
    event changedTokenURI(uint _TokenId, string _newUri);
    constructor()ERC721("Camara Argentina de Comercio Electronico","CACENFT"){
        _eventIds.push(1);
        _eventIds.push(2);
        _tokenIdCounter.increment();
    }

    function createEvent(uint _id) public onlyOwner{
        require(!checkEventExists(_id),"Event Already Exists");
        _eventIds.push(_id);
    }

    function getLastEvent() public view returns(uint _LastEvent){
        return _eventIds[_eventIds.length - 1];
    }

    function checkEventExists(uint _id) public view returns(bool exists){
        for(uint i = 0; i < _eventIds.length; i++){
            if(_eventIds[i] == _id)
                return true;
        }
        return false;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(uint _id,address _wallet,string memory _uri) public onlyOwner {
        require(checkEventExists(_id),"Event doesn't exists");
        require(!eventUser[_wallet][_id],"Wallet already minted in the event");
        require(bytes(_uri).length > 0, "Empty uri");
        _safeMint(_wallet,_tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(),_uri);
        eventUser[_wallet][_id] = true;
        uint nftMinted = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        emit tokenMinted(nftMinted,_uri);
    }

    modifier ownerOrAdmin(uint _id){
        require(_msgSender() == ownerOf(_id) || _msgSender() == owner(),"Only Token Owner Or Admin can change the URL");
        _;
    }

    function setTokenURI(uint _tokenId,string memory _uri) public ownerOrAdmin(_tokenId){
        require(bytes(_uri).length > 0, "URL Empty!");
        _setTokenURI(_tokenId,_uri);
        emit changedTokenURI(_tokenId,_uri);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}