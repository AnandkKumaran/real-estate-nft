//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _nftID) external;
}

contract Escrow {
    address public nft_address;
    uint256 public nftID;
    uint256 public purchasePrice;
    uint256 public escrowAmount;
    address payable public seller;
    address payable public buyer;
    address public inspector;
    address public lender;

    constructor(
        address _nft_address,
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address payable _seller,
        address payable _buyer,
        address _inspector,
        address _lender
    ) {
        nft_address = _nft_address;
        nftID = _nftID;
        seller = _seller;
        buyer = _buyer;
        purchasePrice = _purchasePrice;
        escrowAmount = _escrowAmount;
        inspector = _inspector;
        lender = _lender;
    }

    function depositeEarnest()  public payable {
        
    }
    // Transfer ownership of property
    function finalizeSale() public {
        IERC721(nft_address).transferFrom(seller, buyer, nftID);
    }
}
