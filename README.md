## Archer Relay - Miner Proxy


A simple reverse proxy that a miner can run to expose just the eth_sendBundle JSON-RPC method to an approved list of API keys.


### Install
```bash
# install nodejs on your system, e.g. `sudo apt install nodejs npm` on debian/ubuntu
sudo npm install -g yarn

git clone https://github.com/archerdao/miner-proxy.git
cd miner-proxy

yarn install
```



### Configure

Copy the .env.sample file into a new file called .env.prod.  Fill out the required configuration variables with the correct values for your setup and then save the file.  Then run:
```
source .env.prod
```

### Run
```
yarn start
```

### Docker

Alternatively, you can run it in Docker using the image built from the provided Dockerfile