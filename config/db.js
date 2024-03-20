let mongoURI;
//configurar no Heroku CLI para cada instância:==> heroku config:set RESTAURANT_CNPJ=43.412.432/0001-01
if (process.env.NODE_ENV === 'production') {
  switch (process.env.RESTAURANT_CNPJ) {
    case '<cnpj_1>':
      mongoURI = "mongodb://<caminho_mongodb_no_mLab_1>";
      break;
    case '<cnpj_2>':
      mongoURI = "mongodb://<caminho_mongodb_no_mLab_2>";
      break;
    default:
      mongoURI = "mongodb://127.0.0.1:27017/bistrobits";
  }
} else {
  mongoURI = "mongodb://127.0.0.1:27017/bistrobits";
}

module.exports = { mongoURI };
