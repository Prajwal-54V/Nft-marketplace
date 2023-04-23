// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {

    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales 
    uint public itemCount; 

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );
    event Relisted(
        uint itemId,
        address indexed seller,
        uint newPrice
    );

    event Test(
        uint tokenId,
        uint itemId
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
          require(_nft.ownerOf(_tokenId) == msg.sender, "not the token owner");
         require(
            _nft.isApprovedForAll(msg.sender, address(this)) || 
            _nft.getApproved(_tokenId) == address(this),
            "not approved for marketplace"
        );
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount ++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        // emit Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and market fee");
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought events
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    function relistItem(IERC721 _nft,uint _itemId,uint _tokenId, uint _newPrice) external  nonReentrant {
        require(_itemId > 0 && _itemId <= itemCount, "Item doesn't exist");
        Item storage item = items[_itemId];
        require(_nft.ownerOf(_tokenId) == msg.sender, "not the token owner");
        require(item.sold, "Item is not sold");
        require(_newPrice > 0, "Price must be greater than zero");
        item.seller = payable( msg.sender) ;
        item.price = _newPrice; 
        item.sold = false;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        emit Relisted(_itemId,  msg.sender, _newPrice);
    }

    function getTotalPrice(uint _itemId) view public returns(uint){
        return((items[_itemId].price*(100 + feePercent))/100);
    }
    function isItemSold(uint _itemID)view public returns(bool){
        return(items[_itemID].sold);
    }
    // * receive function
    receive() external payable {}

    // * fallback function
    fallback() external payable {}
}
