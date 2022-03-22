import {Drop} from "../functions/get/getCurrentDrop";
import winston from "winston";
import chalk from "chalk";
import {restartHandler} from "../functions/handler/restartHandler";

let PercentChecker = false;
let LastPercentArray: Array<number> = [];
let CurrentPercentArray: Array<number> = [];
let SamePercent = 0;

export async function SamePercentCheck(CurrentDrop: Drop) {
    CurrentPercentArray = []
    CurrentDrop.timebasedrop.forEach(timedrop => {
        CurrentPercentArray.push(timedrop.self.currentMinutesWatched)
    })

    if (!PercentChecker) {
        CurrentDrop.timebasedrop.forEach(timedrop => {
            LastPercentArray.push(timedrop.self.currentMinutesWatched)
        })
        PercentChecker = true;
    } else if (PercentChecker) {
        if (LastPercentArray === CurrentPercentArray) {
            SamePercent++;
        } else if (LastPercentArray !== CurrentPercentArray) {
            LastPercentArray = CurrentPercentArray;
            SamePercent = 0;
        }
        if (SamePercent === 3) {
            SamePercent = 0;
            PercentChecker = false;
            LastPercentArray = [];
            CurrentPercentArray = [];
            winston.info(' ')
            winston.info(chalk.yellow('All Drops have the same percentage for at least 4 tries... Looking for new Drops...'))
            await restartHandler(true, true, true, true, false)
        }
    }
}