const { NOMAD_HOST, TERMINAL_PORT } = require('../constants');
const nomadSoap = require('../nomadSoap');
const soap = new nomadSoap(NOMAD_HOST, TERMINAL_PORT);


exports.getBookedTicket = async (req, res) => {
    const { bookCode, local } = req.body;
    if (!bookCode) {
        return res.status(400).json({ message: 'Book code is required' })
    }
    try {
        soap.bookedEventNowCode(bookCode, local, function (data) {
            res.status(201).json({
                code: data,
                message: 'Success'
            });
        })
    } catch (err) {
        console.log(err)
    }

}

exports.getWebServices = async (req, res) => {
    const queryId = req.body.queueId ? req.body.queueId : '?';
    const branchId = req.body.branchId;
    if (!branchId) {
        return res.status(500).json({
            message: 'Bad request'
        })
    }
    try {
        soap.webServicesList(branchId, queryId, function (data) {
            // console.log(data);  
            res.status(200).json({
                message: 'Success',
                data: data
            })
        })
    } catch (err) {
        res.status(500).json({
            message: 'Failed',
        })
    }

}

exports.getDays = async (req, res) => {

    const branchId = req.body.branchId;
    soap.daysList(branchId, function (data) {
        // console.log(data);
        const nowMonth = new Date();
        console.log(nowMonth.getMonth())
        const result = data.split(";").map(e => {
          
            const mont = nowMonth.getMonth() + 1;
            const year = nowMonth.getFullYear();
            if(e.length == 1){
                if(mont == 1){
                    return `0${e}.0${mont}.${year}`
                }
                else  return  `0${e}.${mont}.${year}`
            }  
            else{
                if(mont == 1){
                    return  `${e}.0${mont}.${year}`
                }
                else  return`${e}.${mont}.${year}`
            } 
            // if (e.trim() != '' && e.trim() != null) {
            //     return e = e + "." +  + "." + nowMonth.getFullYear()

            // }

        })
        res.send(result);
        res.end;
    })

}

exports.getTime = async (req, res) => {
    const { branchId, queueId, day } = req.body;

    soap.slots(queueId, branchId, day, function (data) {
        console.log(data);
        const result = data.map(e => {
            const a = parseInt(e.count[0]);
            if (a > 0) {
                return {
                    hour: e.hour[0],
                    minute: e.slot[0] == '1' ? '00-15' : e.slot[0] == '2' ? '15-30' : e.slot[0] == '3' ? '30-45' : '45-59',
                    count: e.count[0]
                }
            }
        })
        res.send(result);
        res.end;
    })
}

exports.reserveTicket = async (req, res) => {
    const { queueId, iin, branchId, time } = req.body;
    soap.reserveQueue(queueId, iin, branchId, time, function (data) {
        console.log(data); 
        if(!data || data == "Error"){
            return res.status(500).json({message:"Failed"})
        } 
        res.send(data);
        res.end;
    })
}
