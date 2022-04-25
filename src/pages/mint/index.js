import 'regenerator-runtime/runtime'
import React, {useEffect} from 'react'

import getConfig from '../../config'
import NFT from "../../components/NFT";
import BN from "bn.js";
import './index.css'
import {logout} from "../../utils/utils";

const {networkId} = getConfig(process.env.NODE_ENV || 'development')

export default function Mint() {
    // when the user has not yet interacted with the form, disable the button
    const [buttonDisabled, setButtonDisabled] = React.useState(true)
    const [userHasNFT, setUserHasNFT] = React.useState(false)

    // after submitting the form, we want to show Notification
    const [showNotification, setShowNotification] = React.useState(false)

    useEffect(() => {
        const receivedNFT = async () => {
            const userTokens = await window.contract.nft_tokens()

            const hasNFT = userTokens.some(token => token.token_id === `${window.accountId}-tanya-go-verse-token-5`)

            if (window.accountId !== "") {
                console.log(
                    hasNFT
                );

                setUserHasNFT(
                    hasNFT
                );
            }
        };
        receivedNFT();
    }, []);

    const mintNFT = async () => {
        console.log('window.accountId', window.accountId);
        await window.contract.nft_mint(
            {
                receiver_id: window.accountId,
                token_id: `${window.accountId}-tanya-go-verse-token-5`,
                metadata: {
                    title: "Support Ukraine NFT",
                    description: "Support Ukraine NFT with verse of Tanya GO Kharkiv poetess who run from war and left her home...",
                    media: "https://ipfs.io/ipfs/bafkreihfkpgxnj2qbn7s46qmocqjrslbirarzsb3kx34g7bissojrcnl5q",
                },
            },
            // {
            //     token_id: `${window.accountId}-tanya-go-verse-token`,
            //     metadata: {
            //         title: "Support Ukraine NFT",
            //         description: "Support Ukraine NFT with verse of Tanya GO Kharkiv poetess who run from war and left her home...",
            //         media: "https://ipfs.io/ipfs/bafkreihfkpgxnj2qbn7s46qmocqjrslbirarzsb3kx34g7bissojrcnl5q",
            //     },
            //     receiver_id: window.accountId,
            // },
            300000000000000, // attached GAS (optional)
            new BN("1000000000000000000000000")
        );
    };

    return (
        <>
            <header className="header">
                <button
                    className="link"
                    style={{float: 'right'}}
                    onClick={logout}
                >
                    Sign out
                </button>
            </header>
            <main className="main">
                <NFT />
                <div className="mint-button">
                    <button disabled={userHasNFT} onClick={mintNFT}>Mint</button>
                </div>
                {/*<h1>*/}
                {/*  <label*/}
                {/*    htmlFor="greeting"*/}
                {/*    style={{*/}
                {/*      color: 'var(--secondary)',*/}
                {/*      borderBottom: '2px solid var(--secondary)'*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    {greeting}*/}
                {/*  </label>*/}
                {/*  {' '/* React trims whitespace around tags; insert literal space character when needed *!/*/}
                {/*  {window.accountId}!*/}
                {/*</h1>*/}
                {/*<form onSubmit={async event => {*/}
                {/*  event.preventDefault()*/}

                {/*  // get elements from the form using their id attribute*/}
                {/*  const { fieldset, greeting } = event.target.elements*/}

                {/*  // hold onto new user-entered value from React's SynthenticEvent for use after `await` call*/}
                {/*  const newGreeting = greeting.value*/}

                {/*  // disable the form while the value gets updated on-chain*/}
                {/*  fieldset.disabled = true*/}

                {/*  try {*/}
                {/*    // make an update call to the smart contract*/}
                {/*    await window.contract.set_greeting({*/}
                {/*      // pass the value that the user entered in the greeting field*/}
                {/*      message: newGreeting*/}
                {/*    })*/}
                {/*  } catch (e) {*/}
                {/*    alert(*/}
                {/*      'Something went wrong! ' +*/}
                {/*      'Maybe you need to sign out and back in? ' +*/}
                {/*      'Check your browser console for more info.'*/}
                {/*    )*/}
                {/*    throw e*/}
                {/*  } finally {*/}
                {/*    // re-enable the form, whether the call succeeded or failed*/}
                {/*    fieldset.disabled = false*/}
                {/*  }*/}

                {/*  // update local `greeting` variable to match persisted value*/}
                {/*  set_greeting(newGreeting)*/}

                {/*  // show Notification*/}
                {/*  setShowNotification(true)*/}

                {/*  // remove Notification again after css animation completes*/}
                {/*  // this allows it to be shown again next time the form is submitted*/}
                {/*  setTimeout(() => {*/}
                {/*    setShowNotification(false)*/}
                {/*  }, 11000)*/}
                {/*}}>*/}
                {/*  <fieldset id="fieldset">*/}
                {/*    <label*/}
                {/*      htmlFor="greeting"*/}
                {/*      style={{*/}
                {/*        display: 'block',*/}
                {/*        color: 'var(--gray)',*/}
                {/*        marginBottom: '0.5em'*/}
                {/*      }}*/}
                {/*    >*/}
                {/*      Change greeting*/}
                {/*    </label>*/}
                {/*    <div style={{ display: 'flex' }}>*/}
                {/*      <input*/}
                {/*        autoComplete="off"*/}
                {/*        defaultValue={greeting}*/}
                {/*        id="greeting"*/}
                {/*        onChange={e => setButtonDisabled(e.target.value === greeting)}*/}
                {/*        style={{ flex: 1 }}*/}
                {/*      />*/}
                {/*      <button*/}
                {/*        disabled={buttonDisabled}*/}
                {/*        style={{ borderRadius: '0 5px 5px 0' }}*/}
                {/*      >*/}
                {/*        Save*/}
                {/*      </button>*/}
                {/*    </div>*/}
                {/*  </fieldset>*/}
                {/*</form>*/}
            </main>
            {showNotification && <Notification />}
        </>
    )
}

// this component gets rendered by App after the form is submitted
function Notification() {
    const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
    return (
        <aside>
            <a
                target="_blank"
                rel="noreferrer"
                href={`${urlPrefix}/${window.accountId}`}
            >
                {window.accountId}
            </a>
            {' '/* React trims whitespace around tags; insert literal space character when needed */}
            called method: 'set_greeting' in contract:
            {' '}
            <a
                target="_blank"
                rel="noreferrer"
                href={`${urlPrefix}/${window.contract.contractId}`}
            >
                {window.contract.contractId}
            </a>
            <footer>
                <div>✔ Succeeded</div>
                <div>Just now</div>
            </footer>
        </aside>
    )
}
