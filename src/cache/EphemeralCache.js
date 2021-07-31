let interactions = [];

class InteractionCache extends null {
    static put(interaction) {
        if (!interactions.find(val => val === interaction)) {
            interactions.push(interaction);
            setTimeout(() => {
                interactions.splice(interactions.indexOf(interaction), 1);
            }, 900000);
        }
    }
}

module.exports = InteractionCache;