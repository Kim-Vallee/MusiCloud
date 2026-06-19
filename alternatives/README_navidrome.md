# MusiCloud

This website, based on [Navidrome](https://www.navidrome.org/) is a way to host and share my music without going through third parties.

## Installation

### Download

This is the installation steps I followed from the [documentation](https://www.navidrome.org/docs/installation/linux/).

First update and upgrade system:
```bash
sudo apt update && sudo apt upgrade -y
```

I will install the latest version to date (2026-06-17):
```bash
wget https://github.com/navidrome/navidrome/releases/download/v0.62.0/navidrome_0.62.0_linux_amd64.deb
```

Then install it:
```bash
sudo apt install ./navidrome_0.62.0_linux_amd64.deb
```

And remove the file
```bash
rm navidrome_0.62.0_linux_amd64.deb
```

### Configure

Navidrome must be configured to work. First create a folder to store the music:
```bash
sudo mkdir -p /srv/media/navidrome/
```

And write `MusicFolder = "/srv/media/navidrome"` into `/etc/navidrome/navidrome.toml`.

### Start service

Now start the service

```bash
sudo systemctl enable --now navidrome
```

And check that it is running correctly

```bash
sudo systemctl status navidrome
sudo journalctl -u navidrome -f
```

## Sharing music

Follow the tutorial on this link [Sharing files with navidrome](https://www.navidrome.org/docs/usage/features/sharing/).