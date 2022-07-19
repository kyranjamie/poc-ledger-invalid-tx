import Transport from "@ledgerhq/hw-transport-webusb";
import {
  AddressVersion,
  AnchorMode,
  makeUnsignedContractCall,
} from "@stacks/transactions";

import StacksApp from "@zondax/ledger-blockstack";
import { principalCV } from "@stacks/transactions/dist/clarity/types/principalCV";

function App() {
  async function connectLedger() {
    const transport = await Transport.create();
    return new StacksApp(transport);
  }

  const derivationPath = `m/44'/5757'/0'/0/0`;

  const invalidSignatureError = async () => {
    const app = await connectLedger();

    const resp = await app.getAddressAndPubKey(
      derivationPath,
      AddressVersion.MainnetSingleSig
    );

    const tx = await makeUnsignedContractCall({
      network: "testnet",
      anchorMode: AnchorMode.Any,
      fee: 1,
      nonce: 0,
      publicKey: resp.publicKey.toString("hex"),
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "arkadiko-liquidation-rewards-diko-v1-1",
      functionName: "random-fn-name",
      functionArgs: [
        principalCV(
          "ST2BVRBVZR9JXDT0KSQ0FXK2VVTNCARP4PPRCT5ST.wrapped-stx-token"
        ),
        principalCV("ST2BVRBVZR9JXDT0KSQ0FXK2VVTNCARP4PPRCT5ST.usda-token"),
      ],
    });

    const signatures = await app.sign(derivationPath, tx.serialize());
    console.log(signatures);
  };

  const anotherErr = async () => {
    const app = await connectLedger();

    const resp = await app.getAddressAndPubKey(
      derivationPath,
      AddressVersion.MainnetSingleSig
    );

    const tx = await makeUnsignedContractCall({
      network: "testnet",
      anchorMode: AnchorMode.Any,
      fee: 1,
      nonce: 0,
      publicKey: resp.publicKey.toString("hex"),
      contractAddress: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
      contractName: "arkadiko-liquidation-rewards-diko-v1-1",
      functionName: "random-fn-name",
      functionArgs: [
        principalCV(
          "ST2BVRBVZR9JXDT0KSQ0FXK2VVTNCARP4PPRCT5ST.wrapped-stx-token"
        ),
      ],
    });

    const signatures = await app.sign(derivationPath, tx.serialize());
    console.log(signatures);
  };

  return (
    <>
      <button type="button" onClick={invalidSignatureError}>
        Reproduce invalid signature error
      </button>
      <button type="button" onClick={anotherErr}>
        Reproduce unexpectedFieldError
      </button>
    </>
  );
}

export default App;
