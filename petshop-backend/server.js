const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Inicializar Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ========================================
// Rotas - Petshops
// ========================================

// GET - Listar todos os petshops
app.get('/api/petshops', async (req, res) => {
  try {
    const petshopsRef = db.collection('petshops');
    const snapshot = await petshopsRef.orderBy('nome').get();
    
    const petshops = [];
    snapshot.forEach(doc => {
      petshops.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(petshops);
  } catch (error) {
    console.error('Erro ao buscar petshops:', error);
    res.status(500).json({ error: 'Erro ao buscar petshops' });
  }
});

// GET - Buscar petshop por ID
app.get('/api/petshops/:id', async (req, res) => {
  try {
    const petshopRef = db.collection('petshops').doc(req.params.id);
    const doc = await petshopRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Petshop não encontrado' });
    }
    
    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Erro ao buscar petshop:', error);
    res.status(500).json({ error: 'Erro ao buscar petshop' });
  }
});

// POST - Criar novo petshop
app.post('/api/petshops', async (req, res) => {
  try {
    const { nome, endereco, telefone, horariosDisponiveis, diasDisponiveis, avaliacao, imagem } = req.body;
    
    if (!nome || !endereco || !telefone || !horariosDisponiveis || !diasDisponiveis) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    
    const novoPetshop = {
      nome,
      endereco,
      telefone,
      horariosDisponiveis,
      diasDisponiveis,
      avaliacao: avaliacao || 0,
      imagem: imagem || null,
      criadoEm: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('petshops').add(novoPetshop);
    
    res.status(201).json({
      id: docRef.id,
      ...novoPetshop
    });
  } catch (error) {
    console.error('Erro ao criar petshop:', error);
    res.status(500).json({ error: 'Erro ao criar petshop' });
  }
});

// PUT - Atualizar petshop
app.put('/api/petshops/:id', async (req, res) => {
  try {
    const petshopRef = db.collection('petshops').doc(req.params.id);
    const doc = await petshopRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Petshop não encontrado' });
    }
    
    const dadosAtualizacao = {
      ...req.body,
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await petshopRef.update(dadosAtualizacao);
    
    res.json({
      id: req.params.id,
      ...dadosAtualizacao
    });
  } catch (error) {
    console.error('Erro ao atualizar petshop:', error);
    res.status(500).json({ error: 'Erro ao atualizar petshop' });
  }
});

// DELETE - Remover petshop
app.delete('/api/petshops/:id', async (req, res) => {
  try {
    const petshopRef = db.collection('petshops').doc(req.params.id);
    const doc = await petshopRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Petshop não encontrado' });
    }
    
    await petshopRef.delete();
    res.json({ message: 'Petshop removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover petshop:', error);
    res.status(500).json({ error: 'Erro ao remover petshop' });
  }
});

// ========================================
// Rotas - Agendamentos
// ========================================

// POST - Criar agendamento
app.post('/api/agendamentos', async (req, res) => {
  try {
    const { petshopId, clienteNome, clienteTelefone, petNome, data, horario, servico } = req.body;
    
    if (!petshopId || !clienteNome || !clienteTelefone || !petNome || !data || !horario) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }
    
    const novoAgendamento = {
      petshopId,
      clienteNome,
      clienteTelefone,
      petNome,
      data,
      horario,
      servico: servico || 'Tosa',
      status: 'pendente',
      criadoEm: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('agendamentos').add(novoAgendamento);
    
    res.status(201).json({
      id: docRef.id,
      ...novoAgendamento
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro ao criar agendamento' });
  }
});

// GET - Listar agendamentos por petshop
app.get('/api/agendamentos/petshop/:petshopId', async (req, res) => {
  try {
    const agendamentosRef = db.collection('agendamentos');
    const snapshot = await agendamentosRef
      .where('petshopId', '==', req.params.petshopId)
      .orderBy('data')
      .get();
    
    const agendamentos = [];
    snapshot.forEach(doc => {
      agendamentos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: 'Erro ao buscar agendamentos' });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Petshop funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

