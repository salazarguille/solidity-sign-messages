

const networksForMocks = ["test", "_development"];

/*
 *
 * @author Guillermo Salazar <guillesalazar@gmail.com>
 * 
 */
module.exports = {
    addContractInfo: (contracts, name, address) => {
        console.log(`Deploy contract '${name.padEnd(20)}' at '${address}'.`);
        contracts.push(
            {
                "address": address,
                "contractName": name
            }
        );
    },
    addLibraryInfo: (contracts, name, address) => {
        console.log(`Deploy library '${name.padEnd(20)}' at '${address}'.`);
        contracts.push(
            {
                "address": address,
                "contractName": name
            }
        );
    },
    initialMessage: (network, accounts) => {
        const deployMocks = networksForMocks.indexOf(network) > -1;
        console.log('\n\n================================================================');
        console.log(`Starting deploy contracts in    '${network}' network.`);
        console.log(`Deploying mock contracts?:                 '${deployMocks}'`);
        
        accounts.forEach((account, index) => {
            console.log(`${account.type} -accounts[${index}]-:                       '${account.address}'.`);            
        });
        console.log('================================================================\n\n');
    },
    deployLibraries: async (deployer, contracts, libraries) => {
        for (const index in libraries) {
            const library = libraries[index];
            await deployer.deploy(library.source);
            addLibraryInfo(contracts, library.name, library.source.address);
        }
    }
}