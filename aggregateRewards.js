import axios from 'axios';
import fs from "node:fs";

const postFilePath = `post-1.4.18.json`;
const preFilePath = `pre-1.4.18.json`;
const outputFilePath = `quilibrium.txt`;

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

function readAddressesFromFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return [];
    }
  }

function findReward(data, peerId) {
  const rewardObj = data.find(item => item.peerId === peerId);
  return rewardObj ? parseFloat(rewardObj.reward) : 0;
}

async function main() {
  const postRewards = await readJsonFile(postFilePath);
  const preRewards = await readJsonFile(preFilePath);

  if (!postRewards || !preRewards) {
    console.error('Failed to read one or both of the reward files.');
    return;
  }

  // Example address to check
  const addresses = readAddressesFromFile('addresses.txt');
  let totalRewardAllAddresses = 0;
  let output = '';
  addresses.forEach(address => {
    const postReward = findReward(postRewards, address);
    const preReward = findReward(preRewards, address);

    const totalReward = postReward + preReward;

    output += `Address: ${address}\n`;
    output += `  Post-1.4.18 Reward: ${postReward}\n`;
    output += `  Pre-1.4.18 Reward: ${preReward}\n`;
    output += `  Total Reward: ${totalReward}\n\n`;
    totalRewardAllAddresses += totalReward;
  });

  output += `\nTotal Reward for All Addresses: ${totalRewardAllAddresses}\n`;
  console.log(output);

  try {
    await fs.writeFileSync(outputFilePath, output, 'utf8');
    console.log(`Output saved to ${outputFilePath}`);
  } catch (error) {
    console.error(`Error writing to file ${outputFilePath}:`, error);
  }

  
}

main();