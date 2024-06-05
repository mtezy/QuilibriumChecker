## Setup Node
```bash
wget https://go.dev/dl/go1.20.14.linux-amd64.tar.gz && tar -xvf go1.20.14.linux-amd64.tar.gz && mv go /usr/local && rm go1.20.14.linux-amd64.tar.gz && echo -e '\nexport GOROOT=/usr/local/go\nexport GOPATH=$HOME/go\nexport PATH=$GOPATH/bin:$GOROOT/bin:$PATH' >> ~/.bashrc && source ~/.bashrc && go version && git clone https://source.quilibrium.com/quilibrium/ceremonyclient.git && cd ceremonyclient/node && git checkout release && apt install screen nano gawk cpulimit -y
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
## Visibility Check
```bash
output=$(grpcurl -plaintext localhost:8337 quilibrium.node.node.pb.NodeService.GetNetworkInfo); bootstrap_peers=("EiDpYbDwT2rZq70JNJposqAC+vVZ1t97pcHbK8kr5G4ZNA==" "EiCcVN/KauCidn0nNDbOAGMHRZ5psz/lthpbBeiTAUEfZQ==" "EiDhVHjQKgHfPDXJKWykeUflcXtOv6O2lvjbmUnRrbT2mw==" "EiDHhTNA0yf07ljH+gTn0YEk/edCF70gQqr7QsUr8RKbAA==" "EiAnwhEcyjsHiU6cDCjYJyk/1OVsh6ap7E3vDfJvefGigw==" "EiB75ZnHtAOxajH2hlk9wD1i9zVigrDKKqYcSMXBkKo4SA==" "EiDEYNo7GEfMhPBbUo+zFSGeDECB0RhG0GfAasdWp2TTTQ==" "EiCzMVQnCirB85ITj1x9JOEe4zjNnnFIlxuXj9m6kGq1SQ=="); visible=false; for peer in "${bootstrap_peers[@]}"; do if [[ $output == *"$peer"* ]]; then visible=true; echo "You see $peer as a bootstrap peer"; else echo "Peer $peer not found"; fi; done; if $visible; then echo "Great, your node is visible!"; else echo "Sorry, your node is not visible. Please restart your node and try again."; fi
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
oldest_pid=$(ps aux | grep './node-1.4.18-linux-amd64' | grep -v grep | awk '{print $2}' | head -n 1) && [ -n "$oldest_pid" ] && kill -9 $oldest_pid && echo "Process $oldest_pid has been killed." || echo "Process not found."

```
