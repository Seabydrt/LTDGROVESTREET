const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const filePath = './commandes.json';

// Initialiser le fichier si inexistant
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));

// GET toutes les commandes
app.get('/commandes', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// POST ajouter une commande
app.post('/commandes', (req, res) => {
  const commandes = JSON.parse(fs.readFileSync(filePath));
  const newCmd = req.body;
  newCmd.statut = "En attente";
  commandes.push(newCmd);
  fs.writeFileSync(filePath, JSON.stringify(commandes, null, 2));
  res.json({message: "Commande ajoutée"});
});

// PUT changer le statut
app.put('/commandes/:index', (req,res)=>{
  const commandes = JSON.parse(fs.readFileSync(filePath));
  const idx = Number(req.params.index);
  if(!commandes[idx]) return res.status(404).json({error:"Commande introuvable"});
  commandes[idx].statut = req.body.statut;
  fs.writeFileSync(filePath, JSON.stringify(commandes,null,2));
  res.json({message:"Statut modifié"});
});

// DELETE supprimer commande
app.delete('/commandes/:index', (req,res)=>{
  const commandes = JSON.parse(fs.readFileSync(filePath));
  const idx = Number(req.params.index);
  if(!commandes[idx]) return res.status(404).json({error:"Commande introuvable"});
  commandes.splice(idx,1);
  fs.writeFileSync(filePath, JSON.stringify(commandes,null,2));
  res.json({message:"Commande supprimée"});
});

app.listen(PORT, ()=>console.log(`Serveur LTD en ligne sur http://localhost:${PORT}`));
