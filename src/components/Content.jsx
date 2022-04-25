import React, { Fragment, useCallback, useEffect, useState } from "react";
import { providers, utils } from "near-api-js";
import { useWalletSelector } from "../contexts/WalletSelectorContext";
import SignIn from "./SignIn";
import Form from "./Form";
import Messages from "./Messages";

const SUGGESTED_DONATION = "0";
const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003");

const Content= () => {
  const { selector, accounts, accountId, setAccountId } = useWalletSelector();
  const [account, setAccount] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAccount = useCallback(async () => {
    if (!accountId) {
      return null;
    }

    const { nodeUrl } = selector.network;
    const provider = new providers.JsonRpcProvider({ url: nodeUrl });

    return provider
      .query({
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      })
      .then((data) => ({
        ...data,
        account_id: accountId,
      }));
  }, [accountId, selector.network]);

  const getMessages = useCallback(() => {
    const provider = new providers.JsonRpcProvider({
      url: selector.network.nodeUrl,
    });

    return provider
      .query({
        request_type: "call_function",
        account_id: selector.getContractId(),
        method_name: "get_messages",
        args_base64: "",
        finality: "optimistic",
      })
      .then((res) => JSON.parse(Buffer.from(res.result).toString()));
  }, [selector]);

  useEffect(() => {
    getMessages().then(setMessages);
  }, []);

  useEffect(() => {
    if (!accountId) {
      return setAccount(null);
    }

    setLoading(true);

    getAccount().then((nextAccount) => {
      setAccount(nextAccount);
      setLoading(false);
    });
  }, [accountId, getAccount]);

  const handleSignIn = () => {
    selector.show();
  };

  const handleSignOut = () => {
    selector.signOut().catch((err) => {
      console.log("Failed to sign out");
      console.error(err);
    });
  };

  const handleSwitchProvider = () => {
    selector.show();
  };

  const handleSwitchAccount = () => {
    const currentIndex = accounts.findIndex((x) => x.accountId === accountId);
    const nextIndex = currentIndex < accounts.length - 1 ? currentIndex + 1 : 0;

    const nextAccountId = accounts[nextIndex].accountId;

    setAccountId(nextAccountId);
    alert("Switched account to " + nextAccountId);
  };

  // const handleSendMultipleTransactions = () => {
  //   selector.signAndSendTransactions({
  //     transactions: [
  //       {
  //         // Deploy your own version of https://github.com/near-examples/rust-counter using Gitpod to get a valid receiverId.
  //         receiverId: "dev-1648806797290-14624341764914",
  //         actions: [
  //           {
  //             type: "FunctionCall",
  //             params: {
  //               methodName: "increment",
  //               args: {},
  //               gas: BOATLOAD_OF_GAS,
  //               deposit: utils.format.parseNearAmount("0"),
  //             },
  //           },
  //         ],
  //       },
  //       {
  //         receiverId: selector.getContractId(),
  //         actions: [
  //           {
  //             type: "FunctionCall",
  //             params: {
  //               methodName: "methodName",
  //               args: { text: "Hello World!" },
  //               gas: BOATLOAD_OF_GAS,
  //               deposit: utils.format.parseNearAmount("0"),
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   });
  // };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const { fieldset, message, donation } = e.target.elements;

      fieldset.disabled = true;

      selector
        .signAndSendTransaction({
          signerId: accountId,
          actions: [
            {
              type: "FunctionCall",
              params: {
                methodName: "add_message",
                args: { message: message.value },
                gas: BOATLOAD_OF_GAS,
                deposit: utils.format.parseNearAmount(donation.value || "0"),
              },
            },
          ],
        })
        .catch((err) => {
          alert("Failed to add message");
          console.log("Failed to add message");

          throw err;
        })
        .then(() => {
          return getMessages()
            .then((nextMessages) => {
              setMessages(nextMessages);
              message.value = "";
              donation.value = SUGGESTED_DONATION;
              fieldset.disabled = false;
              message.focus();
            })
            .catch((err) => {
              alert("Failed to refresh messages");
              console.log("Failed to refresh messages");

              throw err;
            });
        })
        .catch((err) => {
          console.error(err);

          fieldset.disabled = false;
        });
    },
    [selector, accountId, getMessages]
  );

  if (loading) {
    return null;
  }

  if (!account) {
    return (
      <Fragment>
        <div>
          <button onClick={handleSignIn}>Log in</button>
        </div>
        <SignIn />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div>
        <button onClick={handleSignOut}>Log out</button>
        <button onClick={handleSwitchProvider}>Switch Provider</button>
        {/*<button onClick={handleSendMultipleTransactions}>*/}
        {/*  Send Multiple Transactions*/}
        {/*</button>*/}
        {accounts.length > 1 && (
          <button onClick={handleSwitchAccount}>Switch Account</button>
        )}
      </div>
      <Form
        account={account}
        onSubmit={(e) => handleSubmit(e)}
      />
      <Messages messages={messages} />
    </Fragment>
  );
};

export default Content;
