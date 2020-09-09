const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const port = 3001;
const directory = './diffImage/';
const looksSame = require('looks-same');

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.post('/compare', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                SuccessProcess: false,
                Message: 'No file uploaded'
            });
        } else {
            let actualImage = req.files.actual.data;
            let expectedImage = req.files.expected.data;
            looksSame(actualImage, expectedImage, (error, result) => {
                console.log(result.equal);
                if (result.equal === false) {
                    looksSame.createDiff({
                        reference: expectedImage,
                        current: actualImage,
                        diff: getName(req.query.testName),
                        highlightColor: '#ff00ff',
                        strict: true
                    }, function (error) {
                    });
                    res.send({
                        IsSame: false,
                        SuccessProcess: true,
                        Message: 'File is uploaded'
                    });
                } else {
                    res.send({
                        IsSame: true,
                        SuccessProcess: true,
                        Message: 'File is uploaded'
                    });
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);

let getName = (name) => directory + name + '.png';
