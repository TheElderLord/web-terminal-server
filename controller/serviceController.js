
const { NOMAD_HOST, TERMINAL_PORT } = require('../constants');
const nomadSoap = require('../nomadSoap');
const soap = new nomadSoap(NOMAD_HOST, TERMINAL_PORT);

exports.getServices = async (req, res) => {
    const { branchId, queueId } = req.body;
    console.log(req.body)
    if (!branchId) {
        return res.status(400).json({
            message: 'Branch ID is required'
        });
    }
    try {
        const queue = queueId ? queueId : '?';
        soap.servicesList(branchId, queue, function (data) {

            // console.log(data);
            res.status(200).json({
                message: 'Success',
                content: data
            })
        })
    } catch (err) {
        console.log(err)
    }
}

exports.sendEventNow = async (req, res) => {
    // console.log(req.body);
    // const soap = new nomadSoap(NOMAD_HOST, 3857);
    const { queueId, iin, branchId, local } = req.body;
    if (!queueId || !branchId || !local) {
        res.status(400).json({
            message: 'Bad request'
        });
    }
    console.log(local);
    
    try {
        soap.eventNow(queueId, iin, branchId, local, function (data) {
            // console.log(data);  
            res.status(200).json({
                message: 'Success',
                data: data,
            });
        })
    } catch (err) {

        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }
};

exports.print_tick = async (req, res) => {
    const { soapBody, local } = req.body;
    console.log("REQ body", req.body);
    try {
        soap.printTicket(soapBody, local, false, function (data) {
            res.status(200).json({
                message: 'Success',
                data: data,
            });
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error'
        });
    }

};