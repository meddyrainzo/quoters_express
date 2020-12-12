db.users.drop();
db.users.insertMany([
    {
        _id: ObjectId('5dae58764330512bdc80776a'),
        firstname: "Randy",
        lastname: "Savage",
        email: "randy@savage.com",
        // password is RandySavage
        password: '$2y$10$dv2.YEaDEhdMzyR0MtECX.r5tsg4d6siC28YkI2ixmgJA0hlGD11G',
        registered_on: new Date().getUTCDate()
    },
    {
        _id: ObjectId('5dae58764680512bdc80397f'),
        firstname: "Richman",
        lastname: "Meddy",
        email: "richie@meddy.com",
        // Password is RichmanMeddy
        password: '$2y$10$27ajUyYCgpBYUZFVNTTMsuwdgVr7u/PRr55wt13H/pd2HbgLld8Le',
        registered_on: new Date().getUTCDate()
    }
]);