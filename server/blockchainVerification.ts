import { JsonRpcProvider, getAddress, id, Interface } from 'ethers';

export const BASE_CHAIN_ID = 8453;
export const BASE_USDC = getAddress('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
export const PAYMENT_RECIPIENT = getAddress('0x54617d7FD600293FA8CdddB408987168732bED88');
export const REQUIRED_USDC_UNITS = 43_000_000n;

const TRANSFER_TOPIC = id('Transfer(address,address,uint256)');
const transferInterface = new Interface(['event Transfer(address indexed from, address indexed to, uint256 value)']);

export type VerifiedPayment = {
  hash: string;
  sender: string;
  recipient: string;
  amountUnits: string;
  blockNumber: number;
};

export async function verifyBaseUsdcPayment(hash: string, expectedSender?: string): Promise<VerifiedPayment> {
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) throw new Error('Invalid transaction hash.');

  const provider = new JsonRpcProvider(process.env.BASE_RPC_URL || 'https://mainnet.base.org', BASE_CHAIN_ID);
  const [transaction, receipt] = await Promise.all([
    provider.getTransaction(hash),
    provider.getTransactionReceipt(hash),
  ]);

  if (!transaction || !receipt || receipt.status !== 1) throw new Error('Transaction is missing or failed.');
  if (expectedSender && getAddress(transaction.from) !== getAddress(expectedSender)) {
    throw new Error('Transaction sender does not match the connected wallet.');
  }

  for (const log of receipt.logs) {
    if (getAddress(log.address) !== BASE_USDC || log.topics[0] !== TRANSFER_TOPIC) continue;
    const parsed = transferInterface.parseLog({ topics: [...log.topics], data: log.data });
    if (!parsed) continue;

    const recipient = getAddress(parsed.args.to as string);
    const amount = parsed.args.value as bigint;
    if (recipient === PAYMENT_RECIPIENT && amount >= REQUIRED_USDC_UNITS) {
      return {
        hash,
        sender: getAddress(parsed.args.from as string),
        recipient,
        amountUnits: amount.toString(),
        blockNumber: receipt.blockNumber,
      };
    }
  }

  throw new Error('No qualifying 43 USDC transfer to the configured Base recipient was found.');
}
