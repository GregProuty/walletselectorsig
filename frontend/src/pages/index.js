import Image from "next/image";
import NearLogo from "/public/near.svg";
import NextLogo from "/public/next.svg";
import { useStore } from "@/layout";

// import { sign } from '../helpers/near'
import { generateAddress } from '../helpers/kdf'
import styles from "@/styles/app.module.css";
import {
  DocsCard,
  HelloComponentsCard,
  HelloNearCard,
} from "@/components/cards";
import bitcoin from '../helpers/bitcoin'
import { useEffect } from 'react'

export default function Home() {
  const { signedAccountId, wallet } = useStore();

  console.log('signedAccountId', signedAccountId)
  useEffect(() => {
    const asyncfunc = async () => {
      const struct = await generateAddress(
        'secp256k1:4HFcTSodRLVCGNVcGc4Mf2fwBBBxv9jxkGdiW2S2CA1y6UpVVRWKj6RX7d7TDt65k2Bj3w9FU4BGtt43ZvuhCnNt',
        signedAccountId,
        'bitcoin,1',
        'bitcoin'
      )
      console.log('{ address, publicKey }', struct)

      const response = await bitcoin.send({
        from: struct.address,
        publicKey: struct.publicKey,
      })
      // const response = await bitcoin.getBalance({
      //   address: struct.address,
      // })
      console.log('response', response)
    }
    asyncfunc()
  }, [])
  return (
    <main className={styles.main}>
      <div className={styles.description}> </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src={NearLogo}
          alt="NEAR Logo"
          width={110 * 1.5}
          height={28 * 1.5}
          priority
        />
        <h3 className="ms-2 me-3 text-dark"> + </h3>
        <Image
          className={styles.logo}
          src={NextLogo}
          alt="Next.js Logo"
          width={300 * 0.58}
          height={61 * 0.58}
          priority
        />
      </div>

      <div className={styles.grid}>
        <HelloComponentsCard />
        <HelloNearCard />
        <DocsCard />
      </div>
    </main>
  );
}