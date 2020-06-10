function makeEmpProfileArray() {
    return [
        {
            'id': 1,
            'company_name': 'Orion Studios',
            'phone': '111-111-1111' ,
            'location': 'Los Angeles,CA', 
            'about_us':  'Since 1903',
            'email': 'info@orion.com',
            'fax': '444-444-4444',
            'website':'http://www.orion.com',
            'user_id': 4
        },
        {
            'id': 2,
            'company_name': 'Bad Robot Films',
            'phone': '222-222-2222', 
            'location': 'New York, NY',  
            'about_us': 'Produces starwars',
            'email': 'info@badrobot.com',
            'fax': '555-555-5555',
            'website':'http://www.badrobot.com',
            'user_id': 5
        },
        {
            'id': 3,
            'company_name': 'Paramount Studios', 
            'phone': '333-333-3333', 
            'location': 'Chicago, IL', 
            'about_us': 'Best in the business',
            'email': 'info@paramount.com', 
            'fax': '666-666-6666', 
            'website':'http://www.paramount.com',
            'user_id': 6
        },
    ]

}
module.exports={
    makeEmpProfileArray,
}