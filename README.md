
# Merchant Service
Membuat merchant service sebuah perusahaan e-commerce pada layanan perdagangan 


## Architecture Diagram

![App Screenshot](./images/arsitek%20diagram.png)

## Database models

![App Screenshot](./images/erd%20diagram.png)

## Run Locally

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Demo

Insert gif or link to demo

http://localhost:5000

## Library/Framework


    "basic-auth": "^2.0.1"
    "body-parser": "^1.20.2",
    "express": "^4.18.2",
    "mysql": "^2.18.1",
    "mysql2": "^3.2.0",
    "nodemon": "^2.0.22"
## API Endpoint


| Methods | Endpoints     | Description                |
| :-------- | :------- | :------------------------- |
| `get` | `/merchant/:id/products` | mendapatkan semua produk pada merchant tertentu dengan id |
| `post` | `/merchant` | membuat merchant |
| `delete` | `/merchant/:id` | menghapus merchant dengan id |
| `post` | `/merchant/:id/product` | menambahkan produk |
| `delete` | `/product/:id` | menghapus product dengan id |
| `put` | `/product/:id` | mengubah product dengan id |
