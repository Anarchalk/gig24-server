function makeAuthArray() {
    return[
        {
            "id": 1,
            "fullname": "Dunder Mifflin",
            "username": "dunder",
            "password": "password",
            "employer": false
        },
        {
            "id": 4,
            "fullname": "Sam Smith",
            "username": "sam",
            "password": "sam",
            "employer": true
        },
      
    ]
}
module.exports={
    makeAuthArray,
}