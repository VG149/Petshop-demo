const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const petshopsExemplo = [
  {
    nome: "PetLove Center",
    endereco: "Rua das Flores, 123 - Centro",
    telefone: "(11) 98765-4321",
    horariosDisponiveis: {
      inicio: "08:00",
      fim: "18:00"
    },
    diasDisponiveis: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
    avaliacao: 5,
    imagem: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400"
  },
  {
    nome: "Banho & Tosa Premium",
    endereco: "Av. Principal, 456 - Jardim das Acácias",
    telefone: "(11) 97654-3210",
    horariosDisponiveis: {
      inicio: "09:00",
      fim: "19:00"
    },
    diasDisponiveis: ["segunda", "terca", "quarta", "quinta", "sexta"],
    avaliacao: 4,
    imagem: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400"
  },
  {
    nome: "Pet Care & Spa",
    endereco: "Rua dos Animais, 789 - Vila Verde",
    telefone: "(11) 96543-2109",
    horariosDisponiveis: {
      inicio: "08:00",
      fim: "17:00"
    },
    diasDisponiveis: ["segunda", "quarta", "sexta", "sabado"],
    avaliacao: 5,
    imagem: "https://images.unsplash.com/photo-1581888227599-779811939961?w=400"
  },
  {
    nome: "Mundo Pet",
    endereco: "Rua do Comércio, 321 - Bairro Novo",
    telefone: "(11) 95432-1098",
    horariosDisponiveis: {
      inicio: "10:00",
      fim: "20:00"
    },
    diasDisponiveis: ["terca", "quinta", "sexta", "sabado", "domingo"],
    avaliacao: 3,
    imagem: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=400"
  },
  {
    nome: "Clínica Veterinária Amigo Fiel",
    endereco: "Av. dos Pets, 555 - Centro",
    telefone: "(11) 94321-0987",
    horariosDisponiveis: {
      inicio: "07:00",
      fim: "19:00"
    },
    diasDisponiveis: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"],
    avaliacao: 5,
    imagem: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400"
  }
];

async function popularFirestore() {
  try {
    console.log('Iniciando população do Firestore...');
    
    // Adicionar petshops
    for (const petshop of petshopsExemplo) {
      const docRef = await db.collection('petshops').add({
        ...petshop,
        criadoEm: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✓ Petshop "${petshop.nome}" adicionado com ID: ${docRef.id}`);
    }
    
    console.log('\n✓ Firestore populado com sucesso!');
    console.log(`Total de petshops adicionados: ${petshopsExemplo.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular Firestore:', error);
    process.exit(1);
  }
}

popularFirestore();