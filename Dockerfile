FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Limpa a página padrão do Nginx
RUN rm -rf ./*

# Copia apenas os arquivos estritamente necessários para o site funcionar
COPY index.html .
COPY css/ ./css/
COPY js/ ./js/
COPY fotos/ ./fotos/

# Expõe a porta e inicia o servidor
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]