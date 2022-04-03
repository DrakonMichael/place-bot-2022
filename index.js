const puppeteer = require('puppeteer');
const fs = require('fs');
let Jimp = require('jimp');
let widejoyData = require("./imgdata.json");
let accounts = require("./accounts.json");

let ad = {};
let totalPixels = 0;
let totalIncorrect = 0;
let hide = true;

let botPixelsPlaced = 0;
let startTimestamp = Date.now();

let TOP_LEFT = {x: 110, y: 805}
let WIDTH = 120
let HEIGHT = 25

Jimp.read('./input.png', (err, img) => {
    if (err) throw err;
    let arr = [];
    for(let x = 0; x < WIDTH; x++) {
        for(let y = 0; y < HEIGHT; y++) {
            let color = Jimp.intToRGBA(img.getPixelColor(x, y));
            if(!arr[x]) {
                arr[x] = [];
            }

            let {r, g, b, a} = color;
            let name = "";

            if(r === 0 && g === 0 && b === 0) { name = "black" };
            if(r === 81 && g === 233 && b === 244) { name = "light blue" };
            if(r === 255 && g === 255 && b === 255) { name = "white" };
            if(r === 137 && g === 141 && b === 144) { name = "gray" };
            if(r === 156 && g === 105 && b === 38) { name = "brown" };
            if(r === 255 && g === 153 && b === 170) { name = "light pink" };
            if(r === 180 && g === 74 && b === 192) { name = "purple" };
            if(r === 129 && g === 30 && b === 159) { name = "dark purple" };
            if(r === 212 && g === 215 && b === 217) { name = "light gray" };
            if(r === 255 && g === 214 && b === 53) { name = "yellow" };
            if(r === 36 && g === 80 && b === 164) { name = "dark blue" };
            if(r === 255 && g === 69 && b === 0) { name = "red" };
            if(r === 255 && g === 168 && b === 0) { name = "orange" };
            if(r === 126 && g === 237 && b === 86) { name = "light green" };
            if(r === 0 && g === 163 && b === 104) { name = "dark green" };
            if(r === 54 && g === 144 && b === 234) { name = "blue" };
            if(r === 69 && g === 69 && b === 69) { name = "NOCOLOR" };

            if(name === "") {
                console.log("ERROR! Tile " + x + "," + y + " MISSING COLOR");
                process.exit(1);
            }

            let c = {rgb: color, name: name};


            arr[x][y] = c;
        }
    }
    console.clear();
    console.log("\x1b[36m###\x1b[0m Program by DrakonMichael @ \x1b[35mhttps://github.com/DrakonMichael\x1b[0m \x1b[36m###\x1b[0m\n\n");

    console.log("\x1b[31mPRESTART\x1b[0m   ./input.png serialized to ./imgdata.json");
    fs.writeFileSync('imgdata.json', JSON.stringify(arr));
    console.log("\x1b[31mPRESTART\x1b[0m   Initializing core bot collection processes...");
    console.log("\x1b[31mPRESTART\x1b[0m   Setting process maximum listeners to 999");
    process.setMaxListeners(999);
    console.log("\x1b[31mPRESTART\x1b[0m   Checking account presence");
    for(let i = 0; i < Object.keys(accounts).length; i++) {
        let username = Object.keys(accounts)[i];
        let password = accounts[username];
        if(!username || !password) {
            console.log("\x1b[31mPRESTART\x1b[0m   Error in ./accounts.json");
            process.exit(1);
        }
    }
    console.log("\x1b[31mPRESTART\x1b[0m   Starting program");

});






function updateScreen() {
    console.clear();
    console.log("\x1b[36m###\x1b[0m Program by DrakonMichael @ \x1b[35mhttps://github.com/DrakonMichael\x1b[0m \x1b[36m###\x1b[0m\n\n");
    console.log("\x1b[1m\x1b[31mNARROW THEIR OPTIONS // WIDEN OUR JOY!\x1b[0m");
    console.log("\x1b[1m\x1b[31mR/VALORANT WIDEJOY BOT PROJECT\n\n\x1b[0m");
    console.log("\x1b[1m\x1b[36m### USING CONFIG DEFINED BY ./imgdata.json ###\x1b[0m");
    console.log("\x1b[1m\x1b[36m### USING ACCOUNTS DEFINED BY ./accounts.json ###\n\x1b[0m");

    // accounts
    for(let i = 0; i < Object.keys(ad).length; i++) {
        let acc = ad[Object.keys(ad)[i]];
        let pw = acc.password;
        if(hide) {
            pw = "**HIDDEN**"
        }
        acc.eta = (acc.eta - 1.0).toFixed(1);
        if(acc.eta < 0) {
            acc.eta = 0
        }
        let stcol = acc.status === "OK" ? "\x1b[32m" : (acc.status === "INIT" ? "\x1b[35m" : "\x1b[31m");

        console.log(`\x1b[1m<${i}> ${stcol}${acc.status}\x1b[0m (\x1b[36m${acc.username}\x1b[0m, \x1b[36m${pw}\x1b[0m) // \x1b[32mETA: ${acc.eta}\x1b[0m // \x1b[33m${acc.action}\x1b[0m`);
    }

    if(totalPixels === 0) {
        console.log("\n\n\x1b[1m\x1b[31mNO PIXEL DATA\x1b[0m");
    } else {
        console.log("\n\nDetected \x1b[31m" + totalIncorrect + "\x1b[0m incorrect pixels.");
        console.log(`Pixels correct: \x1b[32m${totalPixels-totalIncorrect}\x1b[0m/\x1b[32m${totalPixels}\x1b[0m. Accuracy \x1b[32m${(((totalPixels-totalIncorrect)/totalPixels)*100).toFixed(3)}\x1b[0m%`)
    }


}

setInterval(() => {
    updateScreen();
}, 1000)



const getColorIndicesForCoord = (x, y, width) => {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
};

for(let i = 0; i < Object.keys(accounts).length; i++) {
    let username = Object.keys(accounts)[i];
    let password = accounts[username];
    setTimeout(() => {
        createAccount(username, password);
    }, i * 15000);
}

 async function createAccount(username, password) {
        ad[username] = {status: "INIT", username: username, password: password, eta: "N/A", action: "Initializing"};
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        ad[username].action = "Navigating to login";
        await page.goto('https://www.reddit.com/login/');
        ad[username].action = "Logging in";
        await page.type('#loginUsername', username)
        await page.type("#loginPassword", password)
        await page.click("body > div > main > div.OnboardingStep.Onboarding__step.mode-auth > div > div.Step__content > form > fieldset:nth-child(8) > button");
        await page.waitForNavigation({'waitUntil':'domcontentloaded'});
        ad[username].action = "Redirecting to r/place";


        await page.goto('https://www.reddit.com/r/place/?cx=' + 0 + '&cy=' + 0 + '&px=17');
        /*await page.waitForSelector("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(7) > div");
        await page.$eval("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(7) > div", (element) => {
            element.remove();
        });*/

        ad[username].action = "Waiting for instruction";
        ad[username].status = "OK";

        paintErrorPixels(page, username);

}

async function paintErrorPixels(page, username) {
    ad[username].action = "Detecting canvas";
    const iframe = await page.$("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div._2lTcCESjnP_DKJcPBqBFLK > iframe");
    const canvasPage = await iframe.contentFrame();
    await page.click("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div._2lTcCESjnP_DKJcPBqBFLK > iframe");

    let canvasData = await getCanvasData(canvasPage);
    let emptyCanvas = true;

    while (emptyCanvas) {
        canvasData = await getCanvasData(canvasPage);

        let sum = 0;
        for(let i = 0; i < canvasData.length; i++) {
            sum += canvasData[i];
        }

        if(sum === 0) {
            await(page.waitForTimeout(1000));
        } else {
            emptyCanvas = false;
        }
    }

    ad[username].action = "Detecting canvas errors";
    let errors = [];
    totalIncorrect = 0;
    totalPixels = 0;
    for(let x = 0; x < WIDTH; x++) {
        for(let y = 0; y < HEIGHT; y++) {
            const colorIndices = getColorIndicesForCoord(x, y, WIDTH);
            const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
            const [r, g, b, a] = [canvasData[redIndex], canvasData[greenIndex], canvasData[blueIndex], canvasData[alphaIndex]];
            const prgb = widejoyData[x][y].rgb;

            if(widejoyData[x][y] !== "NOCOLOR") {
                totalPixels++;
                if(r !== prgb.r || g !== prgb.g || b !== prgb.b) {
                    errors.push({coords: {x: x+TOP_LEFT.x, y: y+TOP_LEFT.y}, color: widejoyData[x][y].name})
                    totalIncorrect++;
                }
            }

        }
    }
    totalIncorrect = errors.length;
/*
    console.log("Detected " + totalIncorrect + " incorrect pixels.");
    console.log(`Pixels correct: ${totalPixels-totalIncorrect}/${totalPixels}. Accuracy ${((totalPixels-totalIncorrect)/totalPixels)*100}%`)*/

    ad[username].action = "Detecting error";

    let searchforErr = true;
    let error = null;
    while(searchforErr) {
        error = errors[Math.floor(Math.random() * errors.length)];
        if(error.color !== "NOCOLOR") {
            searchforErr = false;
        }
    }


    ad[username].action = "Detected error";

    colorPixel(error.coords.x, error.coords.y, error.color, page, (stat) => {
        if(stat.status === true) {
            // successful paint
            let time = (5*60 + 10)*1000;

            console.log("SUCCESSFUL PAINT ! Trying again in " + time/1000 + "s")
            ad[username].action = "Painted tile (" + error.coords.x + "," + error.coords.y + ") with color '" + error.color + "' // Waiting to paint again";
            ad[username].eta = time/1000;
            setTimeout(() => {
                paintErrorPixels(page, username)
            }, time);
        } if (stat.status === false) {
            let time = stat.time * 1000; // need to wait for color
            console.log("FAILED PAINT ! Trying again in " + time/1000 + "s")
            ad[username].eta = time/1000;
            ad[username].action = "Paint failed -- waiting for cooldown.";
            setTimeout(() => {
                paintErrorPixels(page, username)
            }, time)
        }
    }, username);

}

async function getCanvasData(canvasPage) {
    return canvasPage.$eval("pierce/canvas", (cv) => {

        let TOP_LEFT = {x: 110, y: 805}
        let WIDTH = 120
        let HEIGHT = 25

        return Object.values(cv.getContext("2d").getImageData(TOP_LEFT.x, TOP_LEFT.y, WIDTH, HEIGHT).data);
    });
}

async function colorPixel(x, y, color, page, callback, username) {

    await page.goto('https://www.reddit.com/r/place/?cx=' + x + '&cy=' + y + '&px=17');

    const iframe = await page.$("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div._2lTcCESjnP_DKJcPBqBFLK > iframe");
    const canvasPage = await iframe.contentFrame();
    await page.click("#SHORTCUT_FOCUSABLE_DIV > div:nth-child(4) > div > div > div > div._3ozFtOe6WpJEMUtxDOIvtU > div._2lTcCESjnP_DKJcPBqBFLK > iframe");

    const timeAttribute = await canvasPage.$eval("pierce/mona-lisa-color-picker", (elem) => {
        return elem.getAttribute("next-tile-available-in");
    });

    ad[username].action = "Detecting tile avaliability";

    let colors = ["dark red", "red", "orange", "yellow", "dark green", "green", "light green", "dark teal", "teal", "dark blue", "blue", "light blue", "indigo", "periwinkle", "dark purple", "purple", "pink", "light pink", "dark brown", "brown", "black", "gray", "light gray", "white"]
    let cIndex = colors.indexOf(color) + 1;

    if(!timeAttribute || timeAttribute=="0") { // WE CAN PLACE A TILE !
        await page.waitForTimeout(2000);
        ad[username].action = "Placing tile...";
        const mona_lisa_status_pill = await canvasPage.$("pierce/mona-lisa-status-pill");
        const button = await mona_lisa_status_pill.$("pierce/button");
        await button.click();


        // light blue 12
        const mona_lisa_color_picker = await canvasPage.$("pierce/mona-lisa-color-picker");
        await mona_lisa_color_picker.waitForSelector('pierce/div > div > div.palette > div:nth-child(' + cIndex + ') > button', {
            visible: true,
        });
        const wantedColor = await mona_lisa_color_picker.$('pierce/div > div > div.palette > div:nth-child(' + cIndex + ') > button');
        await wantedColor.click();

        const confirm = await mona_lisa_color_picker.$("pierce/.confirm");
        confirm.click();
        callback({status: true});
    } else {
        callback({status: false, time: parseInt(timeAttribute)});
    }
}