const mongoose = require('mongoose');           
let URI = 'mongodb://127.0.0.1:27017/bistrobits_test';

mongoose.Promise = global.Promise;

beforeAll(async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao banco de dados de teste com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados de teste:', error);
  }
});


afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
