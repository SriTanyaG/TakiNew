FROM nginx:alpine

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Admin app under /admin/
COPY ../admin-panel/dist /usr/share/nginx/html/admin

# Voicebot app under /voicebot/
COPY ../voice-bot/dist /usr/share/nginx/html/voicebot

# Landing page at /
COPY ../admin-panel/dist/index.html /usr/share/nginx/html/index.html
COPY ../admin-panel/dist/assets /usr/share/nginx/html/assets
