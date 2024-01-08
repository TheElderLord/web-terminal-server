const { NOMAD_HOST, TERMINAL_PORT } = require('../constants');
const nomadSoap = require('../nomadSoap');
const soap = new nomadSoap(NOMAD_HOST, TERMINAL_PORT);


exports.rate =  async(req,res) =>{
    const {orderNum,rating} = req.body;
    // console.log('Rating',req.body);
    try {
        soap.rating(orderNum,rating, function (data) {
            if(data == "Reported"){
                return res.status(200).json({
                    message:"REP"
                })
            }
            else if(data == "Success"){
            res.status(200).json({
                message: 'Success',
                // data: data,
            });
            }
            else{
                res.status(500).json({
                    message: 'Error',
                    // data: data,
                });
            }      
        })
    } catch (err) {

        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
}

exports.check = async(req,res)=>{
    
}

