# MusiCloud

Procedure for rauversion.

## Installation

### Download

Following the [GitHub documentation](https://github.com/rauversion/rauversion).

Clone the repo:
```bash
git clone https://github.com/rauversion/rauversion.git
cd rauversion
```

Install ruby and bundler:
```bash
sudo apt install ruby-full bundler npm postgresql
```

Install the requirements for rails:
```bash
sudo apt install build-essential rustc libssl-dev libyaml-dev zlib1g-dev libgmp-dev git
gem install rails
```

Install ruby-installer to select the correct version:
```bash
wget https://github.com/postmodern/ruby-install/releases/download/v0.10.2/ruby-install-0.10.2.tar.gz
tar -xzvf ruby-install-0.10.2.tar.gz
cd ruby-install-0.10.2/
sudo make install
cd ../
rm -rf ruby-install-0.10.2*
```

Then install ruby version 3.3.5:
```bash
sudo ruby-install --system ruby 3.3.5
```

Install yarn as well:
```bash
sudo npm install --global yarn@1
```

First copy `.env.example` -> `.env` and modify as needed. In particular, change:
* `APP_NAME`
* `APP_DOMAIN` and `DOMAIN` for the port
* `POSTGRES_*` for the name
* Regenerate secret with `openssl rand -hex 64` into `SECRET_KEY_BASE`

Set the path for installation and install
```bash
bundle config set --local path '/my/path/'
bundle install
yarn install
```

Then prepare the db:
```bash
bundle exec rails db:prepare
```

If it does not work, then postgres must be installed and running first, see the below section

### Setting up postgres

In order to run the server, one need to setup postgres. First create an user specifically for MusiCloud:

```bash
sudo -u postgres psql
```

Then create the user with some password
```sql
CREATE USER musicloud WITH PASSWORD 'my_secure_password';
ALTER USER musicloud CREATEDB;
```

Then update the `.env` with:
* `POSTGRES_USERNAME = musicloud`
* `POSTGRES_PASSWORD = my_secure_password`
* `POSTGRES_HOST = localhost` to be checked with `sudo -u postgres psql -U musicloud -h localhost`
* `POSTGRES_PORT = 5432` 
