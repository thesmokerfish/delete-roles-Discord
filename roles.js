const { Client, Intents } = require('discord.js');
const readline = require('readline');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });


client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  getServerId();
});

async function getServerId() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Entrez l\'ID du serveur Discord: ', async (serverId) => {
    rl.close();

    const guild = client.guilds.cache.get(serverId);
    if (!guild) {
      console.log(`Impossible de trouver le serveur avec l'ID ${serverId}`);
      process.exit(0);
    }

    const confirmation = await confirmAction(`Voulez-vous vraiment supprimer tous les rôles de ${guild.name} ? (Oui/Non): `);

    if (confirmation) {
      deleteAllRoles(guild);
    } else {
      console.log('Opération annulée');
      process.exit(0);
    }
  });
}

async function confirmAction(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'oui');
    });
  });
}

async function deleteAllRoles(guild) {
  const roles = Array.from(guild.roles.cache.filter(role => role.name !== '@everyone').values());
  
  if (!Array.isArray(roles)) {
    console.log('Aucun rôle trouvé.');
    return;
  }
  
  console.log(`Suppression de ${roles.length} rôles...`);
  
  roles.forEach(async (role) => {
    await role.delete()
      .then(deleted => console.log(`Rôle supprimé: ${deleted.name}`))
      .catch(err => console.log(`Impossible de supprimer le rôle ${role.name}: `, err));
  });
}

client.login('');