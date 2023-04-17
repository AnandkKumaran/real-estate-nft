const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe("Real Estate", () => {
    let realEstate;
    let escrow;
    let accounts, deployer, seller, buyer;
    let nftID = 1;
    let transaction;

    let purchasePrice = ether(100);
    let escrowAmount = ether(20);
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
            purchasePrice,
            escrowAmount,
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
        let balance, transaction;
        it("Execute a successful transaction", async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);

            // Buyer deposits earnest
            transaction = await escrow.connect(buyer).depositeEarnest({ value: escrowAmount })

            // Check escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance:", ethers.utils.formatEther(balance))

            // Inspector update status
            transaction = await escrow.connect(inspector).updateInspectionStatus(true);
            await transaction.wait()
            console.log("Inspector update status ")

            // Buyer approve sale
            transaction = await escrow.connect(buyer).approveSale();
            await transaction.wait()
            console.log("Buyer approve sales")

            // Seller approve sale
            transaction = await escrow.connect(seller).approveSale();
            await transaction.wait()
            console.log("Seller approve sales")

            // Lender approve sale
            transaction = await escrow.connect(lender).approveSale();
            await transaction.wait()
            console.log("Lender approve sales")

            // Lender funds sale
            transaction = await lender.sendTransaction({
                to: escrow.address,
                value: ether(80)
            });
            await transaction.wait()
            console.log("Lender funds for sales")


            // Finalise the Sale
            transaction = await escrow.connect(buyer).finalizeSale();
            await transaction.wait();
            console.log("Buyer Finalises Sale")
            // Expect buyer to be the owner
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);

            // expect seller recieves the funds
            balance = await ethers.provider.getBalance(seller.address);
            console.log("Seller balance:", ethers.utils.formatEther(balance))
        })
    })




})