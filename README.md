# QuilibriumChecker

QuilibriumChecker is a Node.js script that aggregates rewards from two JSON files (`post-1.4.18.json` and `pre-1.4.18.json`) for a list of addresses provided in `addresses.txt`. The script calculates the total rewards for each address and saves the results to `quilibrium.txt`.

## Download Pre & Post v1.4.18 Files

To get started, download the required JSON files:

```bash
wget https://quilibrium.com/rewards/post-1.4.18.json
wget https://quilibrium.com/rewards/pre-1.4.18.json
```

## Setup
- Clone the Repository:
```bash
git clone https://github.com/mtezy/QuilibriumChecker.git
cp pre-1.4.18.json post-1.4.18.json QuilibriumChecker/
cd QuilibriumChecker
```
- Install Dependencies: Make sure you have Node.js installed. Then, install the required dependencies:
```bash
npm install
```
- Create addresses.txt: Create a file named `addresses.txt` in the same directory as the script. Each address should be on a new line. Example:
```bash
Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Usage
- Run the script using Node.js:
```bash
node aggregateRewards.js
```

The script will read the addresses from `addresses.txt`, fetch the rewards data from the specified JSON files, calculate the rewards for each address, print the results to the console, and save the output to `quilibrium.txt`.
## Example Output
The output will be saved to file.txt and will look something like this:
```bash
Address: Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Post-1.4.18 Reward: 123.456
  Pre-1.4.18 Reward: 78.910
  Total Reward: 202.366

Address: Qmxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  Post-1.4.18 Reward: 234.567
  Pre-1.4.18 Reward: 89.012
  Total Reward: 323.579

Total Reward for All Addresses: 525.945
```
