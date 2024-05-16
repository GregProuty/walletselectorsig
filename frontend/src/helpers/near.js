import * as nearAPI from 'near-api-js';
const { Near, Account, keyStores, KeyPair } = nearAPI;


// const { signedAccountId, wallet } = useStore();

export async function sign(payload, path, accountId = "gregx.tesnet", contractId = "v5.multichain-mpc-dev.testnet") {
  const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();
  const keyStore = new keyStores.InMemoryKeyStore();

  const config = {
    networkId: 'testnet',
    keyStore: keyStore,
    nodeUrl: 'https://rpc.testnet.near.org',
    walletUrl: 'https://testnet.mynearwallet.com/',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://testnet.nearblocks.io',
  };

  const near = new Near(config);
  const account = new Account(near.connection, accountId);

  console.log('myKeyStore', myKeyStore, near, account)


  const args = {
    payload,
    path,
    key_version: 0,
    rlp_payload: undefined,
  };
  let attachedDeposit = '1';
  if (process.env.NEAR_PROXY === 'true') {
    delete args.payload;
    args.rlp_payload = payload.substring(2);
    attachedDeposit = nearAPI.utils.format.parseNearAmount('1');
  } else {
    // reverse payload required by MPC contract
    payload.reverse();
  }

  console.log('using near account', accountId);
  console.log('calling near contract', contractId);
  console.log(
    'sign payload',
    payload.length > 200 ? payload.length : payload.toString(),
  );
  console.log('with path', path);
  console.log('this may take approx. 30 seconds to complete');

  let res = 'hahamike'
  console.log('contractId', contractId)
  try {
    res = await account.functionCall({
      contractId,
      methodName: 'sign',
      args,
      gas: new BN('300000000000000'),
      attachedDeposit,
    });
    console.log(res)
  } catch (e) {
    console.log('res ?????', res)

    return console.log('error signing', JSON.stringify(e));
  }


  // parse result into signature values we need r, s but we don't need first 2 bytes of r (y-parity)
  if ('SuccessValue' in (res.status)) {
    const successValue = (res.status).SuccessValue;
    const decodedValue = Buffer.from(successValue, 'base64').toString('utf-8');
    const parsedJSON = JSON.parse(decodedValue);

    return {
      r: parsedJSON[0].slice(2),
      s: parsedJSON[1],
    };
  } else {
    return console.log('error signing', JSON.stringify(res));
  }
}