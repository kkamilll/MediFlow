require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Prescription = require('./models/Prescription');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mediflow';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB (MediFlow)');
    await displayStats();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n--- TROUBLESHOOTING ---');
    console.log('1. Make sure MongoDB service is running.');
    console.log('2. Check if your connection string in .env is correct.');
    console.log('3. If using local MongoDB, try: mongodb://127.0.0.1:27017/mediflow');
  });

async function displayStats() {
  try {
    const activeCount = await Prescription.countDocuments({ status: 'active' });
    const usedCount = await Prescription.countDocuments({ status: 'used' });
    
    console.log('\n--- SYSTEM STATUS ---');
    console.log(`📦 Active prescriptions: ${activeCount}`);
    console.log(`✅ Fulfilled: ${usedCount}`);
    
    if (activeCount > 0) {
      console.log('\nLatest active prescriptions:');
      const latest = await Prescription.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(5);
      
      latest.forEach(p => {
        console.log(`- PESEL: ${p.pesel} | PIN: ${p.pin} | Items: ${p.medications.length}`);
      });
    }
    console.log('----------------------\n');
  } catch (err) {
    console.log('Could not fetch initial database statistics.');
  }
}

app.post('/api/prescriptions', async (req, res) => {
  try {
    const { pesel, medications } = req.body;

    if (!pesel || pesel.length !== 11 || isNaN(pesel)) {
      return res.status(400).json({ error: 'Invalid PESEL format (11 digits required)' });
    }

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ error: 'Prescription must contain at least one medication' });
    }

    for (const med of medications) {
      if (!med.name || med.price <= 0 || med.quantity <= 0) {
        return res.status(400).json({ error: `Invalid medication data: ${med.name || 'Missing name'}` });
      }
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const newPres = new Prescription({ pesel, medications, pin });
    await newPres.save();

    console.log(`📝 New Prescription Issued: PESEL ${pesel}, PIN ${pin}`);
    res.status(201).json(newPres);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving prescription' });
  }
});

app.get('/api/prescriptions/stats/active', async (req, res) => {
  try {
    const count = await Prescription.countDocuments({ status: 'active' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching active count' });
  }
});

app.get('/api/prescriptions/stats/used', async (req, res) => {
  try {
    const count = await Prescription.countDocuments({ status: 'used' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching fulfilled count' });
  }
});

app.get('/api/prescriptions/:pesel/:pin', async (req, res) => {
  try {
    const { pesel, pin } = req.params;
    const pres = await Prescription.findOne({ pesel, pin });
    if (!pres) return res.status(404).json({ error: 'Prescription not found' });
    res.json(pres);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching prescription' });
  }
});

app.post('/api/prescriptions/buy', async (req, res) => {
  try {
    const { pesel, pin, indices } = req.body;

    if (!indices || !Array.isArray(indices) || indices.length === 0) {
      return res.status(400).json({ error: 'No medication indices provided' });
    }

    const pres = await Prescription.findOne({ pesel, pin });
    if (!pres) return res.status(404).json({ error: 'Prescription does not exist' });

    indices.forEach(idx => {
      if (pres.medications[idx]) pres.medications[idx].status = 'done';
    });

    if (pres.medications.every(m => m.status === 'done')) {
      pres.status = 'used';
    }

    await pres.save();
    res.json({ success: true, medications: pres.medications, status: pres.status });
  } catch (err) {
    res.status(500).json({ error: 'Server error during transaction processing' });
  }
});

app.delete('/api/prescriptions/used', async (req, res) => {
  try {
    const result = await Prescription.deleteMany({ status: 'used' });
    console.log(`🗑️  Deleted ${result.deletedCount} fulfilled prescription(s).`);
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Error occurred while deleting fulfilled prescriptions' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 MEDIFLOW SYSTEM READY!`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`----------------------------------`);

  if (!process.env.NO_AUTO_OPEN && !process.env.DOCKER_CONTAINER) {
    const { exec } = require('child_process');
    const startCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${startCmd} http://localhost:${PORT}`, () => {});
  }
});
