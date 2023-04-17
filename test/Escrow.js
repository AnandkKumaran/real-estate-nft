const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n)=>{
    return ethers.utils.parseUnits(n.toString(),'ether')
}

const ether = tokens

describe("Real Estate", () => {
    let realEstate;
    let escrow;
    let accounts, deployer, seller, buyer;
    let nftID = 1;
    let transaction;
    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]
        // Load contracts
        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow')

        // Deploy contracts
        realEstate = await RealEstate.deploy();
        escrow = await Escrow.deploy(
            realEstate.address,
            nftID,
            ether(100),
            ether(20),
            seller.address,
            buyer.address,
            inspector.address,
            lender.address
        );

        // Seller Approves NFT
        transaction = await realEstate.connect(seller).approve(escrow.address, nftID);
        await transaction.wait();
        console.log("Seller Approves NFT")
    })

    describe("Deployment", async () => {
        it("Sends an NFT to deployer /Seller", async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    });

    describe("Selling real estate", async () => {
        it("Execute a successful transaction", async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
            // Finalise the Sale
            transaction = await escrow.connect(buyer).finalizeSale();
            await transaction.wait();
            console.log("Buyer Finalises Sale")
            // Expect buyer to be the owner
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
        })
    })




})