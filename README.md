# inspect amqp data

Simple command line tool to inspect data in AMQP.

## Usage

```
λ dist/inspect-amqp.cjs --help
Usage: inspect-amqp [options]

Options:
  -c, --cert <path>         Certificate path (default: "cert.pem")
  -k, --key <path>          Key path (default: "key.pem")
  -o, --output-file <path>  Output file (default: "output.json")
  -C, --config <path>       Config file (default: "config.json")
  -t, --timeout <number>    Timeout in seconds (default: "10")
  -h, --help                display help for command
```

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
