## dirty-fingernails
###### A group management Discord bot for United Operations

[![Build Status](https://travis-ci.org/pdxmholmes/dirty-fingernails.svg?branch=master)](https://travis-ci.org/pdxmholmes/dirty-fingernails)

#### Configuration

Configuration can be provided in the form of a JSON file or as environment variables. When using environment variables the names are hierarchy delimited using a colon (:). A startup the bot will look for a file named config.json and load it if it is available. Environment variables will then be loaded. Values from envrionment variables will override values from the JSON file.

Example JSON:
```json
{
  "discord": {
    "token": "ABCD123"
  },
  "database": {
    "url": "mongodb://localhost/uo"
  },
  "bot": {
    "channels": {
      "whitelist": [
        "bot-dev"
      ]
    }
  }
}
```

Option | Details
------ | -------
discord:token | The Bot User token required for the bot to connect to a server.
database:url | URL to connect to a MongoDB data store to store group data.
bot:channels:whitelist | Array of channels that the bot will pay attention to. An empty list means all channels on the server.
