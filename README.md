# inspect amqp data

Simple command line tool to inspect data in AMQP.

## Configuration

Example config.json:

```json
{
  "connectionOptions": {
    "transport": "tls",
    "port": 5671,
    "host": "amqp.example.com",
    "username": "user",
    "enable_sasl_external": true,
    "rejectUnauthorized": false,
    "reconnect": false
  },
  "receiverOptions": {
    "name": "receiver",
    "source": "source.example"
  }
}
```
