# PoliBot - Frontend (React Native + Expo)

Frontend do projeto PoliBot, desenvolvido como um aplicativo mobile multiplataforma usando React Native e o framework Expo. Este aplicativo fornece a interface de usuário para interagir com o chatbot, consumindo a API do [repositório de backend](https://github.com/Poliedro-Chatbot-Polibot/backend_django).

## ✨ Tecnologias

* React Native
* Expo SDK
* JavaScript
* Axios (para chamadas de API)
* React Navigation (para navegação entre telas)

## 📋 Pré-requisitos

* **Node.js (LTS)** e **NPM** ou **Yarn**.
* O aplicativo **Expo Go** instalado no seu celular (Android ou iOS).
* O **[Backend do PoliBot](https://github.com/Poliedro-Chatbot-Polibot/backend_django) deve estar rodando** na sua máquina local.

## 🚀 Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Poliedro-Chatbot-Polibot/polibot_v1.git](https://github.com/Poliedro-Chatbot-Polibot/polibot_v1.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd polibot_v1
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure a URL da API (IMPORTANTE!):**
    Crie um arquivo `.env` na raiz do projeto para guardar o endereço da sua API backend.
    ```bash
    # Exemplo de como criar e configurar o arquivo .env
    echo "API_URL=http://SEU_IP_LOCAL:8000" > .env
    ```
    **Atenção:** Você precisa substituir `SEU_IP_LOCAL` pelo endereço de IP da sua máquina na sua rede Wi-Fi. Veja a seção abaixo sobre como fazer isso.

5.  **Inicie o servidor de desenvolvimento do Expo:**
    ```bash
    npm start
    ```
    *(ou `expo start`)*

6.  **Abra o aplicativo no seu celular:**
    Um QR Code aparecerá no terminal. Abra o aplicativo **Expo Go** no seu celular e escaneie este QR Code para carregar o projeto.

## 🔌 Conexão com o Backend (Passo Crítico)

Para que o aplicativo no seu celular consiga "conversar" com o backend que está rodando no seu computador, você **não pode** usar `localhost`. Você precisa usar o endereço de IP do seu computador na rede local.

**1. Encontre o seu Endereço de IP Local:**
* **No Windows:** Abra o `cmd` e digite `ipconfig`. Procure pelo "Endereço IPv4" na sua conexão Wi-Fi ou Ethernet.
* **No macOS ou Linux:** Abra o terminal e digite `ifconfig` ou `ip a`. Procure pelo endereço na seção `en0` ou `wlan0`.
    * O endereço será algo como `192.168.0.10` ou `192.168.1.5`.

**2. Configure o Arquivo `.env`:**
* Abra o arquivo `.env` que você criou e certifique-se de que a variável `API_URL` está configurada com o IP que você encontrou.
    * *Exemplo:* `API_URL=http://192.168.0.10:8000`

**Observação:** Seu celular e seu computador precisam estar conectados na **mesma rede Wi-Fi**.

## 👨‍💻 Autores

* Victhor Castro
* Pedro Canova
* Robert Kevyn
