import { BrowserProvider, Contract, parseUnits } from 'ethers';

export const BASE_CHAIN_ID = '0x2105';
export const BASE_CHAIN_ID_DECIMAL = 8453;
export const BASE_USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const PAYMENT_RECIPIENT = '0x54617d7FD600293FA8CdddB408987168732bED88';
export const PAYMENT_USDC = '43';

const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
];

type EthereumProvider = { request(args: { method: string; params?: unknown[] }): Promise<unknown> };

export async function requestBaseUsdcPayment(provider: EthereumProvider) {
  const browserProvider = new BrowserProvider(provider as never);
  const network = await browserProvider.getNetwork();
  if (Number(network.chainId) !== BASE_CHAIN_ID_DECIMAL) {
    throw new Error('Switch your wallet to Base Mainnet before paying.');
  }

  const signer = await browserProvider.getSigner();
  const sender = await signer.getAddress();
  const token = new Contract(BASE_USDC, ERC20_ABI, signer);
  const amount = parseUnits(PAYMENT_USDC, 6);
  const transaction = await token.transfer(PAYMENT_RECIPIENT, amount);
  const receipt = await transaction.wait();

  return {
    hash: transaction.hash as string,
    sender,
    recipient: PAYMENT_RECIPIENT,
    amount: PAYMENT_USDC,
    chainId: BASE_CHAIN_ID_DECIMAL,
    blockNumber: receipt?.blockNumber as number | undefined,
  };
}

export async function switchToBase(provider: EthereumProvider) {
  try {
    await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_CHAIN_ID }] });
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;
    if (code !== 4902) throw error;
    await provider.request({ method: 'wallet_addEthereumChain', params: [{
      chainId: BASE_CHAIN_ID,
      chainName: 'Base Mainnet',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: ['https://basescan.org'],
    }] });
  }
}
