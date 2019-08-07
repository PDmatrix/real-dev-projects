FROM nginx
RUN echo -n "REAL WORLD" > /usr/share/nginx/html/hello
CMD /bin/bash -c 'sed -i "s/80/$PORT/" /etc/nginx/conf.d/default.conf && exec nginx -g "daemon off;"'
