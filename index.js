const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const SUPER_ADMIN = '233557632802';
const BOT = '233551687450';
const BOT_PUSHNAME = 'Ethereal';
let IS_MUTED = false;



// --------------------------------------------------
// Data
// --------------------------------------------------
const CLASSES = [
    {
        day: 'Monday',
        classes: [
            '_Formal Methods_ | ⏰5:30pm | 🏠N3'
        ]
    },
    {
        day: 'Tuesday',
        classes: [
            '_Accounting_ | ⏰5:30pm | 🏠JQB23'
        ]
    },
    {
        day: 'Wednesday',
        classes: [
            '_Compilers_ | ⏰9:30am | 🏠E10',
            '_Theory & Survey_ | ⏰3:30pm | 🏠JQB09',
            '_Soft. Modelling_ | ⏰5:30pm | 🏠LOT1'
        ]
    },
    {
        day: 'Thursday',
        classes: [
            '_Project_ | ⏰8:30am | 🏠Online',
            '_Formal Methods_ | ⏰12:30pm | 🏠JQB19',
            '_Accounting_ | ⏰6:30pm | 🏠E10'
        ]
    },
    {
        day: 'Friday',
        classes: [
            '_Soft. Modelling_ | ⏰9:30am | 🏠N3',
            '_Theory & Survey_ | ⏰10:30am | 🏠N3',
            '_Compilers_ | ⏰4:30pm | 🏠NNB2'
        ]
    }
]



// --------------------------------------------------
// Configurations
// --------------------------------------------------

const client = new Client({
    authStrategy: new LocalAuth() // to persist client session
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('auth_failure', () => {
//     console.log('Client failed to authenticate!');
// });

// client.on('authenticated', () => {
//     console.log('Client was authenticated successfully!');
// });



// --------------------------------------------------
// Helper functions
// --------------------------------------------------
const pickRandomReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
}


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Ping
client.on('message', msg => {
    if (msg.body === '!ping' && !IS_MUTED) {
        msg.reply('pong');
    }
});


// Mention everyone
client.on('message', async (msg) => {
    if (msg.body === '!everyone' && !IS_MUTED) {
        const contact = await msg.getContact();
        if (contact.id.user !== SUPER_ADMIN) {
            await msg.reply("Only the boss can use this, so you don't abuse it🐦");
            return;
        }
        const chat = await msg.getChat();

        let text = "";
        let mentions = [];

        if (chat.participants) {
            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                text += `@${participant.id.user} `;
                // console.log(participant);
            }

            await chat.sendMessage(text, { mentions });
        } else {
            await msg.reply("Can't do this - I may break :(");
            console.log('No participants - probably not a group chat!');
        }
    }
});


// Reply if pinged
client.on('message', async (msg) => {

    if (msg.body[0] === '@' && !IS_MUTED) {
        const first_word = msg.body.split(' ')[0];
        const contact = await msg.getContact();

        const PING_REPLIES = [
            `${contact.id.user !== SUPER_ADMIN ? "I'm not your bot shoo🐦" : "Need me sir?"}`,
            `I'm here ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Alive and well ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Speak forth ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `${contact.id.user !== SUPER_ADMIN ? "Shoo🐦" : "Sir 🐦"}`,
            `${contact.id.user !== SUPER_ADMIN ? "🙄" : "Boss 🐦"}`,
            `Up and running 🐦`,
            `🙋🏽‍♂️`,
            `👋🏽`,
            `🐦`,
            `👀`,
            `Adey 🐦`,
            `Yo 🐦`,
        ]

        // console.log("first word:", first_word);
        if (first_word.slice(1, first_word.length) === BOT) {
            await msg.reply(pickRandomReply(PING_REPLIES));
        }
    }
});


// Mute
client.on('message', async (msg) => {
    if ((msg.body === '!🤫' || msg.body === '!mute' || msg.body === '!silence') && !IS_MUTED) {
        const contact = await msg.getContact();
        if (contact.id.user === SUPER_ADMIN) {
            const MUTE_REPLIES = [
                'Yes sir',
                'Roger that🐦',
                'Sigh...oki',
                '👍🏽',
                'Got it 👍🏽',
                '🤐👍🏽'
            ]
            await msg.reply(pickRandomReply(MUTE_REPLIES));
            IS_MUTED = true;
        }
    }
})


// Unmute
client.on('message', async (msg) => {
    if ((msg.body === '!unmute' || msg.body === '!speak') && IS_MUTED) {
        const contact = await msg.getContact();
        if (contact.id.user === SUPER_ADMIN) {
            const UNMUTE_REPLIES = [
                'Thanks sir',
                'Finally🐦',
                '🥳',
                'Speaking freely now 👍🏽',
            ]
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            IS_MUTED = false;
        }
    } else if ((msg.body === '!unmute' || msg.body === '!speak') && !IS_MUTED) {
        await msg.reply(`Haven't been muted ${contact.id.user !== SUPER_ADMIN ? "fam" : "sir "}🐦`);
    }
})


// Help
client.on('message', async (msg) => {
    if (msg.body === '!help' && !IS_MUTED) {
        await msg.reply(
            `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n*!ping*: check if I'm available🙋🏽‍♂️\n*!help*: get commands that can be used with me\n*!mute*: get me to be quiet😅\n*!unmute*: opposite of command above🙂\n*!everyone*: ping everyone in the group😮`
        )
    }
})


// Check classes for the week
client.on('message', async (msg) => {
    if (msg.body === '!classes' && !IS_MUTED) {
        let text = "If *Software Modelling* is your elective:\n\n";
        CLASSES.forEach(class_obj => {
            text = text + "*" + class_obj.day + "*:\n" + class_obj.classes.map(course => course + "\n").join('') + "\n";
            // added join('') to map() to remove the default comma after each value in array
        })
        await msg.reply(text);
    }
})


// Check class for today
client.on('message', async (msg) => {
    if (msg.body === '!class' && !IS_MUTED) {
        await msg.reply(
            "*Today's classes* ☀\n\n✅ *Done*:\n⏳ *In session*:\n💡 *Upcoming*:\n"
        )
    }
})


// Send a direct message to a user
client.on('message', async (msg) => {
    if (msg.body === '!dm' && !IS_MUTED) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();

        chat_from_contact.sendMessage("Sliding in DM - ☀");
    }
})




client.initialize();