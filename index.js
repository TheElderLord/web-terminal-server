

const express = require('express');
const cors = require('cors');


const serviceRouter = require('./routes/serviceRouter');

const bookRouter = require('./routes/bookRouter');
const ratingRouter = require('./routes/ratingRouter');



const app = express();
app.use(cors());
app.use(express.json());


app.use('/services', serviceRouter);
app.use('/booking',bookRouter)
app.use('/rate',ratingRouter)




// app.use('/booked-event-now',bookedEventNowRouter);
// app.use('/branches',branchesRouter);
// app.use('/days',daysRouter);
// app.use('/slots',SlotRouter);
// app.use('/reserve',reserveRouter);



const port = process.env.APP_PORT;
const host = process.env.APP_HOST || "localhost";


app.listen(port,host, () => {
    console.log(`Server is running on  ${host}:${port}`);
});

