const Discord = require('discord.js');
const eco = require('discord-economy');
const client = new Discord.Client();

const token = 'NzE5Mjg1MzQzMTgyMTI3MTQ1.Xt1NyQ.z_moWIFfwUEn1F-bqkmCX6t7iNI';

const PREFIX = '!lb ';

client.on('ready', () =>{
    console.log('Bot is online');
})

client.on('message', msg=>{
    if(msg.content === "LutkoBot") {
        msg.reply('Šta je, pička ti materina!');
    }
})

client.on('message', async message=>{
   let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]) {
        case 'help':
            message.channel.send(`**HELP**\n
**!lb bal** : checkout your balance of bitcoins
**!lb daily** : once a day you get free 1000 ฿
**!lb gamble [amount]** : you have a chance of winning or losing the amount you want (50/50)
**!lb gamble all** : you will gamble all your bitcoins
**!lb slots [amount]** : play slots with your bitcoins
**!lb top5** : see the top 5 richest people on the server
**!lb mine** : you will go to the mine and try your luck with mining, careful you can be charged a fee!
**!lb shop** : see what you can spent your hard earned bitcoins on
**!lb give [amount] @name** : give the amount of bitcoins to someone`)
        break;

        case 'bal':
            eco.FetchBalance(message.author.id).then((i) => {
                return message.channel.send(`**Your balance:** :money_with_wings: ${i.balance} ฿`);
            })
        break;

        case 'daily':
            var output = await eco.Daily(message.author.id)
        
            if (output.updated) {
                var profile = await eco.AddToBalance(message.author.id, 1000)
                message.reply(`You claimed your daily bitcoins successfully! You now own :money_with_wings: ${profile.newbalance} ฿.`);
            } else {
                message.channel.send(`Sorry, you already claimed your daily bitcoins!\nBut no worries, over ${output.timetowait} you can daily again!`)
            }
        break;

        case 'slots':
            var money = await eco.FetchBalance(message.author.id)
            if (!Number.isInteger(parseInt(args[1]))) {
                message.channel.send(`Wrong input!\nTry: **!lb slots [amount]**`);
            }
            var amount = args[1];
            if (money.balance < amount) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }

            var gamble = await eco.Slots(message.author.id, amount, {
                width: 3,
                height: 1
                }).catch(console.error)
                    message.channel.send(gamble.grid)
                    message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance} ฿`)
        break;

        case 'gamble':
            var money = await eco.FetchBalance(message.author.id)
            if (args[1] == 'all') {
                if (Math.round(Math.random()) == 1) {
                    var profile = await eco.AddToBalance(message.author.id, money.balance)
                    message.channel.send(`You won ${money.balance} ฿. You now own :money_with_wings: ${profile.newbalance} ฿. :partying_face: `);
                }
                else {
                    var profile = await eco.SubtractFromBalance(message.author.id, money.balance)
                    message.channel.send(`You lost ${money.balance} ฿. You now own :money_with_wings: ${profile.newbalance} ฿. :disappointed: `);
                }
                return;
            }
            if (!Number.isInteger(parseInt(args[1]))) {
                message.channel.send(`Wrong input!\nTry: **!lb gamble [amount]**`);
            }
            var amount = args[1];
            if (money.balance < amount) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            if (Math.round(Math.random()) == 1) {
                var profile = await eco.AddToBalance(message.author.id, parseInt(amount))
                message.channel.send(`You won ${parseInt(amount)} ฿. You now own :money_with_wings: ${profile.newbalance} ฿. :partying_face: `);
            }
            else {
                var profile = await eco.SubtractFromBalance(message.author.id, parseInt(amount))
                message.channel.send(`You lost ${parseInt(amount)} ฿. You now own :money_with_wings: ${profile.newbalance} ฿. :disappointed:`);
            }
        break;

        case 'top5':
            eco.Leaderboard({
                limit: 5,
                filter: x => x.balance > 0
            }).then(async users => {
                if (users[0]) var firstplace = await client.users.fetch(users[0].userid)
                if (users[1]) var secondplace = await client.users.fetch(users[1].userid)
                if (users[2]) var thirdplace = await client.users.fetch(users[2].userid)
                if (users[3]) var fourthplace = await client.users.fetch(users[3].userid)
                if (users[4]) var fifthplace = await client.users.fetch(users[4].userid)
                message.channel.send(`Top 5:
                **1** - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'} ฿
                **2** - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'} ฿
                **3** - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'} ฿
                **4** - ${fourthplace && fourthplace.tag || 'Nobody Yet'} : ${users[3] && users[3].balance || 'None'} ฿
                **5** - ${fifthplace && fifthplace.tag || 'Nobody Yet'} : ${users[4] && users[4].balance || 'None'} ฿`)
            })
        break;

        case 'mine':
            var output = await eco.Work(message.author.id, {
                failurerate: 51,
                money: Math.floor(Math.random() * 100),
                jobs: ['miner']
            })
            var profile = await eco.SubtractFromBalance(message.author.id, 10)
            if (output.earned == 0) return message.reply('Awh, you did not do your job well so you need to pay a fee of 10 ฿!\n')
           
            message.channel.send(`${message.author.username}
            You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned} ฿
            You now own :money_with_wings: ${output.balance} ฿`)
        break;

        case 'shop':
            message.reply(`\n**SHOP**\n
**!lb dogshit** will cost you 500฿
**!lb bababoi** will cost you 100฿
**!lb leb** will cost you 100฿
**!lb mebe** will cost you 100฿
**!lb zima** will cost you 100฿
**!lb sivonebo** will cost you 500฿
**!lb crnac** will cost you 500฿
**!lb paneno** will cost you 500฿
**!lb midjafree** will cost you 100฿
**!lb aljeured** will cost you 100฿`);
        break

        case 'dogshit':
            message.channel.send(`You paid 500฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 500) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 500)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/dogshit.mp3'
            playSound(voiceChannel, path)
        break;

        case 'bababoi':
            message.channel.send(`You paid 100฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 100) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 100)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/bababoi.mp3'
            playSound(voiceChannel, path)
        break;

        case 'leb':
            message.channel.send(`You paid 100฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 100) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 100)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/leb.mp3'
            playSound(voiceChannel, path)
        break;

        case 'zima':
            message.channel.send(`You paid 100฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 100) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 100)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/zima.mp3'
            playSound(voiceChannel, path)
        break;

        case 'sivonebo':
            message.channel.send(`You paid 500฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 500) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 500)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/sivonebo.mp3'
            playSound(voiceChannel, path)
        break;

        case 'crnac':
            message.channel.send(`You paid 500฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 500) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 500)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/crnac.mp3'
            playSound(voiceChannel, path)
        break;

        case 'paneno':
            message.channel.send(`You paid 500฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 500) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 500)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/paneno.mp3'
            playSound(voiceChannel, path)
        break;

        case 'mebe':
            message.channel.send(`You paid 100฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 100) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 100)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/mebe.mp3'
            playSound(voiceChannel, path)
        break;

        case 'aljeured':
            message.channel.send(`You paid 100฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 100) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 100)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/aljeured.mp3'
            playSound(voiceChannel, path)
        break;

        case 'midjefree':
            message.channel.send(`You paid 100฿`)
            var money = await eco.FetchBalance(message.author.id)
            if (money.balance < 100) {
                message.channel.send(`You dont have enough bitcoins!`);
                return;
            }
            var profile = await eco.SubtractFromBalance(message.author.id, 100)
            var voiceChannel = message.member.voice.channel;
            var path = './sound/midjefree.mp3'
            playSound(voiceChannel, path)
        break;

        case 'give':
            var user = message.mentions.users.first()
            var amount = args[1]
        
            if (!user || !amount) return message.reply('Checkout **!lb help**')
        
            var output = await eco.FetchBalance(message.author.id)
            if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to give!')
        
            var transfer = await eco.Transfer(message.author.id, user.id, amount)
            message.reply(`Success!\nBalance from ${message.author.tag}: ${transfer.FromUser}\nBalance from ${user.tag}: ${transfer.ToUser}`);
        break;
   }

   function playSound(voiceChannel, path) {
       if (!voiceChannel) return message.reply("You need to be in a voice channel");
           voiceChannel.join()
           .then(con => {
               const dispatcher = con.play(path);
               dispatcher.on('start', _ => console.log('started playing'));
               dispatcher.on('error', err => console.log);
           })
           .catch(console.error);
   }
})


client.login(token);