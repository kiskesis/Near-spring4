use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, near_bindgen};
use near_sdk::collections::Vector;

pub const MESSAGE_LIMIT:u8 = 10;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    messages: Vector<Message>,
}

#[derive(BorshDeserialize, BorshSerialize,Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Message {
    pub timestamp:u64,
    pub timestamp_str: String,
    pub message: String,
    pub author: String,
    pub deposit: u128
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            messages: Vector::new(b"messages".to_vec()),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn add_message(&mut self, message: String ) {
        let account_id = env::signer_account_id();

        let timestamp = env::block_timestamp();
        let timestamp_str = "".to_string();
        let message_deposit = env::attached_deposit();

        let message: Message = Message { deposit: message_deposit, timestamp: timestamp, message: message, author: account_id.to_string(), timestamp_str: timestamp_str };

        self.messages.push(&message);
    }

    pub fn get_messages(&self) -> Vec<Message> {
        let mut message_list = Vec::new();

        let mut msg_count = 0;

        for message in self.messages.iter()
        {
            message_list.push( message );
            msg_count += 1;

            if msg_count > MESSAGE_LIMIT
            {
                break;
            }
        }

        return message_list;
    }
}