const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("BankAccount", function () {
    async function deployBankAccount() {
        const [addr0, addr1, addr2, addr3, addr4] = await ethers.getSigners();

        const BankAccount = await ethers.getContractFactory("BankAccount");
        const bankAccount = await BankAccount.deploy();

        return { bankAccount, addr0, addr1, addr2, addr3, addr4 };
    }

    async function deployBankAccountWithAccounts(
        owners = 1,
        deposit = 0,
        withdrawAmounts = []
    ) {
        const { bankAccount, addr0, addr1, addr2, addr3, addr4 } =
            await loadFixture(deployBankAccount);
        let addresses = [];

        const availableOwners = [addr1, addr2, addr3, addr4];

        for (let i = 0; i < owners-1; i++) {
            addresses.push(availableOwners[i].address);
        }

        await bankAccount.connect(addr0).createAccount(addresses);

        if (deposit > 0) {
            await bankAccount
                .connect(addr0)
                .deposit(0, { value: deposit.toString() });
        }

        for (const withdrawAmount of withdrawAmounts) {
            await bankAccount.connect(addr0).requestWithdraw(0, withdrawAmount);
        }

        return { bankAccount, addr0, addr1, addr2, addr3, addr4 };
    }

    describe("Deployment", function() {
        it("Should deploy without error", async function () {
            await loadFixture(deployBankAccount);
        });
    });

    describe("Create account", function() {
        it("Should allow creating a single user account", async function() {
            const { bankAccount, addr0 } = await loadFixture(deployBankAccount);
            await bankAccount.connect(addr0).createAccount([]);
            const accounts = await bankAccount.connect(addr0).getAccounts();
            expect(accounts.length).to.equal(1);
        });

        it("Should allow creating a double user account", async function() {
            const { bankAccount, addr0, addr1 } = await loadFixture(deployBankAccount);
            await bankAccount.connect(addr0).createAccount([addr1.address]);

            const accounts0 = await bankAccount.connect(addr0).getAccounts();
            expect(accounts0.length).to.equal(1);

            const accounts1 = await bankAccount.connect(addr1).getAccounts();
            expect(accounts1.length).to.equal(1);
        });

        it("Should allow creating a triple user account", async function() {
            const { bankAccount, addr0, addr1, addr2 } = await loadFixture(deployBankAccount);
            await bankAccount.connect(addr0).createAccount([addr1.address, addr2.address]);

            const accounts0 = await bankAccount.connect(addr0).getAccounts();
            expect(accounts0.length).to.equal(1);

            const accounts1 = await bankAccount.connect(addr1).getAccounts();
            expect(accounts1.length).to.equal(1);

            const accounts2 = await bankAccount.connect(addr2).getAccounts();
            expect(accounts2.length).to.equal(1);
        });

        it("Should allow creating a quad user account", async function() {
            const { bankAccount, addr0, addr1, addr2, addr3 } = await loadFixture(deployBankAccount);
            await bankAccount.connect(addr0).createAccount([addr1.address, addr2.address, addr3.address]);

            const accounts0 = await bankAccount.connect(addr0).getAccounts();
            expect(accounts0.length).to.equal(1);

            const accounts1 = await bankAccount.connect(addr1).getAccounts();
            expect(accounts1.length).to.equal(1);

            const accounts2 = await bankAccount.connect(addr2).getAccounts();
            expect(accounts2.length).to.equal(1);

            const accounts3 = await bankAccount.connect(addr3).getAccounts();
            expect(accounts3.length).to.equal(1);
        });

        it("Should not allow creating an account with duplicate owners", async function() {
            const { bankAccount, addr0 } = await loadFixture(deployBankAccount);
            await expect(bankAccount.connect(addr0).createAccount([addr0.address])).to.be.reverted;
        });

        it("Should not allow creating an account with more than 4 owners", async function() {
            const { bankAccount, addr0, addr1, addr2, addr3, addr4 } = await loadFixture(deployBankAccount);
            await expect(bankAccount.connect(addr0).createAccount([addr1.address, addr2.address, addr3.address, addr4.address])).to.be.reverted;
        });
    });

    describe("Despositing", function() {
        it("should allow deposit from account owner", async function() {
            const { bankAccount, addr0 } = await deployBankAccountWithAccounts(1);
            await expect(
                bankAccount.connect(addr0).deposit(0, { value: "100" })
            ).to.changeEtherBalances([bankAccount, addr0], ["100", "-100"]);
        });

        it("should NOT allow deposit from non-account owner", async function() {
            const { bankAccount, addr1 } = await deployBankAccountWithAccounts(1);
            await expect(bankAccount.connect(addr1).deposit(0, { value: "100" })).to
                .be.reverted;
        });
    });

    describe("Withdraw", function() {
        describe("Request a withdraw", function() {
            it("account owner can request withdraw", async function() {
                const { bankAccount, addr0 } = await deployBankAccountWithAccounts(
                    1,
                    100
                );
                await bankAccount.connect(addr0).requestWithdraw(0, 100);
            });

            it("account owner can not request withdraw with invalid amount", async function() {
                const { bankAccount, addr0 } = await deployBankAccountWithAccounts(
                    1,
                    100
                );
                await expect(bankAccount.connect(addr0).requestWithdraw(0, 101)).to.be
                    .reverted;
            });

            it("non-account owner cannot request withdraw", async function() {
                const { bankAccount, addr1 } = await deployBankAccountWithAccounts(
                    1,
                    100
                );
                await expect(bankAccount.connect(addr1).requestWithdraw(0, 90)).to.be
                    .reverted;
            });

            it("non-account owner cannot request withdraw", async function() {
                const { bankAccount, addr0 } = await deployBankAccountWithAccounts(
                    1,
                    100
                );
                await bankAccount.connect(addr0).requestWithdraw(0, 90);
                await bankAccount.connect(addr0).requestWithdraw(0, 10);
            });
        });

        describe("Approve a withdraw", () => {
            it("should allow account owner to approve withdraw", async function() {
                const { bankAccount, addr0, addr1 } = await deployBankAccountWithAccounts(
                    2,
                    100,
                    [100]
                );
                await bankAccount.connect(addr1).approveWithdraw(0, 0);
                expect(await bankAccount.getApprovals(0, 0)).to.equal(1);
            });

            it("should not allow non-account owner to approve withdraw", async function() {
                const { bankAccount, addr2 } = await deployBankAccountWithAccounts(
                    2,
                    100,
                    [100]
                );
                await expect(bankAccount.connect(addr2).approveWithdraw(0, 0)).to.be
                    .reverted;
            });

            it("should not allow owner to approve withdrawl multiple times", async function() {
                const { bankAccount, addr1 } = await deployBankAccountWithAccounts(
                    2,
                    100,
                    [100]
                );
                bankAccount.connect(addr1).approveWithdraw(0, 0);
                await expect(bankAccount.connect(addr1).approveWithdraw(0, 0)).to.be
                    .reverted;
            });

            it("should not allow creator of request to approve request", async function() {
                const { bankAccount, addr0 } = await deployBankAccountWithAccounts(
                    2,
                    100,
                    [100]
                );
                await expect(bankAccount.connect(addr0).approveWithdraw(0, 0)).to.be
                    .reverted;
            });
        });

        describe("Make withdraw", () => {
            it("should allow creator of request to withdraw approved request", async function() {
                const { bankAccount, addr0, addr1 } =
                    await deployBankAccountWithAccounts(2, 100, [100]);
                await bankAccount.connect(addr1).approveWithdraw(0, 0);
                await expect(
                    bankAccount.connect(addr0).withdraw(0, 0)
                ).to.changeEtherBalances([bankAccount, addr0], ["-100", "100"]);
            });

            it("should not allow creator of request to withdraw approved request twice", async function() {
                const { bankAccount, addr0, addr1 } =
                    await deployBankAccountWithAccounts(2, 200, [100]);
                await bankAccount.connect(addr1).approveWithdraw(0, 0);
                await expect(
                    bankAccount.connect(addr0).withdraw(0, 0)
                ).to.changeEtherBalances([bankAccount, addr0], ["-100", "100"]);
                await expect(bankAccount.connect(addr0).withdraw(0, 0)).to.be.reverted;
            });

            it("should not allow non-creator of request to withdraw approved request ", async function() {
                const { bankAccount, addr1 } = await deployBankAccountWithAccounts(
                    2,
                    200,
                    [100]
                );
                await bankAccount.connect(addr1).approveWithdraw(0, 0);
                await expect(bankAccount.connect(addr1).withdraw(0, 0)).to.be.reverted;
            });

            it("should not allow non-creator of request to withdraw approved request ", async function() {
                const { bankAccount, addr0 } = await deployBankAccountWithAccounts(
                    2,
                    200,
                    [100]
                );
                await expect(bankAccount.connect(addr0).withdraw(0, 0)).to.be.reverted;
            });
        });
    });
});
