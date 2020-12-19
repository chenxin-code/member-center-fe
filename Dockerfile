#FROM nginx:1.15.2-alpine
FROM 10.1.7.153:31104/times-linli/nginx:1.15.2-alpinejianshu
COPY ./dist /usr/share/nginx/html
COPY ./other/ /usr/share/nginx/other/
COPY ./cert/ /usr/share/nginx/cert/
#COPY nginx.conf /etc/nginx/conf.d/default.conf
