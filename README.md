# Etherscanner
Web application for getting all necessary information about any account from Main Ethereum network.
Input: 
- Type account address
- If necessary, type number N of last blocks you wish to scan

Output:
- Balance of this account
- Total number of transactions sent from this account
- List of all transactions connected with this account and mined in last N blocks

Made with:
- nginx with default configuration:
 ```sh
server {
    location / {
        root <path_to_folder>/blockforce;
        index index.html;

        # kill cache
        add_header Last-Modified $date_gmt;
        add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';
        if_modified_since off;
        expires off;
        etag offl;
    }
}
```
- Metamask for connection with Main Ethereum network
- web3.js -- Ethereum JavaScript API 
