const router = require('express').Router()

router.get('/', (req, res) => {
    const query = req.query.id

   return res.status(200).json(query)
})



module.exports = router