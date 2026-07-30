FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpa a página padrão do Nginx
RUN rm -rf ./*

# Copia apenas os arquivos estritamente necessários para o site funcionar
COPY . .

# Expõe a porta e inicia o servidor
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
