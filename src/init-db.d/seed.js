print('##################### SEEDING #####################');

db.createUser(
    {
        user: 'meddy',
        pwd: 'password',
        roles: [{ role: 'readWrite', db: 'qexpress' }]
    }
);

db.createCollection('users');

const insert = db.users.save([
    {
        _id: ObjectId('5dae58764330512bdc80776a'),
        firstname: "Randy",
        lastname: "Savage",
        email: "randy@savage.com",
        // password is RandySavage
        password: '$2a$10$UJySsYok2ofutSll6LuSNeHEDUwkG7VOwnX6w6uRJuBmr7FWltGfy',
        registered_on: new Date()
    },
    {
        _id: ObjectId('5dae58764680512bdc80397f'),
        firstname: "Richman",
        lastname: "Meddy",
        email: "richie@meddy.com",
        // Password is RichmanMeddy
        password: '$2a$10$.tEE.q8lclV0CJze3nwL0.c94Fm5fuqjwXeHtNQkDIRkWhQnG/HtW',
        registered_on: new Date()
    }
]);

print('##################### FINISHED #####################');