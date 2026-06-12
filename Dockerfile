FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY calculator.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
EXPOSE 80