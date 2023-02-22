
/**
 * @script 
 * @author luca.musarella
 */
const { GLOBAL_CONFIG } = require("../bot-configuration/bot-configuration");
const { EVENTS } = require("../bot-lib/common/constants/smart-contract.constants");
const { saveRoundInHistory, saveStatisticsInHistory, getRoundsFromHistory, mergeRoundHistory } = require('../bot-lib/history/history.module');
const { getSmartContract, getRoundData } = require('../bot-lib/smart-contracts/pcs-prediction-smart-contract.module');
const { stopBotCommand, startBotCommand, executeBetStrategy, createStartRoundEvent, createEndRoundEvent, executeBetUpStrategy, executeBetDownStrategy } = require('../bot-lib/pcs-bot.module');
const { formatEther, getCrypto, updateCryptoUsdPriceFromSmartContract, formatUnit, parseFromCryptoToUsd, fixedFloatNumber } = require('../bot-lib/common/utils.module');
const { updateSimulationBalance } = require("../bot-lib/wallet/wallet.module");
const { printStartRoundEvent, printBetRoundEvent, printEndRoundEvent, printStatistics, printSectionSeparator } = require("../bot-lib/common/print.module");
const { isCopyTradingStrategy } = require("../bot-lib/strategies/copytrading-strategy.module");
const { CRYPTO_DECIMAL, USD_DECIMAL, START_ROUND_WAITING_TIME } = require("../bot-lib/common/constants/bot.constants");
const sleep = require("util").promisify(setTimeout);

const COPY_TRADING_STRATEGY_CONFIG = GLOBAL_CONFIG.STRATEGY_CONFIGURATION.COPY_TRADING_STRATEGY;

const pendingRoundEventStack = new Map();

const init = async () => {
  await startBotCommand();
}

init();

//Listener on "StartRound" event from {@PredictionGameSmartContract}
getSmartContract().on(EVENTS.START_ROUND_EVENT, async (epoch) => {
  //Wait EndRoundEvent processed
  await sleep(START_ROUND_WAITING_TIME);
  const startRoundEvent = await createStartRoundEvent(epoch, pendingRoundEventStack.size);
  printStartRoundEvent(startRoundEvent, pendingRoundEventStack);
  if (startRoundEvent.stopBot) {
    stopBotCommand();
  }
  if (!startRoundEvent.skipRound) {
    pendingRoundEventStack.set(startRoundEvent.id, startRoundEvent);
    if (!isCopyTradingStrategy()) {
      await sleep(GLOBAL_CONFIG.WAITING_TIME - START_ROUND_WAITING_TIME);
      const betRoundEvent = await executeBetStrategy(epoch)
      printBetRoundEvent(betRoundEvent);
      if (betRoundEvent.skipRound) {
        pendingRoundEventStack.delete(betRoundEvent.id);
      } else {
        pendingRoundEventStack.set(betRoundEvent.id, betRoundEvent);
      }
    }
  }
});

//Listener on "EndRound" event from {@PredictionGameSmartContract}
getSmartContract().on(EVENTS.END_ROUND_EVENT, async (epoch, _roundId, cryptoClosePrice) => {
  updateCryptoUsdPriceFromSmartContract(cryptoClosePrice);
  const roundEvent = pendingRoundEventStack.get(formatUnit(epoch));
  if (roundEvent && roundEvent.bet) {
    const endRoundData = await getRoundData(epoch);
    const roundsHistoryData = await getRoundsFromHistory();
    const mergedRoundsHistory = mergeRoundHistory(roundsHistoryData, [endRoundData]);
    const endRoundEvent = await createEndRoundEvent(mergedRoundsHistory, epoch);
    const finalRoundHistoryData = await saveRoundInHistory(mergedRoundsHistory, true);
    const statistics = saveStatisticsInHistory(finalRoundHistoryData);
    pendingRoundEventStack.delete(endRoundEvent.id);
    printEndRoundEvent(endRoundEvent);
    printStatistics(statistics, pendingRoundEventStack);
    if (GLOBAL_CONFIG.SIMULATION_MODE) {
      updateSimulationBalance(GLOBAL_CONFIG.SIMULATION_BALANCE + statistics.profit_crypto - statistics.totalTxGasFee);
    }
  }
});


//Listener on "BetBear" event from {@PredictionGameSmartContract}
getSmartContract().on(EVENTS.BET_BEAR_EVENT, async (sender, epoch) => {
  if (isCopyTradingStrategy() && pendingRoundEventStack.get(formatUnit(epoch)) && sender == COPY_TRADING_STRATEGY_CONFIG.WALLET_ADDRESS_TO_EMULATE) {
    const betRoundEvent = await executeBetDownStrategy(epoch);
    printBetRoundEvent(betRoundEvent);
    pendingRoundEventStack.set(betRoundEvent.id, betRoundEvent);
  }
});

//Listener on "BetBull" event from {@PredictionGameSmartContract}
getSmartContract().on(EVENTS.BET_BULL_EVENT, async (sender, epoch) => {
  if (isCopyTradingStrategy() && pendingRoundEventStack.get(formatUnit(epoch)) && sender == COPY_TRADING_STRATEGY_CONFIG.WALLET_ADDRESS_TO_EMULATE) {
    const betRoundEvent = await executeBetUpStrategy(epoch);
    printBetRoundEvent(betRoundEvent);
    pendingRoundEventStack.set(betRoundEvent.id, betRoundEvent);
  }
});

//Listener on "LockRound" event from {@PredictionGameSmartContract}
getSmartContract().on(EVENTS.LOCK_ROUND, async (epoch) => {
  if (isCopyTradingStrategy()) {
    const roundEvent = pendingRoundEventStack.get(formatUnit(epoch));
    if (roundEvent && !roundEvent.bet) {
      console.log(`🥺 Round [`, formatUnit(epoch), `] Sorry your friend ${COPY_TRADING_STRATEGY_CONFIG.WALLET_ADDRESS_TO_EMULATE} didn't bet!`);
      printSectionSeparator();
    }
  }
});

//Listener on "Claim" event from {@PredictionGameSmartContract}
getSmartContract().on(EVENTS.CLAIM_EVENT, async (sender, epoch, addedRewards) => {
  if (sender == process.env.PERSONAL_WALLET_ADDRESS) {
    console.log(`🗿 Round [`, formatUnit(epoch),`] Successful claimed`, parseFromCryptoToUsd(parseFloat(formatEther(addedRewards), USD_DECIMAL)), 'USD =' , fixedFloatNumber(parseFloat(formatEther(addedRewards)), CRYPTO_DECIMAL), getCrypto());
    printSectionSeparator();
  }
});