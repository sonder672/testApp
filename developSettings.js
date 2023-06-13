process.env.NODE_ENV = 'development';
process.env.BLACK_DOOR = false;

process.env.BSC_API_KEY = 'YOUR API KEY';
process.env.BSC_API_PATH = 'https://api.polygonscan.com/'
// ''; // 'https://api-testnet.bscscan.com/';

process.env.BSC_RPC_PROVIDER = 'https://polygon-rpc.com'; //'https://data-seed-prebsc-1-s1.binance.org:8545/';
process.env.PRIVATE_WALLET_KEY = 'Your Wallet Secret Key';

// process.env.CONTRACT_CACENFT = '0x5da62Ca824F987aF80Ae0A8dE05f5f3c02545E89'
process.env.CONTRACT_MARKETPLACE = '0x5da62Ca824F987aF80Ae0A8dE05f5f3c02545E89';
process.env.CONTRACT_MARKETPLACE_BLOCK = 36020511;
process.env.CONTRACT_SG = '0x5019e7e495a1a030f9daa5bbb71876e61d9d5080';
process.env.CONTRACT_SG_BLOCK = 42505536;
process.env.CONTRACT_LIQUID = '0x02A19b74832d90dF8EE04249EE869fABB02C63A4';
process.env.CONTRACT_LIQUID_BLOCK =	18690586;
process.env.DEFAULT_WALLET = '0x0000000000000000000000000000000000000000';
process.env.INITIAL_BLOCK =	18690647;
require('./keystone');
