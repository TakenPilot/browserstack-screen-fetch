Browserstack Screen Fetch
=========================

Fetch screenshots of urls from a list of browsers and devices

Example:

```bash
browserstack-screen-fetch --user aaa --password bbb --filename example-definition.json
```

##Arguments

### --help
Display help documentation

### --json
Returns result as JSON

### --status
Get api status

### --list:
Get all browser and device combinations

### --latest
Get all latest browser and device combinations

### --kill-all:
Kill all active workers

### --filename
List of urls/devices/browsers to fetch at once.  See example-definition.json for example.

### --url
Get a url and take a screenshot

### --wait-interval
Set timeout interval when waiting for workers

### --wait-to-load
Set time interval before taking screenshot

### --kill
Set to false to not kill workers after fetching screenshots
