const IG = require('./crawler.js');

const instagramAPI = {
    
    UserInfo: (req, res) => {
        
        try {
            IG.UserInfo(req.query.username)
                .then(resp => {
                    res.status(200).send({
                        status: 200,
                        data: resp
                    });
                })
        } catch (error) {
            res.status(404).send({
                status: 404,
                message: error
            });
        }
    },
}

module.exports = instagramAPI