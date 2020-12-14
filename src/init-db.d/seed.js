print('##################### SEEDING #####################');

db.createUser(
    {
        user: 'meddy',
        pwd: 'password',
        roles: [{ role: 'readWrite', db: 'qexpress' }]
    }
);

db.createCollection('users');

db.users.save([
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
    },
    {
        _id: ObjectId('5ead587cb330eff35880997a'),
        firstname: "Fat",
        lastname: "Dog",
        email: "fat@dog.com",
        // password is RandySavage
        password: '$2a$10$UJySsYok2ofutSll6LuSNeHEDUwkG7VOwnX6w6uRJuBmr7FWltGfy',
        registered_on: new Date()
    },
]);

db.createCollection('quotes');

db.quotes.save([
    {
        _id: ObjectId('5dae58764330512bdc80776a'),
        quote: 'Everything that has a beginning has an end',
        author: 'Agent Smith',
        posted_by: '5dae58764680512bdc80397f',
        likes: ['5dae58764330512bdc80776a'],
        posted_on: new Date()
    },
    {
        _id: ObjectId('5dae58764680512bdc80397f'),
        quote: 'With great power comes great responsibility',
        author: 'Uncle Ben',
        posted_by: '5dae58764330512bdc80776a',
        likes: [],
        posted_on: new Date()
    },
    {
        _id: ObjectId('7eae59764680125efc80310f'),
        quote: 'My my, here comes the fuzz',
        author: 'Hot fuzz',
        posted_by: '5dae58764680512bdc80397f',
        likes: [],
        posted_on: new Date()
    }
])

print('##################### FINISHED #####################');