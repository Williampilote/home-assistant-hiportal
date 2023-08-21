FROM node:20.5.1

ENV HIPORTAL_EMAIL=exemple@gmail.com
ENV HIPORTAL_PASSWORD=123456789

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get dist-upgrade -y && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Install your app here...
WORKDIR /code

COPY package.json package.json
# COPY package-lock.json package-lock.json
COPY yarn.lock yarn.lock

RUN yarn

COPY . .

EXPOSE 4000

CMD [ "node", "server.js"]