function makeAppliedArray() {
    return[
        {
            "id": 1,
            "completed": false,
            "user_id": 1,
            "job_id": 1,
        },
        {
            "id": 2,
            "completed": false,
            "user_id": 1,
            "job_id": 2,
        },
        {
            "id": 3,
            "completed": false,
            "user_id": 2,
            "job_id": 2,
        }
    ]
}
module.exports={
    makeAppliedArray,
}