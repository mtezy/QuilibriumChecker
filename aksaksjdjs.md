## Setup Node
This tutorial will guide you through setting up a node, configuring GRPC, retrieving metrics, saving configurations, checking visibility, and managing processes.

```bash
wget https://go.dev/dl/go1.20.14.linux-amd64.tar.gz && tar -xvf go1.20.14.linux-amd64.tar.gz && mv go /usr/local && rm go1.20.14.linux-amd64.tar.gz && echo -e '\nexport GOROOT=/usr/local/go\nexport GOPATH=$HOME/go\nexport PATH=$GOPATH/bin:$GOROOT/bin:$PATH' >> ~/.bashrc && source ~/.bashrc && go version && git clone https://github.com/quilibriumnetwork/ceremonyclient.git && cd ceremonyclient/node && git checkout release && apt install screen nano gawk cpulimit -y && ./release_autorun.sh
```

## Setting GRPC
```bash
cd .config && cat keys.yml && cat config.yml && sed -i.bak -e 's|^listenGrpcMultiaddr:.*|listenGrpcMultiaddr: /ip4/127.0.0.1/tcp/8337|' -e 's|^  statsMultiaddr:.*|  statsMultiaddr: \"/dns/stats.quilibrium.com/tcp/443\"|' config.yml
```
## Snapshots
```bash
apt install unzip -y && rm -rf store && wget https://snapshots.cherryservers.com/quilibrium/store.zip && unzip store.zip
```
## Retrieve Metrics
```bash
apt install jq -y && apt install base58 -y && go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest && peer_id=$(grpcurl -plaintext localhost:8337 quilibrium.node.node.pb.NodeService.GetNodeInfo | jq -r .peerId | base58 -d | base64) && grpcurl -plaintext localhost:8337 quilibrium.node.node.pb.NodeService.GetPeerManifests | grep -A 15 -B 1 "$peer_id" | tee >(awk -F '[:,]' '/"difficulty"/ {difficulty=$2} /"cores"/ {cores=$2} END {print "FINAL SCORE = " (difficulty/cores)}')
```
## Save config
```bash
zip "$(lscpu | grep 'Model name:' | awk '{for (i=3; i<=NF; i++) printf "%s%s", $i, (i==NF ? "" : "_") }')_$(grpcurl -plaintext localhost:8337 quilibrium.node.node.pb.NodeService.GetNodeInfo | jq -r '.peerId').zip" config.yml keys.yml

```
## Node info
```bash
cd ~/ceremonyclient/node && node=$(ls | grep amd64 | head -n 1); ./$node -node-info
```
## Kill process
```bash
#!/bin/bash

# Find the process IDs of the running Node.js application with the specified version
process_pids=$(ps -ef | grep "node-$version" | grep -v grep | awk '{print $2}')

# Check if any process IDs were found
if [ -n "$process_pids" ]; then
    # Convert process_pids to an array
    process_pids_array=($process_pids)
    
    # Check if the array length is greater than 0
    if [ ${#process_pids_array[@]} -gt 0 ]; then
        # Kill the processes
        echo "${process_pids_array[@]}" | xargs kill -9
        echo "Killed processes: ${process_pids_array[@]}"
    else
        echo "No processes found for node-$version"
    fi
else
    echo "No processes found for node-$version"
fi
```
## Kill all processes

```sh
oldest_pid=$(ps aux | grep './node-1.4.19-linux-amd64' | grep -v grep | awk '{print $2}' | head -n 1) && [ -n "$oldest_pid" ] && kill -9 $oldest_pid && echo "Process $oldest_pid has been killed." || echo "Process not found."

```
