var NomadSoap = function (host, port) {
  var
    request = require('request'),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser({
      trim: true,
      normalizeTags: true,
      normalize: true,
      stripPrefix: true,
      mergeAttrs: true
    }),
    serverUrl = 'http://' + host + ":" + port,
    requests = {
      getServicesList: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalMenuList_Input><cus:ParentQueueIdTerminal>$queueId</cus:ParentQueueIdTerminal><cus:BranchQueueId>$branchId</cus:BranchQueueId></cus:NomadTerminalMenuList_Input></soapenv:Body></soapenv:Envelope>',
      TerminalEventNow: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalEvent_Now_Input><cus:QueueId_Now>$queueId</cus:QueueId_Now><cus:IIN>$iin</cus:IIN><cus:BranchId>$branchId</cus:BranchId><cus:channel>terminal</cus:channel><cus:local>$local</cus:local></cus:NomadTerminalEvent_Now_Input></soapenv:Body></soapenv:Envelope>',
      BookedEventNow: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:Nomad_BookedEventNow_Input><cus:IINBookedNow>$iin</cus:IINBookedNow><cus:local>$local</cus:local></cus:Nomad_BookedEventNow_Input></soapenv:Body></soapenv:Envelope>',
      BranchList: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalBranchList_Input><cus:BranchList>?</cus:BranchList></cus:NomadTerminalBranchList_Input></soapenv:Body></soapenv:Envelope>',
      getWebServicesList: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadWebMenuList_Input><cus:ParentQueueId>$queueId</cus:ParentQueueId> <cus:BranchQueueId>$branchId</cus:BranchQueueId></cus:NomadWebMenuList_Input></soapenv:Body></soapenv:Envelope>',
      getDays: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalBranchWorkDays_Input><cus:BranchDaysId>$branchId</cus:BranchDaysId></cus:NomadTerminalBranchWorkDays_Input></soapenv:Body></soapenv:Envelope>',
      getSlots: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalEvent_Slot_Input><cus:QueueIdSlot>$queueId</cus:QueueIdSlot><cus:BranchId>$branchId</cus:BranchId><cus:Time>$day</cus:Time></cus:NomadTerminalEvent_Slot_Input></soapenv:Body></soapenv:Envelope>',
      book: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalEvent_Input><cus:QueueId>$queueId</cus:QueueId><cus:IIN>$iin</cus:IIN><cus:BranchId>$branchId</cus:BranchId><cus:Time>$time</cus:Time><cus:Phone>?</cus:Phone><cus:channel>terminal</cus:channel></cus:NomadTerminalEvent_Input></soapenv:Body></soapenv:Envelope>',
      rating: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:NomadTerminalTicketRatingOrder_Input><cus:EventRatingOrder>$orderNum</cus:EventRatingOrder><cus:Rating>$mark</cus:Rating></cus:NomadTerminalTicketRatingOrder_Input></soapenv:Body></soapenv:Envelope>',
      bookEventCode: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://nomad.org/CustomUI"><soapenv:Header/><soapenv:Body><cus:Nomad_BookedEventOrderNow_Input><cus:OrderBookedNow>$bookCode</cus:OrderBookedNow><cus:local>$local</cus:local></cus:Nomad_BookedEventOrderNow_Input></soapenv:Body></soapenv:Envelope>'
    },
    printTicket = function (event_info, local, booked) {
      try {
        let exec = require('child_process').execFile;
        local = local.toLowerCase()
        // console.log(event_info)
        let sec = event_info["cus:starttime"][0]
        sec = parseInt(sec)

        let time = new Date(sec)
        let normalDate = time.toLocaleString()
        const fs = require('fs')
        let service_name;
        if (booked === true) {
          if (local === "ru") {
            service_name = event_info["cus:servicename"][0] + " БРОНИРОВАНО"
          } else if (local === "kz") {
            service_name = event_info["cus:servicename"][0] + " БРОДАЛҒАН"
          } else if (local === "en") {
            service_name = event_info["cus:servicename"][0] + " BOOKED"
          }

        } else {
          service_name = event_info["cus:servicename"][0]
        }



        fs.writeFileSync('1.txt', event_info["cus:ticketno"][0] + "\r\n")
        fs.appendFileSync('1.txt', service_name + "\r\n");
        fs.appendFileSync('1.txt', "\r\n");
        fs.appendFileSync('1.txt', normalDate + "\r\n");
        fs.appendFileSync('1.txt', local + "\r\n");
        fs.appendFileSync('1.txt', "\r\n");
        fs.appendFileSync('1.txt', "\r\n");
        fs.appendFileSync('1.txt', "\r\n");
        fs.appendFileSync('1.txt', "\r\n");
        fs.appendFileSync('1.txt', "\r\n");
        exec('NomadPrint.exe', function (err, data) {
          console.log(err)
        });

        //file written successfully
      } catch (err) {
        console.error(err)
      }

    },
    branchList = function (callback) {
      var body = requests.BranchList;
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log('Error: ' + err);
              else {
                let branch_list = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalbranchlist_output'][0].branch

                return (callback(branch_list));
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    bookedEventNow = function (iin, local, callback) {
      var body = requests.BookedEventNow;
      body = body.replace('$iin', iin);
      body = body.replace('$local', local);
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              let event_info;
              if (err) console.log('Error: ' + err);
              else {
                try{
                  let event_err = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_output']
                  if (typeof (event_err) === 'undefined') {
                    event_info = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_now'][0]
                    console.log(event_info)
                    printTicket(event_info, local, true);
                  } else {
                    event_info = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_output'][0]['cus:nomadterminalerr_output'][0]['cus:message'][0]
                  }
                  return (callback(event_info));
                }catch(err){
                  console.log(err);
                }
               
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    eventNow = function (queueId, iin, branchId, local, callback) {
      var body = requests.TerminalEventNow;
      body = body.replace('$queueId', queueId);
      body = body.replace('$iin', iin);
      body = body.replace('$branchId', branchId);
      body = body.replace('$local', local);


      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log('Error: ' + err);
              else {
                try {
                  // console.log(result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_now'])
                  let event_info = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_now'][0];
                  console.log(event_info)
                  // printTicket(event_info, local, false);

                  return (callback(event_info));
                } catch (err) {
                  console.log(err)
                }
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });

    },
    reserveQueue = function (queueId, iin, branchId, time, callback) {
      var body = requests.book;
      body = body.replace('$queueId', queueId);
      body = body.replace('$iin', iin);
      body = body.replace('$branchId', branchId);
      body = body.replace('$time', time);
      console.log(body)
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log('Error: ' + err);
              else {
                try{
                  // console.log("Result",result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_output'][0])
                  let event_info = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_output'][0]
                  ['cus:code']
                  return (callback(event_info));
                }catch(err){
                  console.log(err)
                  return callback("Error")
                }
                
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    servicesList = function (branchId, queueId, callback) {
      var body = requests.getServicesList;
      console.log(queueId)
      body = body.replace('$branchId', branchId);
      body = body.replace('$queueId', queueId);
      console.log(body)
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);//console.log('Error: ' + error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log(err);//console.log('Error: ' + err);
              else {
                try {
                  var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalqueuelist'][0]['xsd:complextype'][1]['xsd:element'];
                  console.log(temp)
                  if (typeof temp !== 'undefined') {

                    return callback(temp);
                  }
                  else {
                    return callback([]);
                  }
                } catch (err) {
                  console.log(err)
                }

              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    webServicesList = function (branchId, queueId, callback) {
      var body = requests.getWebServicesList;
      // console.log(queueId)
      body = body.replace('$branchId', branchId);
      body = body.replace('$queueId', queueId);
      // console.log(body)
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);//console.log('Error: ' + error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log(err);//console.log('Error: ' + err);
              else {
                try {
                  var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadwebqueuelist'][0].webqueuelist
                  // console.log(temp)
                  if (typeof temp !== 'undefined') {

                    return callback(temp);
                  }
                  else {
                    return callback([]);
                  }
                } catch (err) {
                  console.log(err)
                }
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    daysList = function (branchId, callback) {
      var body = requests.getDays;
      body = body.replace('$branchId', branchId);
      console.log(body)
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);//console.log('Error: ' + error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log(err);//console.log('Error: ' + err);
              else {
                try {
                  var temp = result['soapenv:envelope']['soapenv:body'][0]['soapenv:envelope'][0]['soapenv:body'][0]['cus:nomadterminalbranchworkdays'][0]['cus:days'][0]
                  console.log(temp)
                  if (typeof temp !== 'undefined') {

                    return callback(temp);
                  }
                  else {
                    return callback([]);
                  }

                } catch (err) {
                  console.log(err)
                }

              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    slots = function (queueId, branchId, day, callback) {
      var body = requests.getSlots;
      body = body.replace('$queueId', queueId);
      body = body.replace('$branchId', branchId);
      body = body.replace('$day', day);
      console.log(body)
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);//console.log('Error: ' + error);
          else if (response.statusCode == 200) {
            parser.parseString(body, function (err, result) {
              if (err) console.log(err);//console.log('Error: ' + err);
              else {
                try {
                  var temp = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_slot'][0].slot
                  console.log(temp)
                  if (typeof temp !== 'undefined') {

                    return callback(temp);
                  }
                  else {
                    return callback([]);
                  }
                } catch (err) {
                  console.log(err)
                }
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    },
    rating = function (orderNum, rating, callback) {
      var body = requests.rating;
      body = body.replace("$orderNum", orderNum);
      body = body.replace("$mark", rating);
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
        parser.parseString(body, function (err, result) {
              if (err) console.log(err);//console.log('Error: ' + err);
              else {
                try {
                  
                  var temp = result['soapenv:envelope']['soapenv:body'][0];
                
                  if (temp.includes("Event")) {

                    return callback("Reported");
                  }
                  else {
                    return callback("Success");
                  }
                } catch (err) {
                  console.log(err)
                  return callback("Error")
                }
              }
            });
        });

    },
    bookedEventNowCode = function (code, local, callback) {
      local = "ru";
      var body = requests.bookEventCode;
      console.log(body)
      body = body.replace('$bookCode', code);
      body = body.replace('$local', local);
      request.post(
        {
          url: serverUrl,
          body: body
        },
        function (error, response, body) {
          if (error) console.log(error);
          else if (response.statusCode == 200) {

            parser.parseString(body, function (err, result) {
              let event_info;
              if (err) console.log('Error: ' + err);
              else {
                try {
                  let event_err = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_output']
                  if (typeof (event_err) === 'undefined') {
                    event_info = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_now'][0]
                    // console.log(event_info)
                    // printTicket(event_info, local, true);
                  } else {
                    event_info = result['soapenv:envelope']['soapenv:body'][0]['cus:nomadterminalevent_output'][0]['cus:nomadterminalerr_output'][0]['cus:message'][0]
                  }
                  return (callback(event_info));
                } catch (err) {
                  console.log(err)
                }
              }
            });
          }
          else {
            console.log(response.statusCode);//console.log('error: '+ response.statusCode);
          }
        });
    }




  return {
    servicesList: servicesList,
    eventNow: eventNow,
    bookedEventNow: bookedEventNow,
    branchList: branchList,
    webServicesList: webServicesList,
    daysList: daysList,
    slots: slots,
    reserveQueue: reserveQueue,
    printTicket: printTicket,
    rating: rating,
    bookedEventNowCode: bookedEventNowCode
  };
};

module.exports = NomadSoap;