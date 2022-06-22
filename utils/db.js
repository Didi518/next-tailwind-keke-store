import mongoose from 'mongoose';

const connexion = {};

async function connect() {
  if (connexion.isConnected) {
    console.log('déjà connecté');
    return;
  }
  if (mongoose.connections.length > 0) {
    connexion.isConnected = mongoose.connections[0].readyState;
    if (connexion.isConnected === 1) {
      console.log('utiliser la dernière connexion');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('nouvelle connexion');
  connexion.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connexion.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connexion.isConnected = false;
    } else {
      console.log('non déconnecté');
    }
  }
}

const db = { connect, disconnect };
export default db;
