function makeUsersArray() {
    return[
        {
            "id": 1,
            "fullname": "Dunder Mifflin",
            "username": "dunder",
            "password": "password",
            "employer": false
        },
        {
            "id": 2,
            "fullname": "Jason Bourne",
            "username": "jason",
            "password": "jason",
            "employer": false
        },
        {
            "id": 3,
            "fullname": "Jasmin Guy",
            "username": "jasmine",
            "password": "jasmine",
            "employer": false
        },
        {
            "id": 4,
            "fullname": "Sam Smith",
            "username": "sam",
            "password": "sam",
            "employer": true
        },
        {
            "id": 5,
            "fullname": "Christopher Nolan",
            "username": "chris",
            "password": "chris",
            "employer": true
        },
        {
            "id": 6,
            "fullname": "Steven Spielberg",
            "username": "steve",
            "password": "steve",
            "employer": true
        }
    ]
}
module.exports={
    makeUsersArray,
}