# dyna-menu-sys
A dynamic menu system using raspberry pi and android systems

![W3C Validation](https://img.shields.io/w3c-validation/html?targetUrl=https%3A%2F%2Fdynamenusystem.uk)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/toothfull/dyna-menu-sys?label=Latest%20Release)
![GitHub release (latest by date)](https://img.shields.io/github/downloads/toothfull/dyna-menu-sys/0.2.0/total)
![GitHub issues](https://img.shields.io/github/issues/toothfull/dyna-menu-sys)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/toothfull/dyna-menu-sys)

## Usage

### Server
1. Download [the latest release](https://github.com/toothfull/dyna-menu-sys/releases) or **Suggested:** install the service via the Repository's [Docker container](https://github.com/toothfull/dyna-menu-sys/pkgs/container/server)
2. Install raspbian on your Raspberry PI 3+
3. Install mongo via its docker container and create a database. Make sure to remember your login credentials 
4. Set up your google oauth configuration with your [Google Cloud Console](https://console.cloud.google.com/) and remember the Client ID, Client Secret, Redirect URI and Session Domain
5. Specify the details you would like to use to host this service (Found Below) inside your docker using the `--env-file` flag

```
USERNAME = ""
PASSWORD = ""
HOST = ""
PORT = ""
DATABASENAME = ""
COLLECTIONNAME1 = ""
COLLECTIONNAME2 = ""
CLIENTID = ""
CLIENTSECRET = ""
REDIRECTURI = ""
SESSION_DOMAIN = ""
```

6. Install and configure the Raspberry PI to use:
* hostapd - service that broadcasts the WiFi network
* dnsmasq - service that acts as a DHCP server for the WiFi network
* cloudflared - [Cloudlflare Tunneling service](https://www.cloudflare.com/en-gb/products/zero-trust/access/) which creates a route through your domain to your device via the Internet 
*Inside the Pi's /etc/network/interfaces **Make sure your Raspberry PI is configured to work on** `192.168.1.1`

7. Try to login to your chosen Google account to create document inside of mongo used to authenticate your google account
8. Change the `authorised:` property to `true` inside your Google account's document
9. Login to the web application


### Android app

1. Configure your android device to have a passcode
2. Move the .APK file to your chosen android device and install it
3. Connect your android device to your Raspberry Pi's Wifi Network

You should now be able to see your menu on your android device!